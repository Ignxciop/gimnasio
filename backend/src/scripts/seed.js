import { prisma } from "../config/prisma.js";

async function main() {
    console.log("Iniciando seed de roles »");

    const roles = ["administrador", "manager", "usuario"];

    for (const roleData of roles) {
        const role = await prisma.role.upsert({
            where: { role: roleData.role },
            update: {},
            create: roleData,
        });
        console.log(`Rol creado/verificado: ${role.role} (ID: ${role.id})`);
    }

    console.log("Seed completado exitosamente");
}

main()
    .catch((error) => {
        console.error("Error durante el seed:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
