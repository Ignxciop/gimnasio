import express from "express";
import { config } from "./src/config/config.js";
import cors from "cors";

const port = config.port;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, console.log("Servidor iniciado » Escuchando en puerto", port));
