const config = require('../config')
const jwt = require('jsonwebtoken')
const JWT_SECRET = config.get('JWT_SECRET')

function verifyAuthToken(req, res, next) {
    try {

        const token = req.headers['token']
        if (!token) {
            return res.status(401).json({ message: "Authorization denied,token missing" })
        }
        const decoded = jwt.verify(token, JWT_SECRET)
        req.user = decoded.user
        next()
    } catch (err) {

        return res.status(401).json({ error: err })
    }

}

module.exports = verifyAuthToken