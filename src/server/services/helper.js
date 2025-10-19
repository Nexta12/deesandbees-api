const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

exports.DateFormatter = (value) => {
  const date = new Date(value);

  if (!isNaN(date.getTime())) {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  }

  return String(value);
};

exports.getUserFromToken = async (authHeader) => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded?.id) return null;

  const user = await User.findById(decoded.id).select("-password");
  return user;
};
