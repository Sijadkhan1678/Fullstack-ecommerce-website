const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  role: {
    type: String,
    requred:true,
    enum: ["user", "admin"]
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  username: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
  },
  avatar: {
    type: String,

  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },

}, { timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = User;
