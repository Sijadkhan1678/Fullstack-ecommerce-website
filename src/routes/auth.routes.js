const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getUser, register, login } = require('../controllers/auth.controller');
const config = require('../config')
const jwt = require('jsonwebtoken')
const JWT_SECRET = config.get('JWT_SECRET')

function verifyAuthToken(req, res, next) {
    try {

        const token = req.headers['token']
        if (!token) {
            return res.status(401).json({ message: "token missing" })
        }
        const decoded = jwt.verify(token, JWT_SECRET)
        req.user = decoded.user
        next()
    } catch (err) {

        return res.status(401).json({ Error: err })
    }

}
router.route('/user').get(verifyAuthToken, getUser)

router.route('/register').post([
    body('role', 'please provide role').notEmpty().trim(),
    body('fullName', 'please provide fullName', "fullname at least 4 charactors").isLength({ min: 4 }).trim(),
    body('username', 'username at least 4 charactors').isLength({ min: 4 }).trim(),
    body('email', 'please provide a valid email').isEmail().trim(),
    body('password', 'Please enter password at least 8 charactors').isLength({ min: 8 }).trim(),
], register)

router.route('/login').post([
    body('email', 'please provide a valid email').isEmail().trim(),
    body('password', 'Please enter password at least 8 charactors').isLength({ min: 8 }).trim()
], login)


// console.log('router',router)
module.exports = router
