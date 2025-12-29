import { jest, describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import express from "express";
import authRoutes from "../../routes/authRoutes.js";
import { errorHandler } from "../../middlewares/errorHandler.js";
import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use(errorHandler);

const prisma = new PrismaClient();

const E2E_PREFIX = "e2e_test_";

describe("POST /api/auth/login", () => {
    let testUserId;
    let testRoleId;
    const timestamp = Date.now();
    const testUserData = {
        name: "Test",
        lastname: "User",
        username: `${E2E_PREFIX}login_${timestamp}`,
        email: `${E2E_PREFIX}login_${timestamp}@example.com`,
        password: "Test1234",
    };

    beforeAll(async () => {
        // Crear rol de prueba
        const role = await prisma.role.upsert({
            where: { role: "usuario" },
            update: {},
            create: { role: "usuario" },
        });
        testRoleId = role.id;

        // Crear usuario de prueba
        const hashedPassword = await bcryptjs.hash(testUserData.password, 10);
        const user = await prisma.user.create({
            data: {
                name: testUserData.name,
                lastname: testUserData.lastname,
                username: testUserData.username,
                email: testUserData.email,
                password: hashedPassword,
                roleId: testRoleId,
                is_active: true,
            },
        });
        testUserId = user.id;
    });

    afterAll(async () => {
        // Limpiar usuario de prueba
        if (testUserId) {
            await prisma.user.delete({
                where: { id: testUserId },
            });
        }
        await prisma.$disconnect();
    });

    it("debería iniciar sesión exitosamente con credenciales válidas", async () => {
        const response = await request(app).post("/api/auth/login").send({
            email: testUserData.email,
            password: testUserData.password,
        });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty("token");
        expect(response.body.data).toHaveProperty("user");
        expect(response.body.data.user).toHaveProperty(
            "email",
            testUserData.email
        );
        expect(response.body.data.user).not.toHaveProperty("password");
        expect(typeof response.body.data.token).toBe("string");
        expect(response.body.data.token.length).toBeGreaterThan(0);
    });

    it("debería rechazar credenciales con email inválido", async () => {
        const response = await request(app).post("/api/auth/login").send({
            email: "noexiste@example.com",
            password: testUserData.password,
        });

        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe("Credenciales inválidas");
    });

    it("debería rechazar credenciales con password incorrecta", async () => {
        const response = await request(app).post("/api/auth/login").send({
            email: testUserData.email,
            password: "PasswordIncorrecto123",
        });

        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe("Credenciales inválidas");
    });

    it("debería rechazar datos inválidos", async () => {
        const response = await request(app).post("/api/auth/login").send({
            email: "invalid-email",
            password: "",
        });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.errors).toBeInstanceOf(Array);
    });

    it("debería rechazar usuario inactivo", async () => {
        // Desactivar usuario temporalmente
        await prisma.user.update({
            where: { id: testUserId },
            data: { is_active: false },
        });

        const response = await request(app).post("/api/auth/login").send({
            email: testUserData.email,
            password: testUserData.password,
        });

        expect(response.status).toBe(403);
        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe("Usuario inactivo");

        // Reactivar usuario
        await prisma.user.update({
            where: { id: testUserId },
            data: { is_active: true },
        });
    });
});
