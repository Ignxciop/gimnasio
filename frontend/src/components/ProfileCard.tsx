import { useState } from "react";
import {
    Mail,
    Shield,
    LogOut,
    Link,
    Eye,
    EyeOff,
    BarChart3,
    Trash2,
    Download,
    Scale,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ProfileData } from "../services/profileService";
import { profileService } from "../services/profileService";
import { authService } from "../services/authService";
import { useApiCall } from "../hooks/useApiCall";
import { useToast } from "../hooks/useToast";
import { useModal } from "../hooks/useModal";
import { useUnit } from "../hooks/useUnit";
import { ConfirmDialog } from "./ui/ConfirmDialog";
import { ExportDataModal } from "./ExportDataModal";
import { ERROR_MESSAGES } from "../config/messages";
import { GenderAwareUserIcon } from "./ui/GenderAwareUserIcon";
import "./profileCard.css";

interface ProfileCardProps {
    profileData: ProfileData;
    isOwnProfile: boolean;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
    profileData,
    isOwnProfile,
}) => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { unit, setUnit } = useUnit();
    const [isPrivate, setIsPrivate] = useState(!profileData.isProfilePublic);
    const deleteModal = useModal();
    const exportModal = useModal();

    const updatePrivacy = useApiCall(
        (isPrivate: boolean, token: string) =>
            profileService.updatePrivacy(isPrivate, token),
        {
            errorMessage: ERROR_MESSAGES.PROFILE.UPDATE_PRIVACY,
            showErrorToast: true,
        }
    );

    const deleteAccount = useApiCall(
        (token: string) => profileService.deleteAccount(token),
        {
            errorMessage: "Error al eliminar la cuenta",
            showErrorToast: true,
        }
    );

    const updateUnit = useApiCall(
        (unit: "kg" | "lbs", token: string) =>
            profileService.updateUnit(unit, token),
        {
            errorMessage: "Error al actualizar unidad de peso",
            showErrorToast: true,
        }
    );

    const handleCopyLink = () => {
        const profileUrl = `${window.location.origin}/perfil/${profileData.username}`;
        navigator.clipboard.writeText(profileUrl);
        showToast("success", "Link copiado al portapapeles");
    };

    const handleTogglePrivacy = async () => {
        const token = authService.getToken();
        if (!token) return;

        const newIsPublic = !isPrivate;
        const result = await updatePrivacy.execute(!newIsPublic, token);

        if (result !== undefined) {
            setIsPrivate(newIsPublic);
            showToast(
                "success",
                `Perfil ${newIsPublic ? "privado" : "público"} ahora`
            );
        }
    };

    const handleToggleUnit = async () => {
        const token = authService.getToken();
        if (!token) return;

        const newUnit = unit === "kg" ? "lbs" : "kg";
        const result = await updateUnit.execute(newUnit, token);

        if (result !== undefined) {
            setUnit(newUnit);
            showToast("success", `Unidad cambiada a ${newUnit.toUpperCase()}`);
        }
    };

    const handleLogout = () => {
        authService.removeToken();
        window.location.href = "/login";
    };

    const handleDeleteAccount = async () => {
        const token = authService.getToken();
        if (!token) return;

        const result = await deleteAccount.execute(token);

        if (result !== undefined) {
            authService.removeToken();
            showToast("success", "Cuenta eliminada permanentemente");
            setTimeout(() => {
                window.location.replace("/login");
            }, 500);
        }
    };

    const handleGoToStats = () => {
        navigate(`/perfil/${profileData.username}/estadisticas`);
    };

    const handleExportData = async (format: "csv" | "json") => {
        const token = authService.getToken();
        if (!token) {
            showToast("error", "No hay sesión activa");
            return;
        }

        try {
            await profileService.exportData(format, token);
            showToast(
                "success",
                format === "json"
                    ? "Backup descargado correctamente"
                    : "Datos exportados correctamente"
            );
        } catch (error) {
            showToast(
                "error",
                error instanceof Error
                    ? error.message
                    : "Error al exportar datos"
            );
        }
    };

    return (
        <div className="profile-card">
            <div className="profile-card__header">
                <div className="profile-card__avatar">
                    <GenderAwareUserIcon
                        gender={profileData.gender}
                        size={48}
                    />
                </div>
                <h2 className="profile-card__name">
                    {profileData.name} {profileData.lastname}
                </h2>
                <p className="profile-card__username">
                    @{profileData.username}
                </p>
            </div>

            <div className="profile-card__info">
                {isOwnProfile && profileData.email && (
                    <div className="profile-card__item">
                        <Mail size={20} className="profile-card__icon" />
                        <div className="profile-card__details">
                            <span className="profile-card__label">Email</span>
                            <span className="profile-card__value">
                                {profileData.email}
                            </span>
                        </div>
                    </div>
                )}

                <div className="profile-card__item">
                    <Shield size={20} className="profile-card__icon" />
                    <div className="profile-card__details">
                        <span className="profile-card__label">Rol</span>
                        <span className="profile-card__value">
                            {profileData.role.role}
                        </span>
                    </div>
                </div>
            </div>

            <div className="profile-card__actions">
                <button
                    onClick={handleGoToStats}
                    className="profile-card__action-btn profile-card__action-btn--stats"
                >
                    <BarChart3 size={20} />
                    Estadísticas
                </button>

                {isOwnProfile && (
                    <>
                        <button
                            onClick={handleCopyLink}
                            className="profile-card__action-btn"
                        >
                            <Link size={20} />
                            Copiar link del perfil
                        </button>

                        <button
                            onClick={handleTogglePrivacy}
                            className="profile-card__action-btn"
                            disabled={updatePrivacy.loading}
                        >
                            {isPrivate ? (
                                <>
                                    <EyeOff size={20} />
                                    Perfil privado
                                </>
                            ) : (
                                <>
                                    <Eye size={20} />
                                    Perfil público
                                </>
                            )}
                        </button>

                        <button
                            onClick={handleToggleUnit}
                            className="profile-card__action-btn"
                            disabled={updateUnit.loading}
                        >
                            <Scale size={20} />
                            Unidad: {unit.toUpperCase()}
                        </button>

                        <button
                            className="profile-card__logout"
                            onClick={handleLogout}
                        >
                            <LogOut size={20} />
                            Cerrar sesión
                        </button>

                        <button
                            className="profile-card__action-btn profile-card__action-btn--export"
                            onClick={exportModal.openModal}
                        >
                            <Download size={20} />
                            Exportar mis datos
                        </button>

                        <button
                            className="profile-card__delete"
                            onClick={deleteModal.openModal}
                        >
                            <Trash2 size={20} />
                            Eliminar cuenta
                        </button>

                        <ExportDataModal
                            isOpen={exportModal.isOpen}
                            onClose={exportModal.closeModal}
                            onExport={handleExportData}
                        />

                        <ConfirmDialog
                            isOpen={deleteModal.isOpen}
                            onClose={deleteModal.closeModal}
                            onConfirm={handleDeleteAccount}
                            title="¿Eliminar cuenta?"
                            message="Esta acción es permanente e irreversible. Se eliminarán todos tus datos, rutinas, ejercicios y estadísticas. ¿Estás completamente seguro?"
                            confirmText="Sí, eliminar permanentemente"
                            cancelText="Cancelar"
                            variant="danger"
                        />
                    </>
                )}
            </div>
        </div>
    );
};
