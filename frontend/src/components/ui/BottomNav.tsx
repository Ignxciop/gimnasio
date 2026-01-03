import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Dumbbell, Shield, Settings } from "lucide-react";
import { getUserFromToken } from "../../utils/getUserFromToken";
import { useUserGender } from "../../hooks/useUserGender";
import { GenderAwareUserIcon } from "./GenderAwareUserIcon";
import "./bottomnav.css";

export const BottomNav: React.FC = () => {
    const user = getUserFromToken();
    const userGender = useUserGender();
    const isAdmin = user?.roleId === 1;
    const canManage = user?.roleId === 1 || user?.roleId === 2;

    return (
        <nav className="bottomnav">
            <NavLink
                to="/inicio"
                end
                className={({ isActive }) =>
                    "bottomnav__link" +
                    (isActive ? " bottomnav__link--active" : "")
                }
            >
                <Home className="bottomnav__icon" size={22} />
                <span className="bottomnav__label">Inicio</span>
            </NavLink>

            <NavLink
                to="/rutinas"
                end
                className={({ isActive }) =>
                    "bottomnav__link" +
                    (isActive ? " bottomnav__link--active" : "")
                }
            >
                <Dumbbell className="bottomnav__icon" size={22} />
                <span className="bottomnav__label">Rutinas</span>
            </NavLink>

            <NavLink
                to={`/perfil/${user?.username}`}
                className={({ isActive }) =>
                    "bottomnav__link" +
                    (isActive ? " bottomnav__link--active" : "")
                }
            >
                <GenderAwareUserIcon
                    gender={userGender}
                    size={22}
                    className="bottomnav__icon"
                />
                <span className="bottomnav__label">Perfil</span>
            </NavLink>
            {canManage && (
                <NavLink
                    to="/gestion"
                    className={({ isActive }) =>
                        "bottomnav__link" +
                        (isActive ? " bottomnav__link--active" : "")
                    }
                >
                    <Settings className="bottomnav__icon" size={22} />
                    <span className="bottomnav__label">Gestión</span>
                </NavLink>
            )}
            {isAdmin && (
                <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                        "bottomnav__link" +
                        (isActive ? " bottomnav__link--active" : "")
                    }
                >
                    <Shield className="bottomnav__icon" size={22} />
                    <span className="bottomnav__label">Admin</span>
                </NavLink>
            )}
        </nav>
    );
};

export default BottomNav;
