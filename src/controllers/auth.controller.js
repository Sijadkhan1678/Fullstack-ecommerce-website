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
        const tokenExpiry = { expiresIn: '2h' }
        const token = await jwt.sign(payload, JWT_SECRET, tokenExpiry)

        res.status(201).json({ success: true, data: { token }, message: "User registered successfully" })

    } catch (error) {

        res.status(500).json({ message: "server error", error: error.message })
    }

}

async function login(req, res) {

    const { username, email, password } = req.body
    try {
        //  find user with email and username in the database
        const user = await User.findOne({ $or: [{email},{ username}] })

        // compare user passwrord with database hashedpassword
        const isMatch = await bcrypt.compare(password, user.password)
        // if user not found then return invalid error or credential errror 
        // if both condition is false then generate token for the user
        if (!user || !isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" })
        }

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
        const user = await User.findById(userId).select('-password').lean();
        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User account no longer exists"
            });
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
        const user = await User.findByIdAndUpdate(userId, { $set: { email } }).select('-password').lean()

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

    const { currentPassword, newPassword, confirmPassword } = req.body
    const userId = req.user.id

    try {

        if (newPassword !== confirmPassword) {
            return res.status(401).json({ message: "confirm and new password does not match" })
        }
        const user = await User.findById(userId).lean()
        const dbPassword = user.password
        const isMatch = await bcrypt.compare(currentPassword, dbPassword)
        if (!isMatch) {
            return res.status(401).json({ message: "current password incorrect" })
        }
        const salt = await bcrypt.genSalt(12)
        const hashedPassword = await bcrypt.hash(newPassword, salt)
        await User.findByIdAndUpdate(user.id, { $set: { password: hashedPassword } })
        res.status(200).json({ message: "Password SuccessFully Updated" })
    }
    catch (err) {
        res.status(500).json({ message: "Server Error", Error: err.message })
    }
}
async function updateUsername(req, res) {

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

        res.status(200).json({ success: true, message: "Avatar uploaded successfully" })

    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message })
    }
}

async function deleteUser(req, res) {

    const userId = req.user.id

    try {
        const user = await User.findByIdAndDelete(userId)
        if (!user) {
            return res.status(401).json({ message: "user does not exist with id" })
        }
        console.log(user)
        res.status(200).json({ success: true, message: "User deleted successfully" })
    }
    catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message })
    }
}


module.exports = { getUser, register, login, updateEmail, updateUsername, updateAvatar, updatePassword, deleteUser }
