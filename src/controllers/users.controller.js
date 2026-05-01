const User = require('../models/User')
const bcrypt = require('bcryptjs')

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
        if (currentPassword === newPassword) {
            return res.status(401).json({
                success: false,
                message: "current and new passwords should not be match"
            })

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


module.exports = { getUser, updateEmail, updateUsername, updateAvatar, updatePassword, deleteUser }
