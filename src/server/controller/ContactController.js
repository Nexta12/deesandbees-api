const Contact = require("../models/ContactModel");
const { sendNotificationEmail } = require("../services/emailCalls");

module.exports = {
  //
  // CREATE a new contact message
  //
  CreateContact: async (req, res) => {
    const { fullName, email, message, address, phone } = req.body;

    try {
      //  Validation
      if (!fullName || !email || !message) {
        return res.status(400).json({
          message: "Full name, email, and message are required.",
        });
      }

      // Optional: Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format." });
      }

      //  Create a new contact document
      const newContact = await Contact.create({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        message: message.trim(),
        address: address?.trim() || "",
        phone: phone?.trim() || "",
      });

      await sendNotificationEmail({
        to: process.env.OFFICIAL_EMAIL,
        name: "Admin",
        subject: "New Message from Contact Form",
        message:
          "A new student has submitted an application. Please review it on the admin dashboard.",
      });

      res.status(201).json({
        message: "Your message has been submitted successfully.",
        data: newContact,
      });
    } catch (error) {
      console.error("Error creating contact:", error);
      res.status(500).json({
        message: "An error occurred while submitting your message.",
        error: error.message,
      });
    }
  },

  //
  //  GET all contact messages
  //
  AllContact: async (req, res) => {
    try {
      const contacts = await Contact.find().sort({ createdAt: -1 });

      res.status(200).json({
        message: "Contacts retrieved successfully.",
        count: contacts.length,
        data: contacts,
      });
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({
        message: "An error occurred while fetching contacts.",
        error: error.message,
      });
    }
  },

  //
  //  GET single contact by ID
  //
  GetOneContact: async (req, res) => {
    const { id } = req.params;

    try {
      if (!id) {
        return res.status(400).json({ message: "Contact ID is required." });
      }

      const contact = await Contact.findById(id);
      if (!contact) {
        return res.status(404).json({ message: "Contact not found." });
      }

      contact.isSeen = true;

      await contact.save();

      res.status(200).json({
        message: "Contact retrieved successfully.",
        data: contact,
      });
    } catch (error) {
      console.error("Error fetching contact:", error);
      res.status(500).json({
        message: "An error occurred while fetching the contact.",
        error: error.message,
      });
    }
  },

  //
  //  UPDATE a contact
  //
  EditContact: async (req, res) => {
    const { id } = req.params;
    const { fullName, email, message, address, phone } = req.body;

    try {
      if (!id) {
        return res.status(400).json({ message: "Contact ID is required." });
      }

      const contact = await Contact.findById(id);
      if (!contact) {
        return res.status(404).json({ message: "Contact not found." });
      }

      //  Update fields dynamically
      if (fullName) contact.fullName = fullName.trim();
      if (email) contact.email = email.trim().toLowerCase();
      if (message) contact.message = message.trim();
      if (address) contact.address = address.trim();
      if (phone) contact.phone = phone.trim();

      const updatedContact = await contact.save();

      res.status(200).json({
        message: "Contact updated successfully.",
        data: updatedContact,
      });
    } catch (error) {
      console.error("Error updating contact:", error);
      res.status(500).json({
        message: "An error occurred while updating the contact.",
        error: error.message,
      });
    }
  },

  //
  //  DELETE a contact
  //
  DeleteContact: async (req, res) => {
    const { id } = req.params;

    try {
      if (!id) {
        return res.status(400).json({ message: "Contact ID is required." });
      }

      const contact = await Contact.findById(id);
      if (!contact) {
        return res.status(404).json({ message: "Contact not found." });
      }

      await Contact.findByIdAndDelete(id);

      res.status(200).json({
        message: "Contact deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting contact:", error);
      res.status(500).json({
        message: "An error occurred while deleting the contact.",
        error: error.message,
      });
    }
  },
};
