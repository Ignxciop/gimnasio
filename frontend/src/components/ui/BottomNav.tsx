import React from "react";
import { NavLink } from "react-router-dom";
import "./bottomnav.css";

interface BottomNavProps {
    onLogout?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onLogout }) => {
    return (
        <nav className="bottomnav">
            <NavLink
                to="/home"
                className={({ isActive }) =>
                    "bottomnav__link" +
                    (isActive ? " bottomnav__link--active" : "")
                }
            >
                <span className="bottomnav__icon">🏠</span>
                <span className="bottomnav__label">Inicio</span>
            </NavLink>

            <NavLink to="#" className="bottomnav__link">
                <span className="bottomnav__icon">👤</span>
                <span className="bottomnav__label">Perfil</span>
            </NavLink>

            <NavLink to="#" className="bottomnav__link">
                <span className="bottomnav__icon">💪</span>
                <span className="bottomnav__label">Rutinas</span>
            </NavLink>

            <button className="bottomnav__link" onClick={onLogout}>
                <span className="bottomnav__icon">🚪</span>
                <span className="bottomnav__label">Salir</span>
            </button>
        </nav>
    );
};

export default BottomNav;
