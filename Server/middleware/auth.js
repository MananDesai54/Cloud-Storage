const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

module.exports = async function (req, res, next) {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({
      error: "Not authorized",
    });
  }

  try {
    const decoded = jwt.decode(token, process.env.JWT_SECRET_KEY);
    req.user = decoded.user;
    const user = await User.findById(decoded.user.id);
    if (!user) {
      return res.status(404).json({
        error: "User not found or Invalid token.",
      });
    }
    return next();
  } catch (error) {
    console.log(error.message);
    return res.status(404).json({
      error: "Not valid token.",
    });
  }
};
