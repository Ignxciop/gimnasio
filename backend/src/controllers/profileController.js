import profileService from "../services/profileService.js";

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

    async checkUsername(req, res, next) {
        try {
            const { username } = req.query;
            const userId = req.user.userId;

            const availability = await profileService.checkUsernameAvailability(
                username,
                userId
            );

            res.status(200).json({
                success: true,
                data: availability,
            });
        } catch (error) {
            next(error);
        }
    }

    async updateUsername(req, res, next) {
        try {
            const userId = req.user.userId;
            const { username } = req.body;

            const updatedUser = await profileService.updateUsername(
                userId,
                username
            );

            res.status(200).json({
                success: true,
                message: "Nombre de usuario actualizado exitosamente",
                data: updatedUser,
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
}

export default new ProfileController();
