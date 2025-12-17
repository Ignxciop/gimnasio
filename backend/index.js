import express from "express";
import { config } from "./src/config/config.js";
import cors from "cors";
import authRoutes from "./src/routes/authRoutes.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";

const port = config.port;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);

app.use(errorHandler);

app.listen(port, console.log("Servidor iniciado » Escuchando en puerto", port));
