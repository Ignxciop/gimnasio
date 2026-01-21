import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { networkInterfaces } from "os";

// Función para obtener la IP local
function getLocalIP() {
    const nets = networkInterfaces();
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]!) {
            if (net.family === "IPv4" && !net.internal) {
                return net.address;
            }
        }
    }
    return "localhost";
}

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        host: "0.0.0.0", // Permite conexiones desde cualquier IP en la red local
        proxy: {
            "/api": {
                target: `http://${getLocalIP()}:3000`,
                changeOrigin: true,
                secure: false,
            },
            "/resources": {
                target: `http://${getLocalIP()}:3000`,
                changeOrigin: true,
                secure: false,
            },
        },
    },
});
