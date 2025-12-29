import { prisma } from "../config/prisma.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function findOrphanVideos() {
    const videosDir = path.join(
        __dirname,
        "../../resources/examples_exercises"
    );
    const videoFiles = fs.readdirSync(videosDir);

    const exercises = await prisma.exercise.findMany({
        where: {
            videoPath: { not: null },
        },
        select: { videoPath: true },
    });

    const validVideos = exercises.map((ex) => ex.videoPath);
    const orphanVideos = [];

    for (const file of videoFiles) {
        if (!validVideos.includes(file)) {
            orphanVideos.push(file);
        }
    }

    console.log(`Total videos en directorio: ${videoFiles.length}`);
    console.log(`Videos con ejercicio asociado: ${validVideos.length}`);
    console.log(`Videos huérfanos: ${orphanVideos.length}`);

    if (orphanVideos.length > 0) {
        console.log("\nListado de videos huérfanos:");
        orphanVideos.forEach((v) => console.log(`- ${v}`));

        console.log(
            "\nEstos videos NO tienen ejercicio asociado en la base de datos."
        );
        console.log(
            "Es seguro eliminarlos, pero se recomienda hacer backup primero."
        );

        const totalSizeMB =
            orphanVideos.reduce((acc, file) => {
                const filePath = path.join(videosDir, file);
                const stats = fs.statSync(filePath);
                return acc + stats.size;
            }, 0) /
            1024 /
            1024;

        console.log(`\nTamaño total: ${totalSizeMB.toFixed(2)} MB`);
        console.log(
            "\nPara eliminarlos automáticamente, ejecuta: npm run cleanup-orphans -- --confirm"
        );
    } else {
        console.log("\nNo se encontraron videos huérfanos. Sistema limpio.");
    }

    const shouldDelete = process.argv.includes("--confirm");
    if (shouldDelete && orphanVideos.length > 0) {
        console.log("\nEliminando videos huérfanos...");
        let deleted = 0;
        for (const file of orphanVideos) {
            const filePath = path.join(videosDir, file);
            try {
                fs.unlinkSync(filePath);
                deleted++;
                console.log(`✓ Eliminado: ${file}`);
            } catch (error) {
                console.error(`✗ Error al eliminar ${file}:`, error.message);
            }
        }
        console.log(`\nTotal eliminados: ${deleted}/${orphanVideos.length}`);
    }

    await prisma.$disconnect();
}

findOrphanVideos();
