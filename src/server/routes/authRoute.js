const { Login, Logout, ValidateAuth, ForgotPassword, VerifyOtp, ResendOTP, ResetPassword } = require("../controller/authController");
const { emailToLowerCase, ensureGuest } = require("../middlewares/authorizations");

const router = require("express").Router();

router.post("/login", ensureGuest, emailToLowerCase, Login)
router.post("/logout", Logout)
router.get("/validate", ValidateAuth)
router.post("/forgotPassword",ensureGuest, emailToLowerCase, ForgotPassword)
router.post("/verifyOtp", VerifyOtp)
router.post("/resendOtp",ensureGuest, emailToLowerCase, ResendOTP)
router.post("/resetPassword",ensureGuest, emailToLowerCase, ResetPassword)


module.exports = router
