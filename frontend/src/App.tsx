import { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { authService } from "./services/authService";
import { ToastProvider } from "./contexts/ToastContext";
import { UnitProvider } from "./contexts/UnitContext";
import { GlobalRestTimerProvider } from "./contexts/GlobalRestTimerContext";
import { ActionMenuProvider } from "./contexts/ActionMenuContext";
// import { ProtectedRoute } from "./components/ProtectedRoute";
import { GlobalRestTimer } from "./components/GlobalRestTimer";
import "./styles/globalRestTimer.css";
import { LOADING_MESSAGES } from "./config/messages";

const Login = lazy(() =>
    import("./pages/Login").then((m) => ({ default: m.Login })),
);
const Register = lazy(() =>
    import("./pages/Register").then((m) => ({ default: m.Register })),
);

const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Home = lazy(() =>
    import("./pages/Home").then((m) => ({ default: m.Home })),
);
const Profile = lazy(() =>
    import("./pages/Profile").then((m) => ({ default: m.Profile })),
);
const Statistics = lazy(() =>
    import("./pages/Statistics").then((m) => ({ default: m.Statistics })),
);
const AdminLayout = lazy(() =>
    import("./layouts/AdminLayout").then((m) => ({ default: m.AdminLayout })),
);
const AdminUsers = lazy(() =>
    import("./pages/admin/AdminUsers").then((m) => ({ default: m.AdminUsers })),
);
const AdminFeedback = lazy(() =>
    import("./pages/admin/AdminFeedback").then((m) => ({
        default: m.AdminFeedback,
    })),
);
const AdminDashboard = lazy(() =>
    import("./pages/admin/AdminDashboard").then((m) => ({
        default: m.AdminDashboard,
    })),
);
const AdminAudit = lazy(() =>
    import("./pages/admin/AdminAudit").then((m) => ({ default: m.AdminAudit })),
);
const GestionLayout = lazy(() =>
    import("./layouts/GestionLayout").then((m) => ({
        default: m.GestionLayout,
    })),
);
const GestionExercises = lazy(() =>
    import("./pages/gestion/GestionExercises").then((m) => ({
        default: m.GestionExercises,
    })),
);
const GestionEquipment = lazy(() =>
    import("./pages/gestion/GestionEquipment").then((m) => ({
        default: m.GestionEquipment,
    })),
);
const GestionMuscleGroups = lazy(() =>
    import("./pages/gestion/GestionMuscleGroups").then((m) => ({
        default: m.GestionMuscleGroups,
    })),
);
const Rutinas = lazy(() => import("./pages/Rutinas"));
const RoutineDetail = lazy(() => import("./pages/RoutineDetail"));
const ActiveRoutine = lazy(() => import("./pages/ActiveRoutine"));
const WorkoutDay = lazy(() => import("./pages/WorkoutDay"));
const CompletedRoutines = lazy(() => import("./pages/CompletedRoutines"));
// import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        const token = authService.getToken();
        return token ? authService.isTokenValid() : false;
    });
    const [isInitializing, setIsInitializing] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const authenticated = await authService.initializeAuth();
            setIsAuthenticated(authenticated);
            setIsInitializing(false);
        };
        initAuth();
    }, []);

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    };

    const handleRegisterSuccess = () => {
        setIsAuthenticated(true);
    };

    if (isInitializing) {
        return (
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
        );
    }

    return (
        <GlobalRestTimerProvider>
            <ToastProvider>
                <UnitProvider>
                    <ActionMenuProvider>
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
                                <GlobalRestTimer />
                                <Routes>
                                    <Route
                                        path="/login"
                                        element={
                                            isAuthenticated ? (
                                                <Navigate
                                                    to="/inicio"
                                                    replace
                                                />
                                            ) : (
                                                <Login
                                                    onLoginSuccess={
                                                        handleLoginSuccess
                                                    }
                                                />
                                            )
                                        }
                                    />
                                    <Route
                                        path="/register"
                                        element={
                                            isAuthenticated ? (
                                                <Navigate
                                                    to="/inicio"
                                                    replace
                                                />
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
                                        path="/verificar-correo"
                                        element={<VerifyEmail />}
                                    />
                                    <Route
                                        path="/terminos"
                                        element={<Terms />}
                                    />
                                    <Route
                                        path="/privacidad"
                                        element={<Privacy />}
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
                                            /*
                                            <ProtectedRoute requiredRoles={["administrador"]}>
                                                <AdminLayout />
                                            </ProtectedRoute>
                                            */
                                            <AdminLayout />
                                        }
                                    >
                                        <Route
                                            index
                                            element={<AdminDashboard />}
                                        />
                                        <Route
                                            path="usuarios"
                                            element={<AdminUsers />}
                                        />
                                        <Route
                                            path="feedback"
                                            element={<AdminFeedback />}
                                        />
                                        <Route
                                            path="auditoria"
                                            element={<AdminAudit />}
                                        />
                                    </Route>
                                    <Route
                                        path="/gestion"
                                        element={
                                            /*
                                            <ProtectedRoute requiredRoles={["manager", "administrador"]} requireAnyRole={true}>
                                                <GestionLayout />
                                            </ProtectedRoute>
                                            */
                                            <GestionLayout />
                                        }
                                    >
                                        <Route
                                            index
                                            element={<GestionExercises />}
                                        />
                                        <Route
                                            path="equipamiento"
                                            element={<GestionEquipment />}
                                        />
                                        <Route
                                            path="grupos-musculares"
                                            element={<GestionMuscleGroups />}
                                        />
                                    </Route>
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
                                                <Navigate
                                                    to="/inicio"
                                                    replace
                                                />
                                            ) : (
                                                <Navigate to="/login" replace />
                                            )
                                        }
                                    />
                                    <Route
                                        path="*"
                                        element={
                                            isAuthenticated ? (
                                                <Navigate
                                                    to="/inicio"
                                                    replace
                                                />
                                            ) : (
                                                <Navigate to="/login" replace />
                                            )
                                        }
                                    />
                                </Routes>
                            </Suspense>
                        </BrowserRouter>
                    </ActionMenuProvider>
                </UnitProvider>
            </ToastProvider>
        </GlobalRestTimerProvider>
    );
}

export default App;
