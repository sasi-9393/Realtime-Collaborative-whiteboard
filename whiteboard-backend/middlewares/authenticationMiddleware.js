const jwt = require("jsonwebtoken");


authMiddleware = (req, res, next) => {
    const token = req.header("authorization");

    if (!token) return res.status(401).json({ error: "Access Denied: No Token" });

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET_KEY);
        req.email = decoded.email;
        req.name = decoded.name;
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid Token" });
    }
};
module.exports = authMiddleware;
