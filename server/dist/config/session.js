import { config } from "./config.js";
const sessionConfig = {
    secret: process.env.SESSION_SECRET ||
        "a_very_secret_and_long_string_for_signing_cookies",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: config.isProduction,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
};
export { sessionConfig };
