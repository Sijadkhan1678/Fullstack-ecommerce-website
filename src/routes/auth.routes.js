const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {  register, login } = require('../controllers/auth.controller');
const validate = require('../middlewares/validate')

router.route('/register').post([
    body('role', 'please provide role').notEmpty().trim(),
    body('fullName').isLength({ min: 4 }).withMessage('Fullname must be at least 4 characters').trim(),
    body('username').optional().trim(),
    body('email', 'please provide a valid email').isEmail().normalizeEmail(),
    body('password', 'Please enter password at least 8 characters').isLength({ min: 8 }).trim(),
    validate
], register)

router.route('/login').post([
    body('email', 'please provide a valid email').isEmail().normalizeEmail(),
    body('password', 'Please enter password at least 8 characters').isLength({ min: 8 }).trim(),
    validate
], login)

module.exports = router
