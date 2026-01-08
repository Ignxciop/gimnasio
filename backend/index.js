import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { config } from "./src/config/config.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { doubleCsrfProtection, generateCsrfToken } from "./src/config/csrf.js";
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
import statisticsRoutes from "./src/routes/statisticsRoutes.js";
import feedbackRoutes from "./src/routes/feedbackRoutes.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";
import { generalLimiter } from "./src/config/rateLimiter.js";

const port = config.port;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("trust proxy", true);

const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
    : process.env.NODE_ENV === "production"
    ? []
    : ["http://localhost:5173"];

const corsOptions = {
    origin: (origin, callback) => {
        if (
            process.env.NODE_ENV === "production" &&
            allowedOrigins.length === 0
        ) {
            return callback(
                new Error("CORS_ORIGIN not configured for production")
            );
        }

        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`Origin ${origin} not allowed by CORS`));
        }
    },
    credentials: true,
    maxAge: 86400,
};

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'"],
                imgSrc: ["'self'", "data:", "https:"],
                mediaSrc: ["'self'", "data:"],
                connectSrc: ["'self'"],
                fontSrc: ["'self'"],
                objectSrc: ["'none'"],
                frameSrc: ["'none'"],
                baseUri: ["'self'"],
                formAction: ["'self'"],
            },
        },
        hsts: {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true,
        },
        frameguard: {
            action: "deny",
        },
        noSniff: true,
        xssFilter: true,
        referrerPolicy: {
            policy: "strict-origin-when-cross-origin",
        },
    })
);

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        corsOrigin: process.env.CORS_ORIGIN,
        nodeEnv: process.env.NODE_ENV,
    });
});

app.get("/api/auth/csrf-token", (req, res) => {
    try {
        const token = generateCsrfToken(req, res);
        res.json({ csrfToken: token });
    } catch (error) {
        res.status(500).json({
            success: false,
            error:
                process.env.NODE_ENV === "production"
                    ? "Error generating CSRF token"
                    : error.message,
        });
    }
});

app.use(
    "/api/resources",
    cors(corsOptions),
    (req, res, next) => {
        res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
        next();
    },
    express.static(path.join(__dirname, "resources"))
);

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
app.use("/api/statistics", statisticsRoutes);
app.use("/api/feedback", feedbackRoutes);

app.use(errorHandler);

app.listen(port, "0.0.0.0", () => {
    console.log("Servidor iniciado » Escuchando en puerto", port);
});
