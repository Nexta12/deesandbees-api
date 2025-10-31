const bcrypt = require("bcryptjs");

const User = require("../models/UserModel");
const Testimonials = require("../models/Testimonials")
const Contacts = require("../models/ContactModel")

module.exports = {
  CreateUser: async (req, res) => {
    try {
      const { firstName, lastName, email, role, password } = req.body;


      if (!firstName || !lastName || !email || !password || !role) {
        return res
          .status(400)
          .json({ message: "Please fill in all required fields." });
      }


      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format." });
      }

      // ✅ 3. Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: "Email already in use." });
      }

      // ✅ 4. Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // ✅ 5. Create user
      const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role
      });

      // ✅ 6. Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;

      // ✅ 7. Send success response
      res.status(201).json({
        message: "User created successfully.",
        user: userResponse,
      });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({
        message: "An error occurred while creating the user.",
        error: error.message,
      });
    }
  },
getStats: async (req, res) => {
  try {
  
    const [totalUsers, totalTestimonials, totalMessages] = await Promise.all([
      User.countDocuments({email: {$ne: process.env.OFFICIAL_EMAIL}}),
      Testimonials.countDocuments(),
      Contacts.countDocuments(),
    ]);

    const stats = { totalUsers, totalTestimonials, totalMessages };
    return res.status(200).json({
      message: "Statistics fetched successfully.",
      stats,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return res.status(500).json({
      message: "Internal server error while fetching stats.",
      error: error.message,
    });
  }
},


  EditUser: async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, email, password, role } = req.body;

    try {

      if (!id) {
        return res.status(400).json({ message: "User ID is required." });
      }

      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return res.status(400).json({ message: "Invalid email format." });
        }

        // ✅ 4. Check if email belongs to another user
        const emailExists = await User.findOne({ email, _id: { $ne: id } });
        if (emailExists) {
          return res.status(409).json({ message: "Email already in use by another user." });
        }
      }

      // ✅ 5. Prepare updated fields
      const updatedData = {};
      if (firstName) updatedData.firstName = firstName;
      if (lastName) updatedData.lastName = lastName;
      if (email) updatedData.email = email;
      if (role) updatedData.role = role;

      // ✅ 6. If password is provided, hash it
      if (password) {
        const salt = await bcrypt.genSalt(10);
        updatedData.password = await bcrypt.hash(password, salt);
      }


      const updatedUser = await User.findByIdAndUpdate(id, updatedData, {
        new: true,
        runValidators: true, 
      }).select("-password"); 

      res.status(200).json({
        message: "User updated successfully.",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({
        message: "An error occurred while updating the user.",
        error: error.message,
      });
    }
  },
DeleteUser: async (req, res) => {
  const { id } = req.params; 
  const requestingUser = req.user; 
 

  try {
    // ✅ 1. Ensure ID is provided
    if (!id) {
      return res.status(400).json({ message: "User ID is required." });
    }

    // ✅ 2. Check if user exists
    const userToDelete = await User.findById(id);
    if (!userToDelete) {
      return res.status(404).json({ message: "User not found." });
    }

    // ✅ 3. Ensure request is authorized (admin OR same user)
    if (
      !requestingUser ||
      (requestingUser.role !== "admin" && requestingUser._id.toString() !== id)
    ) {
      return res.status(403).json({
        message: "Unauthorized. You can only delete your own account or must be an admin.",
      });
    }

    // ✅ 4. Perform delete
     await User.findByIdAndDelete(id);

    return res.status(200).json({
      message: "User deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      message: "An error occurred while deleting the user.",
      error: error.message,
    });
  }
},


AllUsers: async (req, res) => {
  try {
    const allUsers = await User.find({email: {$ne: process.env.ADMIN_EMAIL}}).select('-password').sort({ createdAt: -1 }); 

    if (!allUsers || allUsers.length === 0) {
      return res.status(404).json({
        message: "No users found.",
        users: [],
      });
    }

    // Successful response
    res.status(200).json(allUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      message: "An error occurred while fetching users.",
      error: error.message,
    });
  }
}


};
