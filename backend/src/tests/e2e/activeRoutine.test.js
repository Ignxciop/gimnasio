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
import activeRoutineRoutes from "../../routes/activeRoutineRoutes.js";
import { errorHandler } from "../../middlewares/errorHandler.js";
import { prisma } from "../../config/prisma.js";

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/active-routines", activeRoutineRoutes);
app.use(errorHandler);

const E2E_PREFIX = "e2e_test_";
const TEST_EMAIL = `${E2E_PREFIX}active_${Date.now()}@test.com`;
const TEST_USERNAME = `${E2E_PREFIX}user_${Date.now()}`;

const createdIds = {
    userId: null,
    exerciseId: null,
    routineId: null,
    activeRoutineId: null,
    routineExerciseId: null,
};

let authToken;

beforeAll(async () => {
    const role = await prisma.role.findFirst({
        where: { role: "usuario" },
    });

    const testUser = {
        username: TEST_USERNAME,
        name: `${E2E_PREFIX}Test`,
        lastname: `${E2E_PREFIX}User`,
        email: TEST_EMAIL,
        password: "Test123!",
        gender: "male",
        roleId: role.id,
    };

    const registerResponse = await request(app)
        .post("/api/auth/register")
        .send(testUser);

    if (registerResponse.status !== 201) {
        throw new Error(
            `Test setup failed - Register: ${JSON.stringify(
                registerResponse.body
            )}`
        );
    }

    const loginResponse = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: testUser.password,
    });

    if (loginResponse.status !== 200) {
        throw new Error(
            `Test setup failed - Login: ${JSON.stringify(loginResponse.body)}`
        );
    }

    authToken = loginResponse.body.data.token;
    createdIds.userId = loginResponse.body.data.user.id;

    const equipment = await prisma.equipment.findFirst();
    const muscleGroup = await prisma.muscleGroup.findFirst();

    if (!equipment || !muscleGroup) {
        throw new Error(
            "Test setup failed - No equipment or muscle group found in database"
        );
    }

    const exercise = await prisma.exercise.create({
        data: {
            name: `${E2E_PREFIX}Exercise_${Date.now()}`,
            equipmentId: equipment.id,
            muscleGroupId: muscleGroup.id,
        },
    });
    createdIds.exerciseId = exercise.id;

    const routine = await prisma.routine.create({
        data: {
            userId: createdIds.userId,
            name: `${E2E_PREFIX}Routine_${Date.now()}`,
            description: "E2E test routine - safe to delete",
        },
    });
    createdIds.routineId = routine.id;

    const routineExercise = await prisma.routineExercise.create({
        data: {
            routineId: routine.id,
            exerciseId: exercise.id,
            sets: 3,
            repsMin: 8,
            repsMax: 12,
            weight: 50,
            restTime: 60,
            order: 0,
        },
    });
    createdIds.routineExerciseId = routineExercise.id;
});

afterAll(async () => {
    try {
        if (createdIds.activeRoutineId) {
            await prisma.activeRoutineSet.deleteMany({
                where: {
                    activeRoutineId: createdIds.activeRoutineId,
                },
            });

            await prisma.activeRoutine.deleteMany({
                where: {
                    id: createdIds.activeRoutineId,
                },
            });
        }

        if (createdIds.routineExerciseId) {
            await prisma.routineExercise.deleteMany({
                where: {
                    id: createdIds.routineExerciseId,
                },
            });
        }

        if (createdIds.routineId) {
            await prisma.routine.deleteMany({
                where: {
                    id: createdIds.routineId,
                },
            });
        }

        if (createdIds.exerciseId) {
            await prisma.exercise.deleteMany({
                where: {
                    id: createdIds.exerciseId,
                },
            });
        }

        if (createdIds.userId) {
            await prisma.user.deleteMany({
                where: {
                    id: createdIds.userId,
                },
            });
        }
    } catch (error) {
        console.error("Error during test cleanup:", error);
    } finally {
        await prisma.$disconnect();
    }
});

describe("Active Routine - Add/Remove Sets", () => {
    test("Debe crear una rutina activa", async () => {
        const response = await request(app)
            .post("/api/active-routines")
            .set("Authorization", `Bearer ${authToken}`)
            .send({ routineId: createdIds.routineId });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.sets).toHaveLength(3);

        createdIds.activeRoutineId = response.body.data.id;
    });

    test("Debe agregar una nueva serie al ejercicio", async () => {
        const response = await request(app)
            .post("/api/active-routines/sets")
            .set("Authorization", `Bearer ${authToken}`)
            .send({ exerciseId: createdIds.exerciseId });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.exerciseId).toBe(createdIds.exerciseId);
        expect(Number(response.body.data.targetWeight)).toBe(50);

        const activeRoutine = await prisma.activeRoutine.findFirst({
            where: { id: createdIds.activeRoutineId },
            include: {
                sets: {
                    where: { exerciseId: createdIds.exerciseId },
                },
            },
        });

        expect(activeRoutine.sets).toHaveLength(4);
    });

    test("No debe agregar serie si no hay rutina activa", async () => {
        await prisma.activeRoutine.updateMany({
            where: { id: createdIds.activeRoutineId },
            data: { status: "completed" },
        });

        const response = await request(app)
            .post("/api/active-routines/sets")
            .set("Authorization", `Bearer ${authToken}`)
            .send({ exerciseId: createdIds.exerciseId });

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);

        await prisma.activeRoutine.updateMany({
            where: { id: createdIds.activeRoutineId },
            data: { status: "active" },
        });
    });

    test("Debe validar que exerciseId es requerido", async () => {
        const response = await request(app)
            .post("/api/active-routines/sets")
            .set("Authorization", `Bearer ${authToken}`)
            .send({});

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });

    test("Debe eliminar una serie del ejercicio", async () => {
        const activeRoutine = await prisma.activeRoutine.findFirst({
            where: { id: createdIds.activeRoutineId },
            include: {
                sets: {
                    where: { exerciseId: createdIds.exerciseId },
                    orderBy: { order: "asc" },
                },
            },
        });

        const setToDelete = activeRoutine.sets[activeRoutine.sets.length - 1];

        const response = await request(app)
            .delete(`/api/active-routines/sets/${setToDelete.id}`)
            .set("Authorization", `Bearer ${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);

        const updatedRoutine = await prisma.activeRoutine.findFirst({
            where: { id: createdIds.activeRoutineId },
            include: {
                sets: {
                    where: { exerciseId: createdIds.exerciseId },
                },
            },
        });

        expect(updatedRoutine.sets).toHaveLength(3);
    });

    test("No debe eliminar la única serie de un ejercicio", async () => {
        const activeRoutine = await prisma.activeRoutine.findFirst({
            where: { id: createdIds.activeRoutineId },
            include: {
                sets: {
                    where: { exerciseId: createdIds.exerciseId },
                },
            },
        });

        while (activeRoutine.sets.length > 1) {
            await prisma.activeRoutineSet.delete({
                where: {
                    id: activeRoutine.sets[activeRoutine.sets.length - 1].id,
                },
            });
            activeRoutine.sets.pop();
        }

        const lastSet = activeRoutine.sets[0];

        const response = await request(app)
            .delete(`/api/active-routines/sets/${lastSet.id}`)
            .set("Authorization", `Bearer ${authToken}`);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain("única serie");
    });

    test("No debe eliminar serie inexistente", async () => {
        const response = await request(app)
            .delete(`/api/active-routines/sets/999999`)
            .set("Authorization", `Bearer ${authToken}`);

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
    });

    test("Debe mantener el orden correcto después de eliminar", async () => {
        const activeRoutine = await prisma.activeRoutine.findFirst({
            where: { id: createdIds.activeRoutineId },
            include: {
                sets: {
                    where: { exerciseId: createdIds.exerciseId },
                    orderBy: { order: "asc" },
                },
            },
        });

        while (activeRoutine.sets.length < 3) {
            await request(app)
                .post("/api/active-routines/sets")
                .set("Authorization", `Bearer ${authToken}`)
                .send({ exerciseId: createdIds.exerciseId });

            const updated = await prisma.activeRoutine.findFirst({
                where: { id: createdIds.activeRoutineId },
                include: {
                    sets: { where: { exerciseId: createdIds.exerciseId } },
                },
            });
            activeRoutine.sets = updated.sets;
        }

        const sets = await prisma.activeRoutineSet.findMany({
            where: {
                activeRoutineId: createdIds.activeRoutineId,
                exerciseId: createdIds.exerciseId,
            },
            orderBy: { order: "asc" },
        });

        const middleSet = sets[Math.floor(sets.length / 2)];

        await request(app)
            .delete(`/api/active-routines/sets/${middleSet.id}`)
            .set("Authorization", `Bearer ${authToken}`);

        const updatedSets = await prisma.activeRoutineSet.findMany({
            where: {
                activeRoutineId: createdIds.activeRoutineId,
                exerciseId: createdIds.exerciseId,
            },
            orderBy: { order: "asc" },
        });

        expect(updatedSets.length).toBe(sets.length - 1);
        updatedSets.forEach((set, index) => {
            expect(set.order).toBe(index);
        });
    });
});
