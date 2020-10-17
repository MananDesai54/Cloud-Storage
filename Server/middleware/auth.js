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
    if (!decoded) {
      return res.status(400).json({
        error: "Invalid token",
      });
    }
    console.log(decoded.exp, new Date().getTime() / 1000);
    if (decoded.exp < new Date().getTime() / 1000) {
      return res.status(400).json({
        error: "Invalid token",
      });
    }
    req.user = decoded.user;
    req.jwt = { token, tokenExpiration: decoded.exp };
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
