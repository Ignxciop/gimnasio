import { useState, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { authService } from "./services/authService";
import { ToastProvider } from "./contexts/ToastContext";
import { LOADING_MESSAGES } from "./config/messages";

const Login = lazy(() =>
    import("./pages/Login").then((m) => ({ default: m.Login }))
);
const Register = lazy(() =>
    import("./pages/Register").then((m) => ({ default: m.Register }))
);
const Home = lazy(() =>
    import("./pages/Home").then((m) => ({ default: m.Home }))
);
const Profile = lazy(() =>
    import("./pages/Profile").then((m) => ({ default: m.Profile }))
);
const Statistics = lazy(() =>
    import("./pages/Statistics").then((m) => ({ default: m.Statistics }))
);
const Admin = lazy(() =>
    import("./pages/Admin").then((m) => ({ default: m.Admin }))
);
const Gestion = lazy(() =>
    import("./pages/Gestion").then((m) => ({ default: m.Gestion }))
);
const Rutinas = lazy(() => import("./pages/Rutinas"));
const RoutineDetail = lazy(() => import("./pages/RoutineDetail"));
const ActiveRoutine = lazy(() => import("./pages/ActiveRoutine"));
const WorkoutDay = lazy(() => import("./pages/WorkoutDay"));
const CompletedRoutines = lazy(() => import("./pages/CompletedRoutines"));

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return !!authService.getToken();
    });

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    };

    const handleRegisterSuccess = () => {
        setIsAuthenticated(true);
    };

    return (
        <ToastProvider>
            <BrowserRouter>
                <Suspense
                    fallback={
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "100vh",
                                fontSize: "1.2rem",
                                color: "#666",
                            }}
                        >
                            {LOADING_MESSAGES.GENERIC}
                        </div>
                    }
                >
                    <Routes>
                        <Route
                            path="/login"
                            element={
                                isAuthenticated ? (
                                    <Navigate to="/inicio" replace />
                                ) : (
                                    <Login
                                        onLoginSuccess={handleLoginSuccess}
                                    />
                                )
                            }
                        />

                        <Route
                            path="/register"
                            element={
                                isAuthenticated ? (
                                    <Navigate to="/inicio" replace />
                                ) : (
                                    <Register
                                        onRegisterSuccess={
                                            handleRegisterSuccess
                                        }
                                    />
                                )
                            }
                        />

                        <Route
                            path="/inicio"
                            element={
                                isAuthenticated ? (
                                    <Home />
                                ) : (
                                    <Navigate to="/login" replace />
                                )
                            }
                        />

                        <Route
                            path="/day/:year/:month/:day"
                            element={
                                isAuthenticated ? (
                                    <WorkoutDay />
                                ) : (
                                    <Navigate to="/login" replace />
                                )
                            }
                        />

                        <Route
                            path="/perfil/:username"
                            element={
                                isAuthenticated ? (
                                    <Profile />
                                ) : (
                                    <Navigate to="/login" replace />
                                )
                            }
                        />

                        <Route
                            path="/perfil/:username/estadisticas"
                            element={
                                isAuthenticated ? (
                                    <Statistics />
                                ) : (
                                    <Navigate to="/login" replace />
                                )
                            }
                        />

                        <Route
                            path="/perfil/:username/rutinas"
                            element={
                                isAuthenticated ? (
                                    <CompletedRoutines />
                                ) : (
                                    <Navigate to="/login" replace />
                                )
                            }
                        />

                        <Route
                            path="/admin"
                            element={
                                isAuthenticated ? (
                                    <Admin />
                                ) : (
                                    <Navigate to="/login" replace />
                                )
                            }
                        />

                        <Route
                            path="/gestion"
                            element={
                                isAuthenticated ? (
                                    <Gestion />
                                ) : (
                                    <Navigate to="/login" replace />
                                )
                            }
                        />

                        <Route
                            path="/rutinas"
                            element={
                                isAuthenticated ? (
                                    <Rutinas />
                                ) : (
                                    <Navigate to="/login" replace />
                                )
                            }
                        />

                        <Route
                            path="/rutinas/:id"
                            element={
                                isAuthenticated ? (
                                    <RoutineDetail />
                                ) : (
                                    <Navigate to="/login" replace />
                                )
                            }
                        />

                        <Route
                            path="/rutinas/:routineId/activa/:activeId"
                            element={
                                isAuthenticated ? (
                                    <ActiveRoutine />
                                ) : (
                                    <Navigate to="/login" replace />
                                )
                            }
                        />

                        <Route
                            path="/"
                            element={
                                isAuthenticated ? (
                                    <Navigate to="/inicio" replace />
                                ) : (
                                    <Navigate to="/login" replace />
                                )
                            }
                        />

                        <Route
                            path="*"
                            element={
                                isAuthenticated ? (
                                    <Navigate to="/inicio" replace />
                                ) : (
                                    <Navigate to="/login" replace />
                                )
                            }
                        />
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </ToastProvider>
    );
}

export default App;
