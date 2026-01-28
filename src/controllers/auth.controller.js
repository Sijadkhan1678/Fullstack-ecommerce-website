const User = require("../models/User")
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const config = require('../config');
const JWT_SECRET = config.get("JWT_SECRET")


async function register(req, res) {
    console.log(req.body)
    const result = validationResult(req)
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() })
    }
    const { role, fullName, username, email, password } = req.body

    try {

        let existingUser = await User.findOne({ email })

        if (existingUser) {

            return res.status(401).json({ message: "User registred already with this email" })
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
        const tokenExpiry = { expiresIn: '2h' }
        const token = await jwt.sign(payload, JWT_SECRET, tokenExpiry)

        res.status(201).json({ success: true, data: { token }, message: "User registered successfully" })

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
        const user = await User.findOne({ email })
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
            user: {
                id: user.id,
                role: user.role
            }
        }
        const tokenExpiry = { expiresIn: '2h' }

        const token = jwt.sign(payload, JWT_SECRET, tokenExpiry)

        res.status(200).json({ success: true, data: { token }, message: "User login successfully" })
    }
    catch (err) {

        res.status(500).json({ messsge: "server Error", error: err.message })
    }

}
async function getUser(req, res) {

    const userId = req.user.id
    try {
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(403).json({ message: "user not found" })
        }

        res.status(200).json({ success: true, data: user })

    } catch (err) {

        return res.status(500).json({ message: "server error", error: err.message })
    }
}

async function updateEmail(req, res) {
    const userId = req.user.id
    const { email } = req.body
    try {
        const user = await User.findByIdAndUpdate(userId, { $set: { email } })

        res.status(200).json({
            success: true,
            data: user,
            messsage: "Email successfully updated"

        })
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message })
    }
}
async function updatePassword(req, res) {

    const result = validationResult(req)

    if (!result.isEmpty()) {
        res.status(401).json({ errors: result.array() })
    }
    const { currentPassword, newPassword, confirmPassword } = req.body
    const userId = req.user.id

    try {
        if (newPassword !== confirmPassword) {
            res.status(401).json({ message: "confirm and new password does not match" })
        }
        let user = await User.findById(userId)
        const dbPassword = user.password
        const isPasswordCorrect = await bcrypt.compare(currentPassword, dbPassword)
        if (!isPasswordCorrect) {
            res.status(401).json({ message: "current password incorrect" })
        }
        const salt = await bcrypt.genSalt(12)
        const hashedPassword = await bcrypt.hash(newPassword, salt)
        user = await User.findByIdAndUpdate(user.id, { $set: { password: hashedPassword } })
        res.status(200).json({ message: "Password SuccessFully Updated" })
    }
    catch (err) {
        res.status(500).json({ message: "Server Error", Error: err.message })
    }
}
async function updateUsername(req, res) {

    const result = validationResult(req)
    if (!result.isEmpty()) {
        res.status(401).json({ errors: result.array() })
    }
    const userId = req.user.id
    const { username } = req.body
    try {
        const user = await User.findByIdAndUpdate(userId, { $set: { username } })
        res.status(200).json({ success: true, data: user, message: "username added successfully" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
async function updateAvatar(req, res) {

    console.log(req.body.data, req.file)
    userId = req.user.id
    try {
        let user = await User.findByIdAndUpdate(userId, { $set: { avatar: "url of server where avatar of user is saved" } })
        if (!user) {
            return res.status(401).json({ message: "user does not exist" })
        }

        res.status(200).json({success:true, message: "Avatar uploaded successfully" })

    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message })
    }
}

async function deleteUser(req, res) {
    const userId = req.user.id

    try {
        const user = await User.findByIdAndDelete(userId)
        if (!user) {
            res.status(401).json({ message: "user does not exist with id" })
        }
        console.log(user)
        res.status(200).json({ success: true, message: "User deleted successfully" })
    }
    catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message })
    }
}


module.exports = { getUser, register, login, updateAvatar, updatePassword, deleteUser }
