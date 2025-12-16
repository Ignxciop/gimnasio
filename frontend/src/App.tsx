import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { authService } from "./services/authService";

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

    const handleLogout = () => {
        authService.removeToken();
        setIsAuthenticated(false);
    };

    if (!isAuthenticated) {
        return (
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/login"
                        element={<Login onLoginSuccess={handleLoginSuccess} />}
                    />
                    <Route
                        path="/register"
                        element={
                            <Register
                                onRegisterSuccess={handleRegisterSuccess}
                            />
                        }
                    />
                    <Route
                        path="*"
                        element={<Navigate to="/login" replace />}
                    />
                </Routes>
            </BrowserRouter>
        );
    }

    return (
        <div>
            <h1>Bienvenido!</h1>
            <button onClick={handleLogout}>Cerrar Sesión</button>
        </div>
    );
}

export default App;
