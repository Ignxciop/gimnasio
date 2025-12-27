import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Home } from "./pages/Home";
import { Profile } from "./pages/Profile";
import { Statistics } from "./pages/Statistics";
import { Admin } from "./pages/Admin";
import { Gestion } from "./pages/Gestion";
import Rutinas from "./pages/Rutinas";
import RoutineDetail from "./pages/RoutineDetail";
import ActiveRoutine from "./pages/ActiveRoutine";
import WorkoutDay from "./pages/WorkoutDay";
import { authService } from "./services/authService";
import { ToastProvider } from "./contexts/ToastContext";

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
                <Routes>
                    <Route
                        path="/login"
                        element={
                            isAuthenticated ? (
                                <Navigate to="/inicio" replace />
                            ) : (
                                <Login onLoginSuccess={handleLoginSuccess} />
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
                                    onRegisterSuccess={handleRegisterSuccess}
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
            </BrowserRouter>
        </ToastProvider>
    );
}

export default App;
