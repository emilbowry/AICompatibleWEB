import { config } from "../../config/config.js";
const getRole = (req, res) => {
    const user = req.session.user;
    if (!user) {
        res.json({ role: ["DEFAULT"] });
    }
    else if (user.email === config.owner_email) {
        res.json({ role: ["ADMIN"] });
    }
    else {
        res.json({ role: user.role });
    }
};
export { getRole };
