import React from "react";
import { User, Mail, Shield, LogOut } from "lucide-react";
import type { User as UserType } from "../types/auth.types";
import "./profileCard.css";

interface ProfileCardProps {
    user: UserType;
    onLogout: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ user, onLogout }) => {
    return (
        <div className="profile-card">
            <div className="profile-card__header">
                <div className="profile-card__avatar">
                    <User size={48} />
                </div>
                <h2 className="profile-card__name">
                    {user.name} {user.lastname}
                </h2>
                <p className="profile-card__username">@{user.username}</p>
            </div>

            <div className="profile-card__info">
                <div className="profile-card__item">
                    <Mail size={20} className="profile-card__icon" />
                    <div className="profile-card__details">
                        <span className="profile-card__label">Email</span>
                        <span className="profile-card__value">
                            {user.email}
                        </span>
                    </div>
                </div>

                <div className="profile-card__item">
                    <Shield size={20} className="profile-card__icon" />
                    <div className="profile-card__details">
                        <span className="profile-card__label">Rol</span>
                        <span className="profile-card__value">
                            {user.role.role}
                        </span>
                    </div>
                </div>

                <div className="profile-card__item">
                    <span className="profile-card__status">
                        {user.is_active ? "Cuenta activa" : "Cuenta inactiva"}
                    </span>
                </div>
            </div>

            <button className="profile-card__logout" onClick={onLogout}>
                <LogOut size={20} />
                Cerrar sesión
            </button>
        </div>
    );
};
