const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

module.exports = async (req, res, next) => {
  const reqUser = req.user;
  try {
    const user = await User.findById(reqUser.id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const registerType = user.method;
    if (registerType === "local") {
      const { password } = req.body;
      if (!password) {
        return res.status(400).json({
          message: "Please provide password",
        });
      }
      const isMatch = await bcrypt.compare(password, user.local.password);
      if (!isMatch) {
        return res.status(400).json({
          message: "Invalid Password",
        });
      }
      next();
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: "Server error",
    });
  }
};