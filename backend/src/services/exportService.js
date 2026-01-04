import { prisma } from "../config/prisma.js";
import archiver from "archiver";

class ExportService {
    async exportUserData(userId, format) {
        if (format === "json") {
            return await this.exportJSON(userId);
        } else if (format === "csv") {
            return await this.exportCSVZip(userId);
        }
        throw new Error("Formato no válido. Usa 'csv' o 'json'");
    }

    async exportJSON(userId) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                name: true,
                lastname: true,
                email: true,
                gender: true,
                isProfilePublic: true,
                createdAt: true,
            },
        });

        if (!user) {
            throw new Error("Usuario no encontrado");
        }

        const routines = await prisma.routine.findMany({
            where: { userId },
            include: {
                folder: true,
                exercises: {
                    include: {
                        exercise: {
                            include: {
                                equipment: true,
                                muscleGroup: true,
                            },
                        },
                    },
                },
            },
        });

        const completedWorkouts = await prisma.activeRoutine.findMany({
            where: { userId, status: "completed" },
            include: {
                routine: true,
                sets: {
                    include: {
                        exercise: {
                            include: {
                                equipment: true,
                                muscleGroup: true,
                            },
                        },
                    },
                },
            },
            orderBy: { endTime: "desc" },
        });

        const folders = await prisma.folder.findMany({
            where: { userId },
        });

        return {
            exportDate: new Date().toISOString(),
            user,
            folders,
            routines,
            completedWorkouts,
        };
    }

    async exportCSVZip(userId) {
        const data = await this.getExportData(userId);

        return {
            entrenamientos: this.generateEntrenamientosCSV(data.workouts),
            ejercicios: this.generateEjerciciosCSV(data.exerciseSets),
            series: this.generateSeriesCSV(data.sets),
            records_personales: this.generateRecordsCSV(data.personalRecords),
        };
    }

    async getExportData(userId) {
        const workouts = await prisma.activeRoutine.findMany({
            where: { userId, status: "completed" },
            include: {
                routine: true,
                sets: {
                    include: {
                        exercise: {
                            include: {
                                equipment: true,
                                muscleGroup: true,
                            },
                        },
                    },
                    orderBy: { order: "asc" },
                },
            },
            orderBy: { endTime: "desc" },
        });

        const sets = [];
        const exerciseSetsMap = new Map();
        const personalRecordsMap = new Map();

        workouts.forEach((workout) => {
            workout.sets.forEach((set) => {
                if (set.completed) {
                    sets.push({
                        workoutDate: workout.endTime,
                        routineName: workout.routine.name,
                        exerciseName: set.exercise.name,
                        muscleGroup: set.exercise.muscleGroup.name,
                        equipment: set.exercise.equipment.name,
                        setNumber: set.setNumber,
                        weight: set.actualWeight,
                        reps: set.actualReps,
                        isPR: set.isPR,
                    });

                    const exerciseKey = set.exerciseId;
                    if (!exerciseSetsMap.has(exerciseKey)) {
                        exerciseSetsMap.set(exerciseKey, {
                            exerciseName: set.exercise.name,
                            muscleGroup: set.exercise.muscleGroup.name,
                            totalSets: 0,
                            totalVolume: 0,
                            maxWeight: 0,
                            lastDate: workout.endTime,
                        });
                    }

                    const exerciseData = exerciseSetsMap.get(exerciseKey);
                    exerciseData.totalSets += 1;
                    exerciseData.totalVolume +=
                        (set.actualWeight || 0) * (set.actualReps || 0);
                    if (set.actualWeight > exerciseData.maxWeight) {
                        exerciseData.maxWeight = set.actualWeight;
                    }
                    if (workout.endTime > exerciseData.lastDate) {
                        exerciseData.lastDate = workout.endTime;
                    }

                    if (set.isPR) {
                        const prKey = `${set.exerciseId}-${set.actualWeight}`;
                        if (!personalRecordsMap.has(prKey)) {
                            personalRecordsMap.set(prKey, {
                                exerciseName: set.exercise.name,
                                muscleGroup: set.exercise.muscleGroup.name,
                                weight: set.actualWeight,
                                reps: set.actualReps,
                                date: workout.endTime,
                                routineName: workout.routine.name,
                            });
                        }
                    }
                }
            });
        });

        return {
            workouts: workouts.map((w) => ({
                date: w.endTime,
                routineName: w.routine.name,
                duration:
                    w.endTime && w.startTime
                        ? Math.floor(
                              (new Date(w.endTime) - new Date(w.startTime)) /
                                  1000
                          )
                        : 0,
                totalSets: w.sets.filter((s) => s.completed).length,
                totalVolume: w.sets
                    .filter((s) => s.completed)
                    .reduce(
                        (sum, s) =>
                            sum + (s.actualWeight || 0) * (s.actualReps || 0),
                        0
                    ),
            })),
            exerciseSets: Array.from(exerciseSetsMap.values()),
            sets,
            personalRecords: Array.from(personalRecordsMap.values()),
        };
    }

    generateEntrenamientosCSV(workouts) {
        const headers = [
            "Fecha",
            "Rutina",
            "Duración (min)",
            "Series completadas",
            "Volumen total (kg)",
        ];

        const rows = workouts.map((w) => [
            this.formatDate(w.date),
            this.escapeCSV(w.routineName),
            Math.floor(w.duration / 60),
            w.totalSets,
            w.totalVolume.toFixed(1),
        ]);

        return this.createCSV(headers, rows);
    }

    generateEjerciciosCSV(exercises) {
        const headers = [
            "Ejercicio",
            "Grupo muscular",
            "Series totales",
            "Volumen total (kg)",
            "Peso máximo (kg)",
            "Última vez realizado",
        ];

        const rows = exercises.map((ex) => [
            this.escapeCSV(ex.exerciseName),
            this.escapeCSV(ex.muscleGroup),
            ex.totalSets,
            ex.totalVolume.toFixed(1),
            ex.maxWeight,
            this.formatDate(ex.lastDate),
        ]);

        return this.createCSV(headers, rows);
    }

    generateSeriesCSV(sets) {
        const headers = [
            "Fecha",
            "Rutina",
            "Ejercicio",
            "Grupo muscular",
            "Equipamiento",
            "Serie",
            "Peso (kg)",
            "Repeticiones",
            "Es PR",
        ];

        const rows = sets.map((s) => [
            this.formatDate(s.workoutDate),
            this.escapeCSV(s.routineName),
            this.escapeCSV(s.exerciseName),
            this.escapeCSV(s.muscleGroup),
            this.escapeCSV(s.equipment),
            s.setNumber,
            s.weight || 0,
            s.reps || 0,
            s.isPR ? "Sí" : "No",
        ]);

        return this.createCSV(headers, rows);
    }

    generateRecordsCSV(records) {
        const headers = [
            "Ejercicio",
            "Grupo muscular",
            "Peso (kg)",
            "Repeticiones",
            "Fecha",
            "Rutina",
        ];

        const rows = records.map((r) => [
            this.escapeCSV(r.exerciseName),
            this.escapeCSV(r.muscleGroup),
            r.weight,
            r.reps,
            this.formatDate(r.date),
            this.escapeCSV(r.routineName),
        ]);

        return this.createCSV(headers, rows);
    }

    createCSV(headers, rows) {
        const headerRow = headers.join(",");
        const dataRows = rows.map((row) => row.join(",")).join("\n");
        return `${headerRow}\n${dataRows}`;
    }

    formatDate(date) {
        if (!date) return "";
        const d = new Date(date);
        return d.toISOString().split("T")[0];
    }

    escapeCSV(value) {
        if (!value) return "";
        const str = String(value);
        if (str.includes(",") || str.includes('"') || str.includes("\n")) {
            return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
    }

    createZipStream(csvFiles) {
        const archive = archiver("zip", { zlib: { level: 9 } });

        Object.entries(csvFiles).forEach(([filename, content]) => {
            archive.append(content, { name: `${filename}.csv` });
        });

        return archive;
    }
}

export default new ExportService();
