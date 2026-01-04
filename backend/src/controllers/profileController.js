import profileService from "../services/profileService.js";
import exportService from "../services/exportService.js";

class ProfileController {
    async getProfile(req, res, next) {
        try {
            const userId = req.user.userId;
            const user = await profileService.getUserProfile(userId);

            res.status(200).json({
                success: true,
                message: "Perfil obtenido exitosamente",
                data: user,
            });
        } catch (error) {
            next(error);
        }
    }

    async getProfileByUsername(req, res, next) {
        try {
            const { username } = req.params;
            const requesterId = req.user ? req.user.userId : null;

            const user = await profileService.getProfileByUsername(
                username,
                requesterId
            );

            res.status(200).json({
                success: true,
                data: user,
            });
        } catch (error) {
            next(error);
        }
    }

    async updatePrivacy(req, res, next) {
        try {
            const userId = req.user.userId;
            const { isPublic } = req.body;

            const updatedUser = await profileService.updateProfilePrivacy(
                userId,
                isPublic
            );

            res.status(200).json({
                success: true,
                message: "Privacidad del perfil actualizada exitosamente",
                data: updatedUser,
            });
        } catch (error) {
            next(error);
        }
    }

    async updateUnit(req, res, next) {
        try {
            const userId = req.user.userId;
            const { unit } = req.body;

            const updatedUser = await profileService.updatePreferredUnit(
                userId,
                unit
            );

            res.status(200).json({
                success: true,
                message: "Unidad de peso actualizada exitosamente",
                data: updatedUser,
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteAccount(req, res, next) {
        try {
            const userId = req.user.userId;

            await profileService.deleteAccount(userId);

            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
            });

            res.status(200).json({
                success: true,
                message: "Cuenta eliminada permanentemente",
            });
        } catch (error) {
            next(error);
        }
    }

    async exportData(req, res, next) {
        try {
            const userId = req.user.userId;
            const { format } = req.query;

            if (!format || !["csv", "json"].includes(format)) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Formato inválido. Usa 'csv' o 'json' como parámetro",
                });
            }

            const data = await exportService.exportUserData(userId, format);
            const date = new Date().toISOString().split("T")[0];

            if (format === "json") {
                res.setHeader("Content-Type", "application/json");
                res.setHeader(
                    "Content-Disposition",
                    `attachment; filename=gimnasio_backup_${date}.json`
                );
                return res.status(200).json(data);
            }

            if (format === "csv") {
                const archive = exportService.createZipStream(data);

                res.setHeader("Content-Type", "application/zip");
                res.setHeader(
                    "Content-Disposition",
                    `attachment; filename=gimnasio_datos_${date}.zip`
                );

                archive.on("error", (err) => {
                    throw err;
                });

                archive.pipe(res);
                archive.finalize();
            }
        } catch (error) {
            next(error);
        }
    }
}

export default new ProfileController();
