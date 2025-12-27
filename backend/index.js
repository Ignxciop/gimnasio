import express from "express";
import { config } from "./src/config/config.js";
import cors from "cors";
import authRoutes from "./src/routes/authRoutes.js";
import profileRoutes from "./src/routes/profileRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import equipmentRoutes from "./src/routes/equipmentRoutes.js";
import muscleGroupRoutes from "./src/routes/muscleGroupRoutes.js";
import exerciseRoutes from "./src/routes/exerciseRoutes.js";
import folderRoutes from "./src/routes/folderRoutes.js";
import routineRoutes from "./src/routes/routineRoutes.js";
import routineExerciseRoutes from "./src/routes/routineExerciseRoutes.js";
import activeRoutineRoutes from "./src/routes/activeRoutineRoutes.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";

const port = config.port;

const app = express();

const corsOptions = {
    origin: ["http://localhost:5173", "http://192.168.1.84:5173"],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/resources", express.static("resources"));

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/equipment", equipmentRoutes);
app.use("/api/muscle-groups", muscleGroupRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/routines", routineRoutes);
app.use("/api", routineExerciseRoutes);
app.use("/api/active-routines", activeRoutineRoutes);

app.use(errorHandler);

app.listen(port, "0.0.0.0", () => {
    console.log("Servidor iniciado » Escuchando en puerto", port);
    console.log("Accesible desde red local en http://localhost:" + port);
});
