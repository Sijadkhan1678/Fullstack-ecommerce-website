const User = require("../models/User")
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const config = require('../config')
const JWT_SECRET = config.get("JWT_SECRET")


async function getUser(req, res) {
    res.send('get user')
}

async function register(req, res) {

    const result = validationResult(req)
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() })
    }
    const { role, fullName, username, email, password } = req.body

    try {

        const isUserExist = await User.findOne({ email })
        if (isUserExist) {

            return res.status(401).json({ message: "User registred already with this email" })
        }

        let user = new User({
            role,
            fullName,
            username,
            email,
            password
        })
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user.password = hashedPassword

        await user.save()

        const payload = {
            id: user.id
        }

        const tokenExpiry = { expiresIn: '2h' }
        const token = await jwt.sign(payload, JWT_SECRET, tokenExpiry)

        res.status(201).json({ success: true, data: token, message: "User register successfully" })

    } catch (error) {

        res.status(500).json({ message: "server error", error: error.message })
    }

}

async function login(req, res) {
    // user credential validation
    const result = validationResult(req)
    // if result not empty there will be error
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() })
    }
    const { username, email, password } = req.body
    try {
        //  find user with email in the database
        let user = await User.findOne({ email })
        // if user not found then return invalid error or credential errror 
        if (!user) {
            return res.status(401).json({ message: 'Invalid Email' })
        }
        // compare user passwrord with database hashedpassword
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect Passwrod" })
        }
        // if both condition is false then generate token for the user

        const payload = {
            id: user.id
        }
        const tokenExpiry = { expiresIn: '2h' }

        const token = jwt.sign(payload, JWT_SECRET, tokenExpiry)

        res.status(200).json({ success: true, data: token, message: "User login successfully" })
    }
    catch (err) {
        res.status(500).json({ messsge: "server Error", error: err.message })
    }

}
module.exports = { getUser, register, login }
