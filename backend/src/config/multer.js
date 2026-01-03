import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(
            __dirname,
            "../../resources/examples_exercises"
        );
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(
            null,
            file.fieldname +
                "-" +
                uniqueSuffix +
                path.extname(file.originalname)
        );
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype !== "video/mp4") {
        return cb(
            new Error(
                "Formato de archivo no válido. Solo se permiten archivos .mp4"
            ),
            false
        );
    }

    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".mp4") {
        return cb(
            new Error(
                "Extensión de archivo no válida. Solo se permiten archivos .mp4"
            ),
            false
        );
    }

    cb(null, true);
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024,
    },
});

export { upload };
