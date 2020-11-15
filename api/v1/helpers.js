const jwt = require("jsonwebtoken");

const authenticateToken = async (req, res, next) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401)

    await jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        res.user = user
        next()
    })
}

module.exports = authenticateToken