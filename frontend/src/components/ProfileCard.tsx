import { useState } from "react";
import {
    User,
    Mail,
    Shield,
    LogOut,
    Link,
    Edit2,
    Eye,
    EyeOff,
    Check,
    X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ProfileData } from "../services/profileService";
import { profileService } from "../services/profileService";
import { authService } from "../services/authService";
import { useToast } from "../hooks/useToast";
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
    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [newUsername, setNewUsername] = useState(profileData.username);
    const [isPrivate, setIsPrivate] = useState(!profileData.isProfilePublic);
    const [loading, setLoading] = useState(false);

    const handleCopyLink = () => {
        const profileUrl = `${window.location.origin}/perfil/${profileData.username}`;
        navigator.clipboard.writeText(profileUrl);
        showToast("success", "Link copiado al portapapeles");
    };

    const handleUpdateUsername = async () => {
        if (newUsername === profileData.username) {
            setIsEditingUsername(false);
            return;
        }

        setLoading(true);
        try {
            const token = authService.getToken();
            if (!token) throw new Error("No hay token");

            await profileService.updateUsername(newUsername, token);
            showToast("success", "Nombre de usuario actualizado");
            setIsEditingUsername(false);
            navigate(`/perfil/${newUsername}`);
        } catch (error) {
            showToast(
                "error",
                error instanceof Error
                    ? error.message
                    : "Error al actualizar username"
            );
            setNewUsername(profileData.username);
        } finally {
            setLoading(false);
        }
    };

    const handleTogglePrivacy = async () => {
        setLoading(true);
        try {
            const token = authService.getToken();
            if (!token) throw new Error("No hay token");

            const newIsPublic = !isPrivate;
            await profileService.updatePrivacy(!newIsPublic, token);
            setIsPrivate(newIsPublic);
            showToast(
                "success",
                `Perfil ${newIsPublic ? "privado" : "público"} ahora`
            );
        } catch (error) {
            showToast(
                "error",
                error instanceof Error
                    ? error.message
                    : "Error al actualizar privacidad"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        authService.removeToken();
        navigate("/login");
    };

    return (
        <div className="profile-card">
            <div className="profile-card__header">
                <div className="profile-card__avatar">
                    <User size={48} />
                </div>
                <h2 className="profile-card__name">
                    {profileData.name} {profileData.lastname}
                </h2>

                {isOwnProfile && isEditingUsername ? (
                    <div className="profile-card__username-edit">
                        <input
                            type="text"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            className="profile-card__username-input"
                            disabled={loading}
                        />
                        <button
                            onClick={handleUpdateUsername}
                            className="profile-card__username-btn"
                            disabled={loading}
                        >
                            <Check size={16} />
                        </button>
                        <button
                            onClick={() => {
                                setIsEditingUsername(false);
                                setNewUsername(profileData.username);
                            }}
                            className="profile-card__username-btn profile-card__username-btn--cancel"
                            disabled={loading}
                        >
                            <X size={16} />
                        </button>
                    </div>
                ) : (
                    <div className="profile-card__username-row">
                        <p className="profile-card__username">
                            @{profileData.username}
                        </p>
                        {isOwnProfile && (
                            <button
                                onClick={() => setIsEditingUsername(true)}
                                className="profile-card__edit-btn"
                            >
                                <Edit2 size={14} />
                            </button>
                        )}
                    </div>
                )}
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

            {isOwnProfile && (
                <div className="profile-card__actions">
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
                        disabled={loading}
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
                        className="profile-card__logout"
                        onClick={handleLogout}
                    >
                        <LogOut size={20} />
                        Cerrar sesión
                    </button>
                </div>
            )}
        </div>
    );
};
