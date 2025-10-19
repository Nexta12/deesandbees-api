const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: true,
      lowercase: true,
    },
    password: String,
    role: {
      type: String,
      enum: ['admin', 'user', 'editor'],
      default: 'user', 
    },
    resetPasswordOTP: { type: String },
    resetPasswordExpires: { type: Date },
 

  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
