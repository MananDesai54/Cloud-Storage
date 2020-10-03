const router = require("express").Router();
const auth = require("../middleware/auth");
const User = require("../models/userModel");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bCrypt = require("bcryptjs");
const passport = require("passport");
const showError = require("../config/showError");

//@route    GET api/auth
//@desc     Auth router
//@access   Private
router.get("/", auth, async (req, res) => {
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
});

//@route    POST api/auth
//@desc     Login user
//@access   Public
router.post(
  "/",
  [
    check("email", "Invalid Email.").isEmail(),
    check("password", "Please provide password.").exists(),
  ],
  async (req, res) => {
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
  }
);

//@route    GET api/auth/verification/:token
//@desc     Verify user
//@access   Public
router.get("/verification/:token", async (req, res) => {
  const { token } = req.params;
  try {
    const decoded = jwt.decode(token, process.env.JWT_SECRET_KEY);
    if (!decoded) {
      return res.status(400).json({
        error: "Invalid token",
      });
    }
    const user = await User.findById(decoded.user.id);
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }
    if (user.email.verified) {
      return res.status(403).json({
        error: "User already verified.",
      });
    }
    user.email = {
      value: user.email.value,
      verified: true,
    };
    // user.markModified("email");
    user.save();
    return res.status(200).json({
      data: user,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      error: error.message,
    });
  }
});

//@route    GET api/auth/google
//@desc     Login with google
//@access   Public
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

//@route    POST api/auth/:email
//@desc     check username exists
//@access   Public
router.get("/:email", async (req, res) => {
  const email = req.params.email.toLowerCase();
  try {
    const user = await User.findOne({
      "email.value": email,
    });
    if (user) {
      return res.status(400).json({
        error: "User with that Email already exist",
        found: true,
      });
    }
    return res.status(200).json({
      found: false,
    });
  } catch (error) {
    showError(res, error);
  }
});

module.exports = router;
