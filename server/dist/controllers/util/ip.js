// server/src/controllers/ip.ts
const getIp = (req, res) => {
    const ip = req.ip;
    console.log(`IP address request from: ${ip}`);
    res.json({ ip });
};
export { getIp };
