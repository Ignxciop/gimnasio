import React from "react";
import { NavLink } from "react-router-dom";
import "./leftnav.css";

interface LeftNavProps {
    onLogout?: () => void;
}

export const LeftNav: React.FC<LeftNavProps> = ({ onLogout }) => {
    return (
        <nav className="leftnav">
            <div className="leftnav__brand">
                <h2>Gimnasio</h2>
            </div>

            <ul className="leftnav__list">
                <li>
                    <NavLink
                        to="/home"
                        className={({ isActive }) =>
                            "leftnav__link" +
                            (isActive ? " leftnav__link--active" : "")
                        }
                    >
                        Dashboard
                    </NavLink>
                </li>
                <li>
                    <NavLink to="#" className="leftnav__link">
                        Perfil
                    </NavLink>
                </li>
                <li>
                    <NavLink to="#" className="leftnav__link">
                        Rutinas
                    </NavLink>
                </li>
            </ul>

            <div className="leftnav__footer">
                <button className="leftnav__logout" onClick={onLogout}>
                    Cerrar sesión
                </button>
            </div>
        </nav>
    );
};

export default LeftNav;
