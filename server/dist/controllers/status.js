// server/src/controllers/status.ts
const getStatus = (_req, res) => {
    res.json({ message: "Backend is running!", timestamp: new Date() });
};
export { getStatus };
