const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const { sendOTPemail } = require("../services/emailCalls");

module.exports = {
  Login: async (req, res) => {
    try {
      const { email, password } = req.body;


      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format." });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials." });
      }
      // //  Generate JWT token
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" } 
      );

      const userResponse = user.toObject();
      delete userResponse.password;

      res.status(200).json({
        message: "Login successful.",
        token,
        user: userResponse,
      });

    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({
        message: "An error occurred while logging in.",
        error: error.message,
      });
    }
  },
  Logout: async (req, res) => {
    try {
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      res.status(200).json({
        message: "Logout successful.",
      });
    } catch (error) {
      console.error("Error during logout:", error);
      res.status(500).json({
        message: "An error occurred during logout.",
        error: error.message,
      });
    }
  },
  ValidateAuth: async (req, res) => {
    try {
      // ✅ 1. Get token from Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Access denied. No token provided." });
      }

      const token = authHeader.split(" ")[1];

      //  Verify token
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token." });
      }

      // Find user by ID from decoded token
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
      res.status(200).json({
        message: "User authenticated successfully.",
        user,
      });
    } catch (error) {
      console.error("Error validating auth:", error);
      res.status(500).json({
        message: "An error occurred while validating authentication.",
        error: error.message,
      });
    }
  },

ForgotPassword: async (req, res) => {
    try {
      const { email } = req.body;

      // ✅ 1. Validate email
      if (!email) {
        return res.status(400).json({ message: "Email is required." });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format." });
      }

      // ✅ 2. Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "No account found with this email." });
      }

      // ✅ 3. Generate a 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // ✅ 4. Hash OTP before saving (for security)
      const salt = await bcrypt.genSalt(10);
      const hashedOTP = await bcrypt.hash(otp, salt);

      // ✅ 5. Save OTP & expiry (e.g. 10 minutes)
      user.resetPasswordOTP = hashedOTP;
      user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 mins
      await user.save();

      // ✅ 6. Send OTP via your existing mail function
      await sendOTPemail({
        email: user.email,
        otp,
      });

      // ✅ 7. Respond to client
      res.status(200).json({
        message: "OTP sent to your email. It will expire in 10 minutes.",
      });
      
    } catch (error) {
      console.error("Error in ForgotPassword:", error);
      res.status(500).json({
        message: "An error occurred while processing your request.",
        error: error.message,
      });
    }
  },

 VerifyOtp: async (req, res) => {
  const { email, otp } = req.body;

  try {
    // ✅ 1. Validate inputs
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required." });
    }

    // ✅ 2. Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // ✅ 3. Ensure OTP exists
    if (!user.resetPasswordOTP) {
      return res
        .status(400)
        .json({ message: "No OTP found. Please request a new one." });
    }

    // ✅ 4. Check expiration
    if (user.resetPasswordExpires && user.resetPasswordExpires < Date.now()) {
      return res
        .status(400)
        .json({ message: "OTP has expired. Please request a new one." });
    }

    // ✅ 5. Compare hashed OTP
    const isMatch = await bcrypt.compare(otp, user.resetPasswordOTP);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    // ✅ 6. Clear OTP after successful verification
    user.resetPasswordOTP = null;
    user.resetPasswordExpires = null;
    await user.save();

    // ✅ 7. Respond success
    res.status(200).json({
      message: "OTP verified successfully.",
      userId: user._id,
      email: user.email,
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({
      message: "An error occurred while verifying OTP.",
      error: error.message,
    });
  }
},

  ResendOTP: async (req, res) => {
    const { email } = req.body;

    try {
      //  Validate email
      if (!email) {
        return res.status(400).json({ message: "Email is required." });
      }

      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      // Generate new OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
      const otpExpiry = Date.now() + 10 * 60 * 1000; // valid for 10 minutes

      // Save OTP details for reset password
      user.resetPasswordOTP = otp;
      user.resetPasswordExpires = otpExpiry;
      await user.save();

      // Send OTP email
      await sendOTPemail({
        email: user.email,
        otp,
      });

      //  Respond success
      res.status(200).json({
        message: "A new OTP has been sent to your email address.",
      });
    } catch (error) {
      console.error("Error resending OTP:", error);
      res.status(500).json({
        message: "An error occurred while resending OTP.",
        error: error.message,
      });
    }
  },

 ResetPassword: async (req, res) => {
    const { password, confirmPassword, email } = req.body;

    try {
      // ✅ 1. Validate inputs
      if (!email || !password || !confirmPassword) {
        return res.status(400).json({
          message: "Email, password and confirm password are required.",
        });
      }

      //  Ensure passwords match
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match." });
      }

      //  Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      //  Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      //  Update password
      user.password = hashedPassword;
      await user.save();

      //  Respond success
      res.status(200).json({
        message: "Password reset successful. You can now log in with your new password.",
      });
    } catch (error) {
      console.error("Error resetting password:", error);
      res.status(500).json({
        message: "An error occurred while resetting password.",
        error: error.message,
      });
    }
  },
};
