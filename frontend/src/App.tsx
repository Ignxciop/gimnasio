import { useState } from "react";
import { Login } from "./pages/Login";
import { authService } from "./services/authService";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return !!authService.getToken();
    });

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        authService.removeToken();
        setIsAuthenticated(false);
    };

    if (!isAuthenticated) {
        return <Login onLoginSuccess={handleLoginSuccess} />;
    }

    return (
        <div>
            <h1>Bienvenido!</h1>
            <button onClick={handleLogout}>Cerrar Sesión</button>
        </div>
    );
}

export default App;
