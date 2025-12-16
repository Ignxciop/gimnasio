import dotenv from "dotenv";

dotenv.config({ quiet: true });

export const config = {
    port: process.env.PORT,
    jwt: process.env.JWT_SECRET,
    jwt_expire: process.env.JWT_EXPIRES_IN,
};
