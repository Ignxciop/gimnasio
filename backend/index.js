import express from "express";
import { config } from "./src/config/config.js";

const app = express();
const port = config.port;

app.listen(port, console.log("Servidor iniciado » Escuchando en puerto", port));
