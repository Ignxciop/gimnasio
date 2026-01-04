import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "../styles/legalPages.css";

export default function Privacy() {
    const navigate = useNavigate();

    return (
        <div className="legal-page">
            <div className="legal-container">
                <button onClick={() => navigate(-1)} className="legal-back-btn">
                    <ArrowLeft size={20} />
                    Volver
                </button>

                <h1 className="legal-title">Política de Privacidad</h1>
                <p className="legal-updated">
                    Última actualización: 4 de enero de 2026
                </p>

                <section className="legal-section">
                    <p>
                        <strong>José Núñez</strong> (en adelante "nosotros", "el
                        desarrollador") se compromete a proteger tu privacidad.
                        Esta Política explica qué datos recopilamos, cómo los
                        usamos y cuáles son tus derechos.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>1. Información que Recopilamos</h2>

                    <h3>1.1 Datos que nos proporcionas directamente:</h3>
                    <p>Al registrarte y usar Gimnasio App, recopilamos:</p>

                    <p>
                        <strong>Datos de cuenta:</strong>
                    </p>
                    <ul>
                        <li>
                            Email (requerido para verificación y recuperación)
                        </li>
                        <li>Nombre de usuario</li>
                        <li>Nombre y apellido</li>
                        <li>Género</li>
                        <li>Contraseña (almacenada con hash bcrypt)</li>
                    </ul>

                    <p>
                        <strong>Datos de perfil (actuales y futuros):</strong>
                    </p>
                    <ul>
                        <li>Foto de perfil (opcional)</li>
                        <li>Edad (futuro)</li>
                        <li>Peso corporal (futuro)</li>
                    </ul>

                    <p>
                        <strong>Datos de entrenamiento:</strong>
                    </p>
                    <ul>
                        <li>Rutinas de ejercicio</li>
                        <li>Ejercicios realizados</li>
                        <li>Series, repeticiones y peso levantado</li>
                        <li>Carpetas de organización</li>
                        <li>Historial de entrenamientos</li>
                        <li>Estadísticas generadas</li>
                    </ul>

                    <h3>1.2 Datos técnicos automáticos:</h3>

                    <p>
                        <strong>Autenticación:</strong>
                    </p>
                    <ul>
                        <li>Tokens de sesión (JWT)</li>
                        <li>
                            Refresh tokens (almacenados en cookies httpOnly)
                        </li>
                        <li>
                            Códigos de verificación de email (temporales,
                            hasheados)
                        </li>
                    </ul>

                    <p>
                        <strong>Cookies de preferencias (futuro):</strong>
                    </p>
                    <ul>
                        <li>Configuración de tema (claro/oscuro)</li>
                        <li>Preferencias de idioma o visualización</li>
                    </ul>

                    <p>
                        <strong>NO recopilamos:</strong>
                    </p>
                    <ul>
                        <li>Ubicación GPS</li>
                        <li>Datos de navegación externos</li>
                        <li>Información de dispositivos detallada</li>
                        <li>Analytics de comportamiento con terceros</li>
                    </ul>
                </section>

                <section className="legal-section">
                    <h2>2. Cómo Usamos tu Información</h2>
                    <p>
                        Tus datos se usan <strong>exclusivamente</strong> para:
                    </p>

                    <div className="legal-use-section">
                        <p>
                            <strong>Funcionalidad del servicio:</strong>
                        </p>
                        <ul>
                            <li>Crear y gestionar tu cuenta</li>
                            <li>Autenticación y seguridad de sesión</li>
                            <li>Almacenar tus rutinas y ejercicios</li>
                            <li>
                                Calcular y mostrar tus estadísticas personales
                            </li>
                            <li>Personalizar tu experiencia en la app</li>
                        </ul>

                        <p>
                            <strong>Comunicación esencial:</strong>
                        </p>
                        <ul>
                            <li>Verificación de email al registrarte</li>
                            <li>Recuperación de contraseña</li>
                            <li>
                                Notificaciones sobre cambios importantes en el
                                Servicio
                            </li>
                        </ul>

                        <p>
                            <strong>Mejoras del servicio:</strong>
                        </p>
                        <ul>
                            <li>Corregir errores y bugs</li>
                            <li>Optimizar rendimiento</li>
                        </ul>
                    </div>

                    <div className="legal-warning">
                        <p>
                            <strong>NO usamos tus datos para:</strong>
                        </p>
                        <ul>
                            <li>Publicidad dirigida</li>
                            <li>Venta o compartir con terceros</li>
                            <li>
                                Analytics externos (Google Analytics, Facebook
                                Pixel, etc.)
                            </li>
                            <li>
                                Entrenamiento de modelos de IA sin tu
                                consentimiento
                            </li>
                            <li>Perfilado comercial</li>
                        </ul>
                    </div>
                </section>

                <section className="legal-section">
                    <h2>3. Compartir Información</h2>
                    <p>
                        <strong>NO vendemos, alquilamos ni compartimos</strong>{" "}
                        tus datos personales con terceros.
                    </p>

                    <p>
                        <strong>Excepciones limitadas:</strong>
                    </p>
                    <ul>
                        <li>
                            <strong>Servidor de alojamiento:</strong> Tus datos
                            se almacenan en un servidor en Chile. El proveedor
                            del servidor tiene acceso técnico a la
                            infraestructura pero NO procesa ni usa tus datos.
                        </li>
                        <li>
                            <strong>Obligación legal:</strong> Si la ley chilena
                            lo requiere (orden judicial).
                        </li>
                    </ul>

                    <p>
                        <strong>Futuro (funciones sociales):</strong>
                    </p>
                    <p>
                        Cuando se implementen funciones sociales (perfiles
                        públicos, rutinas compartidas):
                    </p>
                    <ul>
                        <li>
                            <strong>Tú decidirás</strong> qué información es
                            pública
                        </li>
                        <li>Por defecto, tu perfil será privado</li>
                        <li>
                            Podrás controlar qué datos son visibles para otros
                            usuarios
                        </li>
                    </ul>
                </section>

                <section className="legal-section">
                    <h2>4. Seguridad de tus Datos</h2>
                    <p>
                        Implementamos medidas de seguridad para proteger tu
                        información:
                    </p>
                    <ul>
                        <li>
                            <strong>Contraseñas:</strong> Hasheadas con bcrypt
                            (nunca almacenadas en texto plano)
                        </li>
                        <li>
                            <strong>Autenticación:</strong> Sistema de JWT con
                            refresh tokens
                        </li>
                        <li>
                            <strong>Verificación de email:</strong> Códigos de
                            un solo uso con expiración
                        </li>
                        <li>
                            <strong>Cookies seguras:</strong> Atributos httpOnly
                            y secure en producción
                        </li>
                        <li>
                            <strong>Base de datos:</strong> PostgreSQL con
                            acceso restringido
                        </li>
                        <li>
                            <strong>Servidor:</strong> Alojado en Chile con
                            medidas de seguridad estándar
                        </li>
                    </ul>

                    <p>
                        <strong>Backups:</strong> Se realizan copias de
                        seguridad periódicas para prevenir pérdida de datos. Los
                        backups se almacenan de forma segura y se eliminan según
                        políticas de retención.
                    </p>

                    <p>
                        <strong>Limitaciones:</strong> Ningún sistema es 100%
                        seguro. Aunque tomamos precauciones, no podemos
                        garantizar seguridad absoluta.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>5. Retención de Datos</h2>
                    <p>
                        Tus datos se conservan mientras tu cuenta esté activa.
                    </p>

                    <p>
                        <strong>Al eliminar tu cuenta:</strong>
                    </p>
                    <ul>
                        <li>
                            Todos tus datos personales se eliminan
                            permanentemente
                        </li>
                        <li>No se conserva información identificable</li>
                        <li>El proceso es irreversible</li>
                        <li>
                            La eliminación ocurre de inmediato (sin período de
                            gracia)
                        </li>
                    </ul>

                    <p>
                        <strong>Backups:</strong> Los datos en backups antiguos
                        se sobrescribirán en el siguiente ciclo de respaldo.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>6. Tus Derechos</h2>
                    <p>Tienes derecho a:</p>
                    <ul>
                        <li>
                            <strong>Acceder</strong> a tus datos (puedes verlos
                            en tu perfil)
                        </li>
                        <li>
                            <strong>Rectificar</strong> datos incorrectos
                            (edición de perfil)
                        </li>
                        <li>
                            <strong>Eliminar</strong> tu cuenta y todos tus
                            datos
                        </li>
                        <li>
                            <strong>Exportar</strong> tus datos (funcionalidad
                            futura)
                        </li>
                        <li>
                            <strong>Oponerte</strong> al procesamiento de tus
                            datos (eliminando tu cuenta)
                        </li>
                        <li>
                            <strong>Revocar consentimiento</strong> en cualquier
                            momento
                        </li>
                    </ul>
                    <p>
                        Para ejercer estos derechos, contacta a:{" "}
                        <a
                            href="mailto:josenunezm2001@gmail.com"
                            className="legal-link"
                        >
                            josenunezm2001@gmail.com
                        </a>
                    </p>
                </section>

                <section className="legal-section">
                    <h2>7. Cookies</h2>
                    <p>
                        <strong>Uso actual de cookies:</strong>
                    </p>

                    <table className="legal-table">
                        <thead>
                            <tr>
                                <th>Cookie</th>
                                <th>Propósito</th>
                                <th>Duración</th>
                                <th>Tipo</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>refreshToken</td>
                                <td>Mantener sesión activa</td>
                                <td>7 días</td>
                                <td>Esencial</td>
                            </tr>
                        </tbody>
                    </table>

                    <p>
                        <strong>Futuro:</strong> Se podrían usar cookies de
                        preferencias (tema, idioma). En ese caso, esta política
                        se actualizará.
                    </p>

                    <p>
                        <strong>NO usamos:</strong>
                    </p>
                    <ul>
                        <li>Cookies de publicidad</li>
                        <li>Cookies de terceros (analytics)</li>
                        <li>Cookies de tracking</li>
                    </ul>

                    <p>
                        Puedes bloquear cookies desde tu navegador, pero algunas
                        funcionalidades no funcionarán (como mantener sesión
                        iniciada).
                    </p>
                </section>

                <section className="legal-section">
                    <h2>8. Transferencia Internacional de Datos</h2>
                    <p>
                        Tus datos se almacenan en{" "}
                        <strong>servidores ubicados en Chile</strong>.
                    </p>
                    <p>
                        No hay transferencia internacional de datos a otros
                        países.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>9. Menores de Edad</h2>
                    <p>
                        Gimnasio App está diseñada para mayores de{" "}
                        <strong>18 años</strong>.
                    </p>
                    <p>
                        Si eres menor de 18 años, necesitas autorización de un
                        padre o tutor legal para usar el Servicio.
                    </p>
                    <p>
                        Si descubrimos que un menor de 13 años creó una cuenta
                        sin autorización, la eliminaremos inmediatamente.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>10. Cambios en esta Política</h2>
                    <p>
                        Podemos actualizar esta Política de Privacidad cuando:
                    </p>
                    <ul>
                        <li>Se agreguen nuevas funcionalidades</li>
                        <li>Cambien prácticas de datos</li>
                        <li>Se requiera por cambios legales</li>
                    </ul>
                    <p>
                        <strong>Te notificaremos</strong> por email sobre
                        cambios significativos.
                    </p>
                    <p>
                        Fecha de última modificación: aparece al inicio de este
                        documento.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>11. Proyecto Personal</h2>
                    <div className="legal-highlight">
                        <p>
                            <strong>Transparencia total:</strong>
                        </p>
                        <p>
                            Gimnasio App es un proyecto personal desarrollado
                            por una sola persona (José Núñez) sin respaldo
                            corporativo ni inversores.
                        </p>
                        <p>Esto significa:</p>
                        <ul>
                            <li>No hay "big tech" vigilando tus datos</li>
                            <li>
                                No hay presión comercial para monetizar tu
                                información
                            </li>
                            <li>
                                Desarrollo enfocado en utilidad, no en
                                extracción de datos
                            </li>
                            <li>
                                ⚠️ Recursos técnicos limitados (servidor,
                                almacenamiento)
                            </li>
                        </ul>
                        <p>
                            El compromiso personal del desarrollador es respetar
                            tu privacidad, pero debes ser consciente de las
                            limitaciones de un proyecto independiente.
                        </p>
                    </div>
                </section>

                <section className="legal-section">
                    <h2>12. Contacto y Preguntas</h2>
                    <p>
                        Para cualquier duda sobre esta Política de Privacidad o
                        ejercer tus derechos:
                    </p>
                    <div className="legal-contact">
                        <p>
                            <strong>José Núñez</strong>
                        </p>
                        <p>
                            Email:{" "}
                            <a
                                href="mailto:josenunezm2001@gmail.com"
                                className="legal-link"
                            >
                                josenunezm2001@gmail.com
                            </a>
                        </p>
                        <p>Respuesta estimada: 5-7 días hábiles.</p>
                    </div>
                </section>

                <section className="legal-section legal-final">
                    <p>
                        <strong>Al usar Gimnasio App, confirmas que:</strong>
                    </p>
                    <ul>
                        <li>Has leído esta Política de Privacidad</li>
                        <li>Comprendes cómo se usan tus datos</li>
                        <li>
                            Das tu consentimiento para el procesamiento descrito
                        </li>
                    </ul>
                </section>
            </div>
        </div>
    );
}
