import exerciseService from "../services/exerciseService.js";
import { fileTypeFromFile } from "file-type";
import { unlink } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ExerciseController {
    async getAll(req, res, next) {
        try {
            const exercises = await exerciseService.getAll();

            res.status(200).json({
                success: true,
                data: exercises,
            });
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const exercise = await exerciseService.getById(id);

            res.status(200).json({
                success: true,
                data: exercise,
            });
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const {
                name,
                equipmentId,
                muscleGroupId,
                secondaryMuscleGroupIds = [],
            } = req.body;

            let videoPath = null;

            if (req.file) {
                const filePath = path.join(
                    __dirname,
                    "../../resources/examples_exercises",
                    req.file.filename
                );

                const fileType = await fileTypeFromFile(filePath);

                if (!fileType || fileType.mime !== "video/mp4") {
                    await unlink(filePath);
                    const error = new Error(
                        "Archivo inválido detectado. Solo se permiten archivos MP4 válidos"
                    );
                    error.statusCode = 400;
                    throw error;
                }

                videoPath = req.file.filename;
            }

            const exercise = await exerciseService.create(
                name,
                equipmentId,
                muscleGroupId,
                secondaryMuscleGroupIds,
                videoPath
            );

            res.status(201).json({
                success: true,
                message: "Ejercicio creado exitosamente",
                data: exercise,
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const {
                name,
                equipmentId,
                muscleGroupId,
                secondaryMuscleGroupIds = [],
            } = req.body;

            let videoPath = null;

            if (req.file) {
                const filePath = path.join(
                    __dirname,
                    "../../resources/examples_exercises",
                    req.file.filename
                );

                const fileType = await fileTypeFromFile(filePath);

                if (!fileType || fileType.mime !== "video/mp4") {
                    await unlink(filePath);
                    const error = new Error(
                        "Archivo inválido detectado. Solo se permiten archivos MP4 válidos"
                    );
                    error.statusCode = 400;
                    throw error;
                }

                videoPath = req.file.filename;
            }

            const exercise = await exerciseService.update(
                id,
                name,
                equipmentId,
                muscleGroupId,
                secondaryMuscleGroupIds,
                videoPath
            );

            res.status(200).json({
                success: true,
                message: "Ejercicio actualizado exitosamente",
                data: exercise,
            });
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const result = await exerciseService.delete(id);

            res.status(200).json({
                success: true,
                message: result.message,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new ExerciseController();
