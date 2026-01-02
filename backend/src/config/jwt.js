import jwt from "jsonwebtoken";
import crypto from "crypto";
import { config } from "./config.js";

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET no está definido en las variables de entorno");
}

const JWT_SECRET = config.jwt;
const JWT_EXPIRES_IN = config.jwt_expire;
const REFRESH_JWT_EXPIRES_IN = config.refresh_jwt_expire;

export const generateToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
};

export const generateRefreshToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: REFRESH_JWT_EXPIRES_IN,
    });
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

export const hashToken = (token) => {
    return crypto.createHash("sha256").update(token).digest("hex");
};
