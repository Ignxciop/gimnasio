import { prisma } from "../config/prisma.js";

async function main() {
    console.log("Iniciando seed »");

    const roles = [
        { role: "administrador" },
        { role: "manager" },
        { role: "usuario" },
    ];

    console.log("Seeding roles...");
    for (const roleData of roles) {
        const role = await prisma.role.upsert({
            where: { role: roleData.role },
            update: {},
            create: roleData,
        });
        console.log(`  ✓ Rol: ${role.role} (ID: ${role.id})`);
    }

    const equipment = [
        "Mancuerna",
        "Kettlebell",
        "Barra",
        "Peso Corporal",
        "Máquina",
        "Banda de resistencia",
        "Polea",
    ];

    console.log("\nSeeding equipamiento...");
    for (const name of equipment) {
        const equip = await prisma.equipment.upsert({
            where: { name },
            update: {},
            create: { name },
        });
        console.log(`  ✓ Equipamiento: ${equip.name} (ID: ${equip.id})`);
    }

    const muscleGroups = [
        "Hombro",
        "Bícep",
        "Trícep",
        "Antebrazo",
        "Cuádricep",
        "Pantorrilla",
        "Glúteo",
        "Abductor",
        "Adductor",
        "Dorsales",
        "Espalda Superior",
        "Espalda Inferior",
        "Pecho",
        "Cuello",
    ];

    console.log("\nSeeding grupos musculares...");
    for (const name of muscleGroups) {
        const group = await prisma.muscleGroup.upsert({
            where: { name },
            update: {},
            create: { name },
        });
        console.log(`  ✓ Grupo muscular: ${group.name} (ID: ${group.id})`);
    }

    console.log("\n✅ Seed completado exitosamente");
}

main()
    .catch((error) => {
        console.error("Error durante el seed:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
