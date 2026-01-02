import dotenv from "dotenv";

dotenv.config({ quiet: true });

export const config = {
    port: process.env.PORT,
    jwt: process.env.JWT_SECRET,
    jwt_expire: process.env.JWT_EXPIRES_IN || "15m",
    refresh_jwt_expire: process.env.REFRESH_JWT_EXPIRES_IN || "7d",
};
