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

            return res.status(401).json({ msg: "User registred already with this email" })
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

        res.status(201).json({ success: true, data:token,message:"User register successfully" })

    } catch (error) {

        res.status(500).json({ msg: "server error", error: error.message })
    }

}

async function login(req, res) {
    res.send('user login')
}
module.exports = { getUser, register, login }
