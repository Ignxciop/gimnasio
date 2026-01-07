import React from "react";
import { FileText } from "lucide-react";
import "../../styles/adminAudit.css";

export const AdminAudit: React.FC = () => {
    return (
        <section className="admin-audit">
            <div className="admin-audit__header">
                <h2 className="admin-audit__title">Auditoría del Sistema</h2>
                <p className="admin-audit__subtitle">
                    Registro de eventos y actividades del sistema
                </p>
            </div>

            <div className="admin-audit__placeholder">
                <div className="admin-audit__icon">
                    <FileText size={64} />
                </div>
                <h3 className="admin-audit__placeholder-title">
                    Módulo de Auditoría Próximamente
                </h3>
                <p className="admin-audit__placeholder-text">
                    Este módulo permitirá visualizar y gestionar logs de
                    actividad, cambios en el sistema y eventos de seguridad.
                </p>
                <div className="admin-audit__features">
                    <div className="admin-audit__feature">
                        Registro de acciones administrativas
                    </div>
                    <div className="admin-audit__feature">
                        Historial de cambios en usuarios
                    </div>
                    <div className="admin-audit__feature">
                        Eventos de seguridad
                    </div>
                    <div className="admin-audit__feature">
                        Exportación de reportes
                    </div>
                </div>
            </div>
        </section>
    );
};
