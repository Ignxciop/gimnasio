import {
    jest,
    describe,
    test,
    expect,
    beforeAll,
    afterAll,
} from "@jest/globals";
import request from "supertest";
import express from "express";
import authRoutes from "../../routes/authRoutes.js";
import feedbackRoutes from "../../routes/feedbackRoutes.js";
import { errorHandler } from "../../middlewares/errorHandler.js";
import { prisma } from "../../config/prisma.js";

const E2E_PREFIX = "e2e_test_";

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use(errorHandler);

const createdIds = {
    userId: null,
    suggestionId: null,
    bugReportId: null,
};

let authToken = null;

describe("E2E: Feedback System", () => {
    beforeAll(async () => {
        const timestamp = Date.now();
        const testEmail = `${E2E_PREFIX}${timestamp}@test.com`;
        const testUsername = `${E2E_PREFIX}${timestamp}`;

        const role = await prisma.role.findFirst({
            where: { role: "usuario" },
        });

        const registerResponse = await request(app)
            .post("/api/auth/register")
            .send({
                name: "Test",
                lastname: "Feedback",
                username: testUsername,
                email: testEmail,
                password: "Test1234",
                confirmPassword: "Test1234",
                gender: "male",
                roleId: role.id,
            });

        if (registerResponse.status !== 201) {
            console.error("Error en registro:", registerResponse.body);
            throw new Error(
                `Registro falló con status ${
                    registerResponse.status
                }: ${JSON.stringify(registerResponse.body)}`
            );
        }

        createdIds.userId = registerResponse.body.data.id;

        const loginResponse = await request(app).post("/api/auth/login").send({
            email: testEmail,
            password: "Test1234",
        });

        authToken = loginResponse.body.data.token;
    });

    afterAll(async () => {
        try {
            if (createdIds.suggestionId) {
                await prisma.feedback.deleteMany({
                    where: { id: createdIds.suggestionId },
                });
            }

            if (createdIds.bugReportId) {
                await prisma.feedback.deleteMany({
                    where: { id: createdIds.bugReportId },
                });
            }

            if (createdIds.userId) {
                await prisma.user.deleteMany({
                    where: { id: createdIds.userId },
                });
            }
        } catch (error) {
            console.error("Error en limpieza de tests:", error);
        } finally {
            await prisma.$disconnect();
        }
    });

    describe("POST /api/feedback", () => {
        test("Debe crear una sugerencia correctamente", async () => {
            const response = await request(app)
                .post("/api/feedback")
                .set("Authorization", `Bearer ${authToken}`)
                .send({
                    type: "suggestion",
                    title: "Agregar ejercicio nuevo",
                    description:
                        "Sería útil agregar el ejercicio de dominadas con lastre",
                });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe(
                "Sugerencia enviada correctamente"
            );
            expect(response.body.data).toHaveProperty("id");
            expect(response.body.data.type).toBe("suggestion");
            expect(response.body.data.userId).toBe(createdIds.userId);

            createdIds.suggestionId = response.body.data.id;
        });

        test("Debe crear un reporte de bug correctamente", async () => {
            const response = await request(app)
                .post("/api/feedback")
                .set("Authorization", `Bearer ${authToken}`)
                .send({
                    type: "bug_report",
                    title: "Pantalla negra en perfil",
                    description:
                        "Al crear una rutina y luego una carpeta, al ir a Perfil la pantalla queda negra. Pasos: 1) Crear rutina, 2) Crear carpeta, 3) Navegar a perfil.",
                });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe("Reporte enviado correctamente");
            expect(response.body.data).toHaveProperty("id");
            expect(response.body.data.type).toBe("bug_report");

            createdIds.bugReportId = response.body.data.id;
        });

        test("Debe rechazar sugerencia sin descripción", async () => {
            const response = await request(app)
                .post("/api/feedback")
                .set("Authorization", `Bearer ${authToken}`)
                .send({
                    type: "suggestion",
                    title: "Solo título",
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.errors).toBeDefined();
        });

        test("Debe rechazar tipo de feedback inválido", async () => {
            const response = await request(app)
                .post("/api/feedback")
                .set("Authorization", `Bearer ${authToken}`)
                .send({
                    type: "invalid_type",
                    description:
                        "Esta es una descripción válida de al menos 10 caracteres",
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });

        test("Debe rechazar descripción muy corta", async () => {
            const response = await request(app)
                .post("/api/feedback")
                .set("Authorization", `Bearer ${authToken}`)
                .send({
                    type: "suggestion",
                    description: "Corto",
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });

        test("Debe rechazar sin token de autenticación", async () => {
            const response = await request(app).post("/api/feedback").send({
                type: "suggestion",
                description:
                    "Esta es una descripción válida de al menos 10 caracteres",
            });

            expect(response.status).toBe(401);
        });
    });

    describe("GET /api/feedback/my-feedbacks", () => {
        test("Debe obtener los feedbacks del usuario autenticado", async () => {
            const response = await request(app)
                .get("/api/feedback/my-feedbacks")
                .set("Authorization", `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBeGreaterThanOrEqual(2);
        });
    });
});
