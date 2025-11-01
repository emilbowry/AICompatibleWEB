import { config } from "../../config/config.js";
const googleLogin = (_req, res) => {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const options = {
        redirect_uri: config.google.redirectUri,
        client_id: config.google.clientId,
        access_type: "offline",
        response_type: "code",
        prompt: "consent",
        scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
        ].join(" "),
    };
    const qs = new URLSearchParams(options);
    const url = `${rootUrl}?${qs.toString()}`;
    res.redirect(url);
};
const googleCallback = (req, res) => {
    const code = req.query.code;
    console.log("Received authorization code from Google:", code);
    res.redirect(config.clientURL);
};
export { googleCallback, googleLogin };
