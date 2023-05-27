
const config = require("config");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send({ error: "Access denied: no token provided." });

    try {
        const decode_token = jwt.verify(token, config.get("jwtPrivateKey"));
        req.user = decode_token;

        next();
    } catch (error) {
        res.status(401).send({ error: "Access denied: invalid jwt provided." });
    }
}