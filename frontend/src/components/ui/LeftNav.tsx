import React from "react";
import { NavLink } from "react-router-dom";
import "./leftnav.css";

export const LeftNav: React.FC = () => {
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
                    <NavLink
                        to="/perfil"
                        className={({ isActive }) =>
                            "leftnav__link" +
                            (isActive ? " leftnav__link--active" : "")
                        }
                    >
                        Perfil
                    </NavLink>
                </li>
                <li>
                    <NavLink to="#" className="leftnav__link">
                        Rutinas
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default LeftNav;
