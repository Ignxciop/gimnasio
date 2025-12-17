import React from "react";
import { NavLink } from "react-router-dom";
import { Home, User, Dumbbell } from "lucide-react";
import "./bottomnav.css";

export const BottomNav: React.FC = () => {
    return (
        <nav className="bottomnav">
            <NavLink
                to="/home"
                className={({ isActive }) =>
                    "bottomnav__link" +
                    (isActive ? " bottomnav__link--active" : "")
                }
            >
                <Home className="bottomnav__icon" size={22} />
                <span className="bottomnav__label">Inicio</span>
            </NavLink>

            <NavLink
                to="/perfil"
                className={({ isActive }) =>
                    "bottomnav__link" +
                    (isActive ? " bottomnav__link--active" : "")
                }
            >
                <User className="bottomnav__icon" size={22} />
                <span className="bottomnav__label">Perfil</span>
            </NavLink>

            <NavLink to="#" className="bottomnav__link">
                <Dumbbell className="bottomnav__icon" size={22} />
                <span className="bottomnav__label">Rutinas</span>
            </NavLink>
        </nav>
    );
};

export default BottomNav;
