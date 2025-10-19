const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    fullName: { type: String, trim: true },
 
    message: {type: String, trim: true }

  },
  { timestamps: true }
);

module.exports = mongoose.model('Testimonial', testimonialSchema);
