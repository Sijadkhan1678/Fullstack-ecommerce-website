const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { register, login } = require('../controllers/auth.controller');

console.log('register ', register)

router.route('/register').post([
    body('role', 'please provide role').notEmpty().trim(),
    body('fullName', 'please provide fullName',"fullname at least 4 charactors").isLength({min:4}).trim(),
    body('username','username at least 4 charactors').isLength({min:4}).trim(),
    body('email', 'please provide a valid email').isEmail().trim(),
    body('password', 'Please enter password at least 8 charactors').isLength({ min: 6 }).trim(),
], register)

router.route('/login').post(login)


// console.log('router',router)
module.exports = router
