const User = require("../models/User")
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const config = require('../config');
const JWT_SECRET = config.get("JWT_SECRET")

async function register(req, res) {

    const { role, fullName, username, email, password } = req.body

    try {

        let existingUser = await User.findOne({ email })

        if (existingUser) {

            return res.status(409).json({ message: "User registred already with this email" })
        }

        user = new User({
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
            user: {
                id: user.id,
                role: user.role
            }
        }
        const tokenExpiry = { expiresIn: '5d' }
        const token = await jwt.sign(payload, JWT_SECRET, tokenExpiry)

        res.status(201).json({ success: true, data: { token }, message: "User registered successfully" })

    } catch (error) {

        res.status(500).json({ message: "server error", error: error.message })
    }

}

async function login(req, res) {

    const { username, email, password } = req.body
    console.log(password)
    try {

        //  find user with email and username in the database
        const user = await User.findOne({ $or: [{ email }, { username }] })

        // if user not found then return invalid error or credential errror
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials" })
        }

        // compare user passwrord with database hashedpassword
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" })
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        }
        const tokenExpiry = { expiresIn: '5d' }

        const token = jwt.sign(payload, JWT_SECRET, tokenExpiry)

        res.status(200).json({ success: true, data: { token }, message: "User login successfully" })
    }
    catch (err) {

        res.status(500).json({ messsge: "server Error", error: err.message })
    }

}

module.exports = { register, login }