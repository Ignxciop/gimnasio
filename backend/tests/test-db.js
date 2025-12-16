import { prisma } from "../src/config/prisma.js";

async function testDb() {
    try {
        const result = await prisma.$queryRaw`SELECT 1 as test`;
        console.log("Base de datos conectada.", result);
    } catch (error) {
        console.error("Error de conexión:", error);
    } finally {
        await prisma.$disconnect();
    }
}

testDb();
