const showError = require("../config/showError");
const { validationResult } = require("express-validator");
const bCrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

const authUser = async (req, res) => {
  console.log("Hello");
  try {
    let user = await User.findById(req.user.id);
    if (user.method === "local") {
      user = await User.findById(req.user.id).select("-local");
    } else if (user.method === "google") {
      user = await User.findById(req.user.id).select("-google.googleId");
    }
    if (!user) {
      return res.status(401).json({
        error: "Not authorized",
      });
    }
    return res.status(200).json({
      data: user,
    });
  } catch (error) {
    showError(res, error);
  }
};

const loginUser = async (req, res) => {
  console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      messages: errors.array(),
    });
  }

  const { email, password, method, id } = req.body;
  try {
    const user = await User.findOne({
      "email.value": email,
    });
    if (!user) {
      return res.status(404).json({
        message: "No account found with this email-id",
      });
    }

    if (method === "local") {
      if (!password) {
        return res.status(400).json({
          message: "Please provide password.",
        });
      }
      if (user.method === "google" || user.method === "facebook") {
        return res.status(400).json({
          message: "Method is social login",
        });
      }

      const isMatch = await bCrypt.compare(password, user.local.password);
      if (!isMatch) {
        return res.status(404).json({
          message: "Invalid credential",
        });
      }
    } else if (method === "google" || method === "facebook") {
      if (!id) {
        return res.status(400).json({
          message: "Please provide social userId.",
        });
      }
      if (user.method === "local") {
        res.status(400).json({
          message: "Method is local",
        });
      }
      if (user[method][`${method}Id`] !== id) {
        res.status(400).json({
          message: "Invalid credentials",
        });
      }
    }

    //jwt
    const token = generateToken(user);

    return res.status(200).json({
      token,
    });
  } catch (error) {
    console.log(error);
    showError(res, error);
  }
};

module.exports = {
  authUser,
  loginUser,
};
