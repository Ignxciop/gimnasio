import express from "express";
import { config } from "./src/config/config.js";
import cors from "cors";
import authRoutes from "./src/routes/authRoutes.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";

const port = config.port;

const app = express();

const corsOptions = {
    origin: ["http://localhost:5173", "http://192.168.1.85:5173"],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);

app.use(errorHandler);

app.listen(port, "0.0.0.0", () => {
    console.log("Servidor iniciado » Escuchando en puerto", port);
    console.log("Accesible desde red local en http://192.168.1.85:" + port);
});
