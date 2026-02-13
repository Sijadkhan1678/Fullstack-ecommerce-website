const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getUser, register, login, updatePassword, deleteUser, updateEmail, updateUsername } = require('../controllers/auth.controller');
const verifyAuthToken = require('../middlewares/auth')
const validate = require('../middlewares/validate')
// const fileUploader = require('../middlewares/uploader')


router.route('/register').post([
    body('role', 'please provide role').notEmpty().trim(),
    body('fullName').isLength({ min: 4 }).withMessage('Fullname must be at least 4 characters').trim(),
    body('username').optional().trim(),
    body('email', 'please provide a valid email').isEmail().normalizeEmail(),
    body('password', 'Please enter password at least 8 characters').isLength({ min: 8 }).trim(),
    validate
], register)

router.route('/login').post([
    body('email', 'please provide a valid email').isEmail().trim(),
    body('password', 'Please enter password at least 8 characters').isLength({ min: 8 }).trim(),
    validate
], login)

router.route('/users/me').get(verifyAuthToken, getUser).delete(verifyAuthToken, deleteUser)

router.route('/users/username').put([
    body("username", "Username at least 4 chararcters long").isLength({ min: 4 }).trim(),
    verifyAuthToken,
    validate
], updateUsername)

router.route("/users/me/password").put([
    body('currentPassword', 'Please enter currentpassword at least 8 characters').isLength({ min: 8 }).trim(),
    body("newPassword", "Newpassword should be 8 chararacters long"),
    body('confirmPassword', 'Confirmpassword should be 8 characters').isLength({ min: 8 }).trim(),
    verifyAuthToken,
    validate
], updatePassword)

router.route('/users/me/email').put([
    body('email', 'please provide a valid email').isEmail().normalizeEmail(),
    verifyAuthToken,
    validate
], updateEmail)


// router.route('/avatar').put(fileUploader.single("avatar"),function))
// console.dir(router.stack[1].route)
module.exports = router


