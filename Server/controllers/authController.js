const showError = require("../config/showError");
const { validationResult } = require("express-validator");
const bCrypt = require("bcryptjs");
const User = require("../models/userModel");

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
      error: errors.array(),
    });
  }

  const { email, password } = req.body;
  try {
    const user = await User.findOne({
      "email.value": email,
    });
    if (!user) {
      return res.status(404).json({
        error: "Invalid credential.E",
      });
    }

    const isMatch = await bCrypt.compare(password, user.local.password);
    if (!isMatch) {
      return res.status(404).json({
        error: "Invalid credential.P",
      });
    }

    //jwt
    const payload = {
      user: {
        id: user.id,
      },
    };
    jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "24hr",
      },
      (err, token) => {
        if (err)
          return res.status(500).json({
            error: "Server Error",
          });

        return res.status(200).json({
          token,
          userId: user.id,
        });
      }
    );
  } catch (error) {
    showError(res, error);
  }
};

module.exports = {
  authUser,
  loginUser,
};
