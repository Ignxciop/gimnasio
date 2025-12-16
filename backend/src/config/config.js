import dotenv from "dotenv";

dotenv.config({ quiet: true });

export const config = {
    port: process.env.PORT,
};
