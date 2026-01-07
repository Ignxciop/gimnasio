import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Iniciando seed de la base de datos...");

    const roles = [{ role: "admin" }, { role: "usuario" }];

    for (const roleData of roles) {
        const role = await prisma.role.upsert({
            where: { role: roleData.role },
            update: {},
            create: roleData,
        });
        console.log(`✓ Rol creado/actualizado: ${role.role} (ID: ${role.id})`);
    }

    console.log("Seed completado exitosamente");
}

main()
    .catch((e) => {
        console.error("Error durante el seed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
