import { doubleCsrf } from "csrf-csrf";

const { doubleCsrfProtection, generateCsrfToken } = doubleCsrf({
    getSecret: () =>
        process.env.CSRF_SECRET || "csrf_secret_change_in_production",
    getSessionIdentifier: (req) => req.session?.id || "",
    cookieName: "x-csrf-token",
    cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
    },
    size: 64,
    ignoredMethods: ["GET", "HEAD", "OPTIONS"],
});

export { doubleCsrfProtection, generateCsrfToken };
