const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getUser, register, login, updatePassword, deleteUser, updateEmail, updateUsername } = require('../controllers/auth.controller');
const config = require('../config')
const jwt = require('jsonwebtoken')
const JWT_SECRET = config.get('JWT_SECRET')

const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/profile')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + "." + file.mimetype.split('/')[1])
    }
})
const upload = storage

router.route('/register').post([
    body('role', 'please provide role').notEmpty().trim(),
    body('fullName').isLength({ min: 4 }).withMessage('Fullname must be at least 4 characters').trim(),
    body('username').optional().trim(),
    body('email', 'please provide a valid email').isEmail().normalizeEmail(),
    body('password', 'Please enter password at least 8 characters').isLength({ min: 8 }).trim(),
], register)

router.route('/login').post([
    body('email', 'please provide a valid email').isEmail().trim(),
    body('password', 'Please enter password at least 8 characters').isLength({ min: 8 }).trim()
], login)

router.route('/users/me').get(verifyAuthToken, getUser).delete(verifyAuthToken, deleteUser)
router.route('/user/username').put([
    body("username", "Username at least 4 chararcters long").isLength({ min: 4 }).trim(),
    verifyAuthToken
], updateUsername)

router.route("/users/me/password").put([
    body('currentPassword', 'Please enter currentpassword at least 8 characters').isLength({ min: 8 }).trim(),
    body("newPassword", "Newpassword should be 8 chararacters long"),
    body('confirmPassword', 'Confirmpassword should be 8 characters').isLength({ min: 8 }).trim(),
    verifyAuthToken
], updatePassword)

router.route('/users/me/email').put([
    body('email', 'please provide a valid email').isEmail().normalizeEmail(),
    verifyAuthToken
], updateEmail)


// router.route('/avatar').put(upload.single("avatar"),updateAvatar)
// console.dir(router.stack[1].route)
module.exports = router

// middlewares
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



