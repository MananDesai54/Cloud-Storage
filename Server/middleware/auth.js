const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

module.exports = async function (req, res, next) {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({
      message: "Not authorized",
    });
  }

  try {
    const decoded = jwt.decode(token, process.env.JWT_SECRET_KEY);
    if (!decoded) {
      return res.status(400).json({
        message: "Invalid token",
      });
    }
    if (decoded.exp < new Date().getTime() / 1000) {
      return res.status(400).json({
        message: "Invalid token",
      });
    }
    req.user = decoded.user;
    req.jwt = { token, tokenExpiration: decoded.exp };
    const user = await User.findById(decoded.user.id);
    if (!user) {
      return res.status(404).json({
        message: "User not found or Invalid token.",
      });
    }
    return next();
  } catch (error) {
    console.log(error.message);
    return res.status(404).json({
      message: "Not valid token.",
    });
  }
};
