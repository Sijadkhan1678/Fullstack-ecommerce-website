const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  role: {
    types: String,
    requred:true,
    enum: ["user", "admin"]
  },
  full_name: {
    type: String,
    required: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  avatar: {
    type: String,
    unique: true,
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
