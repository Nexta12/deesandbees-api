const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    fullName: { type: String, trim: true },
    message: { type: String, trim: true },
    email: { type: String, trim: true },
    address: { type: String, trim: true },
    phone: { type: String, trim: true },
    isSeen: {type: Boolean, default: false}
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);
