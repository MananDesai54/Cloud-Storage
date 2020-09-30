const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

module.exports = async (req, res, next) => {
  const reqUser = req.user;
  try {
    const user = await User.findById(reqUser.id);
    if (!user) {
      return res.status(404).json({
        error: "User not found.M",
      });
    }
    const registerType = user.method;
    if (registerType === "local") {
      const { password } = req.body;
      if (!password) {
        return res.status(400).json({
          error: "Please provide password.M",
        });
      }
      const isMatch = await bcrypt.compare(password, user.local.password);
      if (!isMatch) {
        return res.status(400).json({
          error: "Invalid Password.M",
        });
      }
      next();
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: "Server error.M",
    });
  }
};
