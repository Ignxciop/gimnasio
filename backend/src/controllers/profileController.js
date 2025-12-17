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
}

export default new ProfileController();
