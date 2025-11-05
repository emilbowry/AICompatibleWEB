import { config } from "../../config/config.js";
const getRole = (req, res) => {
    const user = req.session.user;
    if (!user) {
        res.json({ roles: ["DEFAULT"] });
    }
    else if (user.email === config.owner_email) {
        res.json({ roles: ["ADMIN"] });
    }
    else {
        res.json({ roles: user.role });
    }
};
export { getRole };
