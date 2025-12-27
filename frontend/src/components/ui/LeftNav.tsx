import React from "react";
import { NavLink } from "react-router-dom";
import { getUserFromToken } from "../../utils/getUserFromToken";
import "./leftnav.css";

export const LeftNav: React.FC = () => {
    const user = getUserFromToken();
    const isAdmin = user?.roleId === 1;
    const canManage = user?.roleId === 1 || user?.roleId === 2;

    return (
        <nav className="leftnav">
            <div className="leftnav__brand">
                <h2>Gimnasio</h2>
            </div>

            <ul className="leftnav__list">
                <li>
                    <NavLink
                        to="/inicio"
                        end
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
                        to="/rutinas"
                        className={({ isActive }) =>
                            "leftnav__link" +
                            (isActive ? " leftnav__link--active" : "")
                        }
                    >
                        Rutinas
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to={`/perfil/${user?.username}`}
                        className={({ isActive }) =>
                            "leftnav__link" +
                            (isActive ? " leftnav__link--active" : "")
                        }
                    >
                        Perfil
                    </NavLink>
                </li>
                {canManage && (
                    <li>
                        <NavLink
                            to="/gestion"
                            className={({ isActive }) =>
                                "leftnav__link" +
                                (isActive ? " leftnav__link--active" : "")
                            }
                        >
                            Gestión
                        </NavLink>
                    </li>
                )}
                {isAdmin && (
                    <li>
                        <NavLink
                            to="/admin"
                            className={({ isActive }) =>
                                "leftnav__link" +
                                (isActive ? " leftnav__link--active" : "")
                            }
                        >
                            Administración
                        </NavLink>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default LeftNav;
