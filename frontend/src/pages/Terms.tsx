import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "../styles/legalPages.css";

export default function Terms() {
    const navigate = useNavigate();

    return (
        <div className="legal-page">
            <div className="legal-container">
                <button onClick={() => navigate(-1)} className="legal-back-btn">
                    <ArrowLeft size={20} />
                    Volver
                </button>

                <h1 className="legal-title">Términos de Uso</h1>
                <p className="legal-updated">
                    Última actualización: 4 de enero de 2026
                </p>

                <section className="legal-section">
                    <h2>1. Aceptación de los Términos</h2>
                    <p>
                        Al crear una cuenta y usar esta aplicación web
                        ("Gimnasio App" o "el Servicio"), aceptas estos Términos
                        de Uso. Si no estás de acuerdo, no uses el Servicio.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>2. Sobre el Servicio</h2>
                    <p>
                        Gimnasio App es un proyecto personal desarrollado y
                        operado por <strong>José Núñez</strong>
                        (en adelante "el desarrollador"), persona física con
                        residencia en Chile.
                    </p>
                    <p>
                        La aplicación es una herramienta digital para registrar
                        y organizar información relacionada con entrenamiento
                        físico, rutinas de ejercicio y seguimiento personal.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>3. Uso Permitido</h2>
                    <p>Puedes usar Gimnasio App para:</p>
                    <ul>
                        <li>Crear y gestionar rutinas de ejercicios</li>
                        <li>Registrar tu progreso y estadísticas</li>
                        <li>Organizar tu información de entrenamiento</li>
                        <li>Personalizar tu perfil de usuario</li>
                    </ul>
                    <p>
                        <strong>No está permitido:</strong>
                    </p>
                    <ul>
                        <li>Usar el Servicio para actividades ilegales</li>
                        <li>Intentar acceder a cuentas de otros usuarios</li>
                        <li>
                            Realizar ingeniería inversa, copiar o modificar el
                            código del Servicio
                        </li>
                        <li>
                            Sobrecargar el sistema con solicitudes automatizadas
                            o excesivas
                        </li>
                        <li>
                            Publicar contenido ofensivo, ilegal o que viole
                            derechos de terceros (cuando se implementen
                            funciones sociales)
                        </li>
                    </ul>
                </section>

                <section className="legal-section">
                    <h2>4. Tu Cuenta</h2>
                    <p>Eres responsable de:</p>
                    <ul>
                        <li>Mantener la confidencialidad de tu contraseña</li>
                        <li>
                            Todas las actividades que ocurran bajo tu cuenta
                        </li>
                        <li>La veracidad de la información que proporcionas</li>
                    </ul>
                    <p>
                        Debes verificar tu correo electrónico para activar tu
                        cuenta.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>5. Contenido y Propiedad</h2>
                    <p>
                        <strong>Tu contenido:</strong> Mantienes todos los
                        derechos sobre la información que ingresas (rutinas,
                        ejercicios, estadísticas). Al usar el Servicio, nos
                        otorgas permiso para almacenar y procesar estos datos
                        únicamente para proporcionarte las funcionalidades de la
                        aplicación.
                    </p>
                    <p>
                        <strong>Contenido del Servicio:</strong> Todo el código,
                        diseño, marca y funcionalidades del Servicio son
                        propiedad del desarrollador y están protegidos por leyes
                        de propiedad intelectual.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>6. Gratuidad y Donaciones</h2>
                    <p>
                        El Servicio es <strong>100% gratuito</strong> sin planes
                        premium, anuncios o funciones bloqueadas.
                    </p>
                    <p>
                        Existe una opción <strong>voluntaria</strong> de donar
                        para apoyar el proyecto. Las donaciones:
                    </p>
                    <ul>
                        <li>Son completamente opcionales</li>
                        <li>No otorgan beneficios adicionales</li>
                        <li>No son reembolsables</li>
                        <li>Son una contribución de buena voluntad</li>
                    </ul>
                </section>

                <section className="legal-section">
                    <h2>7. Privacidad</h2>
                    <p>
                        El manejo de tus datos personales se rige por nuestra{" "}
                        <a href="/privacidad" className="legal-link">
                            Política de Privacidad
                        </a>
                        , que forma parte integral de estos Términos.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>8. Disclaimer de Salud</h2>
                    <div className="legal-warning">
                        <p>
                            <strong>IMPORTANTE:</strong> Gimnasio App es solo
                            una herramienta de registro de información.
                        </p>
                        <ul>
                            <li>
                                <strong>
                                    No proporciona consejos médicos ni de
                                    entrenamiento
                                </strong>
                            </li>
                            <li>
                                <strong>
                                    No sustituye la consulta con profesionales
                                    de la salud
                                </strong>
                            </li>
                            <li>
                                Eres responsable de tu propia salud y seguridad
                                al realizar ejercicio físico
                            </li>
                            <li>
                                Consulta a un médico o entrenador certificado
                                antes de comenzar cualquier programa de
                                ejercicios
                            </li>
                            <li>
                                El uso de esta información es bajo tu propio
                                riesgo
                            </li>
                        </ul>
                    </div>
                </section>

                <section className="legal-section">
                    <h2>9. Modificaciones del Servicio</h2>
                    <p>
                        El Servicio está en desarrollo activo. El desarrollador
                        puede:
                    </p>
                    <ul>
                        <li>Agregar, modificar o eliminar funcionalidades</li>
                        <li>Realizar mantenimiento temporal</li>
                        <li>
                            Cambiar estos Términos (se notificará por correo
                            electrónico)
                        </li>
                    </ul>
                </section>

                <section className="legal-section">
                    <h2>10. Limitación de Responsabilidad</h2>
                    <p>
                        El Servicio se proporciona "tal cual" y "según
                        disponibilidad".
                    </p>
                    <p>
                        El desarrollador <strong>NO será responsable</strong>{" "}
                        por:
                    </p>
                    <ul>
                        <li>
                            Pérdida de datos (aunque se realizan esfuerzos por
                            prevenirlo)
                        </li>
                        <li>Interrupciones del servicio</li>
                        <li>
                            Lesiones físicas o daños derivados del uso de la
                            información
                        </li>
                        <li>Daños indirectos o consecuenciales</li>
                    </ul>
                    <p>
                        <strong>Responsabilidad máxima:</strong> En caso de
                        reclamación, la responsabilidad del desarrollador estará
                        limitada al monto de donaciones voluntarias que hayas
                        realizado (si aplica).
                    </p>
                </section>

                <section className="legal-section">
                    <h2>11. Terminación de Cuenta</h2>
                    <p>
                        Puedes eliminar tu cuenta en cualquier momento desde la
                        configuración. Al hacerlo:
                    </p>
                    <ul>
                        <li>Se eliminarán todos tus datos permanentemente</li>
                        <li>No podrás recuperar la información</li>
                        <li>El proceso es irreversible</li>
                    </ul>
                    <p>
                        El desarrollador se reserva el derecho de suspender o
                        eliminar cuentas que violen estos Términos.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>12. Evolución Futura</h2>
                    <p>
                        El Servicio puede incorporar funcionalidades sociales en
                        el futuro (seguir usuarios, compartir rutinas,
                        comentarios). Cuando esto suceda:
                    </p>
                    <ul>
                        <li>Se actualizarán estos Términos</li>
                        <li>Se te notificará por correo electrónico</li>
                        <li>
                            Deberás aceptar los nuevos términos para usar las
                            nuevas funciones
                        </li>
                    </ul>
                </section>

                <section className="legal-section">
                    <h2>13. Ley Aplicable y Jurisdicción</h2>
                    <p>
                        Estos Términos se rigen por las leyes de la{" "}
                        <strong>República de Chile</strong>.
                    </p>
                    <p>
                        Cualquier disputa se resolverá en los tribunales
                        competentes de Chile.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>14. Contacto</h2>
                    <p>
                        Para preguntas, sugerencias o reportar problemas,
                        contacta a:
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
                    </div>
                </section>

                <section className="legal-section legal-final">
                    <p>
                        <strong>Al usar Gimnasio App, confirmas que:</strong>
                    </p>
                    <ul>
                        <li>Has leído y comprendido estos Términos</li>
                        <li>Aceptas cumplir con todas las condiciones</li>
                        <li>
                            Eres mayor de 18 años o tienes autorización parental
                        </li>
                        <li>Usarás el Servicio de manera responsable</li>
                    </ul>
                </section>
            </div>
        </div>
    );
}
