const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = require('../../config');

const validateToken = (req, res, next) => {

    const headerToken = req.headers.authorization;

    if (headerToken != undefined && headerToken.startsWith('Bearer ')) {
        try {
            const bearerToken = headerToken.slice(7);
            jwt.verify(bearerToken, JWT_SECRET_KEY);
            next();
        } catch (err) {
            res.status(401).send({ message: "La sesión ha expirado" });
        }
    } else {
        res.status(401).send({ message: "Acceso denegado" });
    }
}

module.exports = validateToken;