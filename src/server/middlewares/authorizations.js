const { getUserFromToken } = require("../services/helper");


module.exports = {

  emailToLowerCase: (req, res, next) => {
    if (req.body.email) {
      req.body.email = req.body.email.toLowerCase().trim();
    }
    next();
  },

  //  Authenticate (must be logged in)
  authenticateUser: async (req, res, next) => {
    try {
      const user = await getUserFromToken(req.headers.authorization);

      if (!user) {
        return res
          .status(401)
          .json({ message: "Authentication failed. Please log in again." });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("Authentication error:", error);
      res.status(401).json({
        message: "Invalid or expired token.",
        error: error.message,
      });
    }
  },

  //
  //  Ensure guest (not logged in)
  //
  ensureGuest: async (req, res, next) => {
    try {
      const user = await getUserFromToken(req.headers.authorization);

      if (user) {
        return res.status(403).json({
          message: "You are already logged in.",
        });
      }

      next();
    } catch (error) {
      console.warn("Invalid token, treating as guest:", error.message);
      next();
    }
  },
};
