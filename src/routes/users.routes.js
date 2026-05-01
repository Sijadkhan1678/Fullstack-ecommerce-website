const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getUser, updatePassword, deleteUser, updateEmail, updateUsername } = require('../controllers/users.controller');
const verifyAuthToken = require('../middlewares/auth')
const validate = require('../middlewares/validate')
// const fileUploader = require('../middlewares/uploader')

router.route('/me').get(verifyAuthToken, getUser).delete(verifyAuthToken, deleteUser)

router.route('/me/username').put([
    body("username", "Username at least 4 chararcters long").isLength({ min: 4 }).trim(),
    verifyAuthToken,
    validate
], updateUsername)

router.route("/me/password").put([
    body('currentPassword', 'Please enter currentpassword at least 8 characters').isLength({ min: 8 }).trim(),
    body("newPassword", "Newpassword should be 8 chararacters long"),
    body('confirmPassword', 'Confirmpassword should be 8 characters').isLength({ min: 8 }).trim(),
    verifyAuthToken,
    validate
], updatePassword)

router.route('/me/email').put([
    body('email', 'please provide a valid email').isEmail().normalizeEmail(),
    verifyAuthToken,
    validate
], updateEmail)


// router.route('/me/avatar').put(fileUploader.single("avatar"),function))
// console.dir(router.stack[1].route)
module.exports = router


