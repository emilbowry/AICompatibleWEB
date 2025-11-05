// server/src/controllers/ip.ts
const getIp = (req, res) => {
    const ip = req.ip;
    res.json({ ip });
};
export { getIp };
