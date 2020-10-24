const showError = require("../config/showError");
const { validationResult } = require("express-validator");
const bCrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Profile = require("../models/profileModel");
const generateToken = require("../config/generateToken");

const authUser = async (req, res) => {
  try {
    let user = await User.findById(req.user.id);
    if (user.method === "local") {
      user = await User.findById(req.user.id).select("-local");
    } else if (user.method === "google") {
      user = await User.findById(req.user.id).select("-google.googleId");
    } else if (user.method === "facebook") {
      user = await User.findById(req.user.id).select("-facebook.facebookId");
    }
    if (!user) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }
    const profile = await Profile.findOne({ user: user.id });
    return res.status(200).json({
      method: user.method,
      username: user.username,
      id: user.id,
      email: user.email,
      profileUrl: profile.avatar.url,
      token: req.jwt.token,
      tokenExpiration: +req.jwt.tokenExpiration * 1000,
    });
  } catch (error) {
    showError(res, error);
  }
};

const loginUser = async (req, res) => {
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
          message: `Use signIn with ${user.method} to login`,
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
        return res.status(400).json({
          message: "Use email & password to login",
        });
      } else if (method !== user.method) {
        return res.status(400).json({
          message: `Use signIn with ${user.method} to login`,
        });
      }
      if (user[method][`${method}Id`] !== id) {
        return res.status(400).json({
          message: "Invalid credentials",
        });
      }
    }

    //jwt
    const token = generateToken(user);
    const profile = await Profile.findOne({ user: user.id });
    const profileUrl = profile.avatar.url;

    return res.status(200).json({
      method: user.method,
      username: user.username,
      id: user.id,
      email: user.email,
      token,
      tokenExpiration: new Date().getTime() + 24 * 60 * 60 * 1000,
      profileUrl,
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
