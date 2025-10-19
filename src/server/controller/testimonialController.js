const Testimonial = require("../models/Testimonials");

module.exports = {
  //
  // ✅ CREATE a new testimonial
  //
  CreateTestimonial: async (req, res) => {
    const { fullName, message } = req.body;

    try {
      // ✅ Validation
      if (!fullName || !message) {
        return res
          .status(400)
          .json({ message: "Full name and message are required." });
      }

      // ✅ Create testimonial
      const newTestimonial = await Testimonial.create({
        fullName: fullName.trim(),
        message: message.trim(),
      });

      res.status(201).json({
        message: "Testimonial created successfully.",
        data: newTestimonial,
      });
    } catch (error) {
      console.error("Error creating testimonial:", error);
      res.status(500).json({
        message: "An error occurred while creating testimonial.",
        error: error.message,
      });
    }
  },

  //
  // ✅ GET all testimonials
  //
  AllTestimonial: async (req, res) => {
    try {
      const testimonials = await Testimonial.find().sort({ createdAt: -1 });

      res.status(200).json({
        message: "Testimonials retrieved successfully.",
        count: testimonials.length,
        data: testimonials,
      });
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      res.status(500).json({
        message: "An error occurred while fetching testimonials.",
        error: error.message,
      });
    }
  },

  //
  // ✅ GET single testimonial by ID
  //
  GetOneTestimonial: async (req, res) => {
    const { id } = req.params;

    try {
      if (!id) {
        return res.status(400).json({ message: "Testimonial ID is required." });
      }

      const testimonial = await Testimonial.findById(id);
      if (!testimonial) {
        return res.status(404).json({ message: "Testimonial not found." });
      }

      res.status(200).json({
        message: "Testimonial retrieved successfully.",
        data: testimonial,
      });
    } catch (error) {
      console.error("Error fetching testimonial:", error);
      res.status(500).json({
        message: "An error occurred while fetching testimonial.",
        error: error.message,
      });
    }
  },

  //
  // ✅ UPDATE a testimonial
  //
  EditTestimonial: async (req, res) => {
    const { id } = req.params;
    const { fullName, message } = req.body;

    try {
      if (!id) {
        return res.status(400).json({ message: "Testimonial ID is required." });
      }

      const testimonial = await Testimonial.findById(id);
      if (!testimonial) {
        return res.status(404).json({ message: "Testimonial not found." });
      }

      // ✅ Update fields
      if (fullName) testimonial.fullName = fullName.trim();
      if (message) testimonial.message = message.trim();

      const updatedTestimonial = await testimonial.save();

      res.status(200).json({
        message: "Testimonial updated successfully.",
        data: updatedTestimonial,
      });
    } catch (error) {
      console.error("Error updating testimonial:", error);
      res.status(500).json({
        message: "An error occurred while updating testimonial.",
        error: error.message,
      });
    }
  },

  //
  // ✅ DELETE a testimonial
  //
  DeleteTestimonial: async (req, res) => {
    const { id } = req.params;

    try {
      if (!id) {
        return res.status(400).json({ message: "Testimonial ID is required." });
      }

      const testimonial = await Testimonial.findById(id);
      if (!testimonial) {
        return res.status(404).json({ message: "Testimonial not found." });
      }

      await Testimonial.findByIdAndDelete(id);

      res.status(200).json({
        message: "Testimonial deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      res.status(500).json({
        message: "An error occurred while deleting testimonial.",
        error: error.message,
      });
    }
  },
};
