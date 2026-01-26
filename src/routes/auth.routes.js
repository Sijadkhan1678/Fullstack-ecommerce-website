const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getUser, register, login, updateAvatar,deleteUser } = require('../controllers/auth.controller');
const config = require('../config')
const jwt = require('jsonwebtoken')
const JWT_SECRET = config.get('JWT_SECRET')
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/profile')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix + "." + file.mimetype.split('/')[1])
    }
  })
  const upload = storage

router.route('/register').post([
    body('role', 'please provide role').notEmpty().trim(),
    body('fullName', 'please provide fullName', "fullname at least 4 charactors").isLength({ min: 4 }).trim(),
    body('username').trim(),
    body('email', 'please provide a valid email').isEmail().trim(),
    body('password', 'Please enter password at least 8 charactors').isLength({ min: 8 }).trim(),
], register)

router.route('/login').post([
    body('email', 'please provide a valid email').isEmail().trim(),
    body('password', 'Please enter password at least 8 charactors').isLength({ min: 8 }).trim()
], login)

router.route('/user').get(verifyAuthToken, getUser)

router.delete("/user:id",verifyAuthToken,deleteUser)
// router.route('/avatar').put(upload.single("avatar"),updateAvatar)
// router.route('/user/updatePassword').put([verifyAuthToken,updatePassword)
// router.route('/user/addusername').put([body("username","Username at least 4 chararctors long").isLength({min:4}).trim(),verifyAuthToken],updateUsername)
// router.route('/user/email').put(verifyAuthToken,updateEmail)
// router.route('/user/delete').delete(verifyAuthToken,deleteUser)
// console.dir(router.stack[1].route)
module.exports = router

// middlewares
function verifyAuthToken(req, res, next) {
    try {

        const token = req.headers['token']
        if (!token) {
            return res.status(401).json({ message: "token missing" })
        }
        const decoded = jwt.verify(token, JWT_SECRET)
        req.user = decoded.user
        next()
    } catch (err) {

        return res.status(401).json({ Error: err })
    }

}


  
