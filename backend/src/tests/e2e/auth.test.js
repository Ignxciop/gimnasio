import { jest, describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import express from "express";
import authRoutes from "../../routes/authRoutes.js";
import { errorHandler } from "../../middlewares/errorHandler.js";
import { prisma } from "../../config/prisma.js";

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use(errorHandler);

describe("POST /api/auth/register", () => {
    const testUserIds = [];
    let testRoleId;

    beforeAll(async () => {
        const role = await prisma.role.upsert({
            where: { role: "usuario" },
            update: {},
            create: { role: "usuario" },
        });
        testRoleId = role.id;
    });

    afterAll(async () => {
        if (testUserIds.length > 0) {
            await prisma.user.deleteMany({
                where: {
                    id: {
                        in: testUserIds,
                    },
                },
            });
            console.log(`✓ Limpiados ${testUserIds.length} usuarios de prueba`);
        }
        await prisma.$disconnect();
    });

    it("debería registrar un usuario correctamente", async () => {
        const uniqueEmail = `test${Date.now()}@example.com`;
        const uniqueUsername = `testuser${Date.now()}`;

        const response = await request(app).post("/api/auth/register").send({
            name: "Test",
            lastname: "User",
            username: uniqueUsername,
            email: uniqueEmail,
            password: "Test1234",
            roleId: testRoleId,
        });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty("id");
        expect(response.body.data.email).toBe(uniqueEmail);
        expect(response.body.data).not.toHaveProperty("password");

        if (response.body.data?.id) {
            testUserIds.push(response.body.data.id);
        }
    });

    it("debería rechazar datos inválidos", async () => {
        const response = await request(app).post("/api/auth/register").send({
            name: "T",
            lastname: "",
            username: "ab",
            email: "invalid-email",
            password: "123",
            roleId: "abc",
        });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.errors).toBeInstanceOf(Array);
    });

    it("debería rechazar email duplicado", async () => {
        const uniqueEmail = `duplicate${Date.now()}@example.com`;
        const username1 = `user1${Date.now()}`;
        const username2 = `user2${Date.now()}`;

        const firstResponse = await request(app)
            .post("/api/auth/register")
            .send({
                name: "User",
                lastname: "One",
                username: username1,
                email: uniqueEmail,
                password: "Test1234",
                roleId: testRoleId,
            });

        if (firstResponse.body.data?.id) {
            testUserIds.push(firstResponse.body.data.id);
        }

        const response = await request(app).post("/api/auth/register").send({
            name: "User",
            lastname: "Two",
            username: username2,
            email: uniqueEmail,
            password: "Test1234",
            roleId: testRoleId,
        });

        expect(response.status).toBe(409);
        expect(response.body.success).toBe(false);
    });

    it("debería rechazar username duplicado", async () => {
        const uniqueUsername = `duplicate${Date.now()}`;
        const email1 = `user1${Date.now()}@example.com`;
        const email2 = `user2${Date.now()}@example.com`;

        const firstResponse = await request(app)
            .post("/api/auth/register")
            .send({
                name: "User",
                lastname: "One",
                username: uniqueUsername,
                email: email1,
                password: "Test1234",
                roleId: testRoleId,
            });

        if (firstResponse.body.data?.id) {
            testUserIds.push(firstResponse.body.data.id);
        }

        const response = await request(app).post("/api/auth/register").send({
            name: "User",
            lastname: "Two",
            username: uniqueUsername,
            email: email2,
            password: "Test1234",
            roleId: testRoleId,
        });

        expect(response.status).toBe(409);
        expect(response.body.success).toBe(false);
    });
});
