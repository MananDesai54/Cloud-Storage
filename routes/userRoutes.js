const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const User = require("../models/userModel");
const Profile = require("../models/profileModel");
const Cloud = require("../models/cloudModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const generateToken = require("../config/generateToken");
const auth = require("../middleware/auth");
const verifyItsYou = require("../middleware/verifyItsYou");
const sendMail = require("../config/sendMail");
const showError = require("../config/showError");

//@route    POST api/users
//@desc     Register router
//@access   Public
router.post(
  "/",
  [
    check("method", "method is required").not().isEmpty(),
    check("username", "username is required.").not().isEmpty(),
    check("email", "Valid email is required.").isEmail(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        messages: errors.array(),
      });
    }

    const { username, email, password, id, profileUrl, method } = req.body;
    try {
      let user = await User.findOne({
        "email.value": email,
      });

      if (user) {
        return res.status(400).json({
          message: "User with this email already exist",
        });
      }

      user = new User({
        method,
        username: username,
        email: {
          value: email.toLowerCase(),
          verified: method.toLowerCase() !== "local",
        },
      });

      if (method === "local") {
        if (!password) {
          return res.status(400).json({
            message: "Please provide password.",
          });
        }
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_=+-/<>?`~:])[A-Za-z\d!@#$%^&*_=+-/<>?`~:]{8,32}$/g;
        if (!re.test(password)) {
          return res.status(400).json({
            message: "Please provide valid password.",
          });
        }

        user.local = {
          password: password,
          oldPasswords: [],
        };

        //encrypt Password
        const sault = await bcrypt.genSalt(10);
        user.local.password = await bcrypt.hash(user.local.password, sault);
        user.local.oldPasswords.push(user.local.password);
      } else {
        user[method.toLowerCase()] = {
          [`${method}Id`]: id,
        };
      }

      await user.save();
      await Profile.create({
        user: user.id,
        avatar: {
          url: profileUrl
            ? profileUrl
            : "https://cloud-storage-uploads.s3.amazonaws.com/profile.jpg",
          key: "profile.jpg",
        },
      });
      await Cloud.create({
        user: user.id,
      });

      //generate JWT token
      const token = generateToken(user);
      if (method === "local") {
        sendMail(token, user.email.value, "VERIFY EMAIl", true);
      }
      return res.status(200).json({
        method: user.method,
        username: user.username,
        id: user.id,
        email: user.email,
        token,
        tokenExpiration: new Date().getTime() + 24 * 60 * 60 * 1000,
        profileUrl: profileUrl
          ? profileUrl
          : "https://cloud-storage-uploads.s3.amazonaws.com/profile.jpg",
      });
    } catch (error) {
      showError(res, error);
    }
  }
);

//@route    GET api/users/google
//@desc     Auth with google
//@access   Public
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

//@route    GET /api/users/google/callback
//@desc     Google auth callback
//@access   Public
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
  }),
  (req, res) => {
    const token = generateToken(req.user);
    console.log(token);
    res.status(200).json({
      data: req.user,
      token,
    });
  }
);

//@route    PUT api/users
//@desc     Update user
//@access   Private
router.put("/", [auth, verifyItsYou], async (req, res) => {
  const { email, username, password, newPassword } = req.body;
  try {
    const user = await User.findById(req.user.id);

    if (email) {
      if (email.toLowerCase() !== user.email.value.toLowerCase()) {
        user.email = {
          value: email.toLowerCase(),
          verified: false,
        };
        sendMail(
          req.header("x-auth-token"),
          user.email.value.toLowerCase(),
          "VERIFY EMAIL",
          true
        );
      }
    }
    if (username) user.username = username;
    if (newPassword) {
      const sault = await bcrypt.genSalt(10);
      if (
        user.local.oldPasswords.find((pswd) => {
          return bcrypt.compareSync(newPassword, pswd);
        })
      ) {
        return res.status(400).json({
          message: "You cannot use the password that you have used before.",
        });
      }
      user.local.oldPasswords.push(bcrypt.hashSync(newPassword, sault));
      user.local.password = newPassword;
      user.local.password = await bcrypt.hash(user.local.password, sault);
    }

    await user.save();
    return res.status(200).json({
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    showError(res, error);
  }
});

//@route    POST api/users/request-reset-password
//@desc     Check that user with email exist and mail with reset link
//@access   Public
router.post(
  "/request-reset-password",
  [check("email", "Email is required").isEmail()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { email } = req.body;

    try {
      const user = await User.findOne({ "email.value": email });
      if (!user) {
        return res.status(404).json({
          error: "User not found",
        });
      }
      const token = generateToken(user);
      sendMail(token, user.email.value, "RESET PASSWORD");
      return res.status(200).json({
        message: "Email sent",
      });
    } catch (error) {
      showError(res, error);
    }
  }
);

//@route    POST api/users/request-reset-password/:token
//@desc     Auth with google token
//@access   Public
router.get("/request-reset-password/:token", async (req, res) => {
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
    return res.status(200).json({
      message: "Redirect to client at forget password link with token",
    });
  } catch (error) {
    showError(res, error);
  }
});

//@route    POST api/users/reset-password/:token
//@desc     reset password
//@access   Public
router.post(
  "/reset-password",
  [
    check("token", "Please provide token").not().isEmpty(),
    check("newPassword", "Please provide new password").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { token, newPassword } = req.body;
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

      const sault = await bcrypt.genSalt(10);
      if (
        user.local.oldPasswords.find((pswd) => {
          return bcrypt.compareSync(newPassword, pswd);
        })
      ) {
        return res.status(400).json({
          error: "You cannot use the password that you have used before.",
        });
      }
      user.local.oldPasswords.push(bcrypt.hashSync(newPassword, sault));
      user.local.password = newPassword;
      user.local.password = await bcrypt.hash(user.local.password, sault);
      await user.save();
      return res.status(200).json({
        message: "Password reset successfully",
      });
    } catch (error) {
      showError(res, error);
    }
  }
);

/**
 * Todo social Logins
 * do after done with Angular
 * redirect to client after verify email and verify reset request
 */

//@route    POST api/users/google
//@desc     Auth with google token
//@access   Public
//not working check why
// router.post('/google', passport.authenticate('google-plus-token'));

//@route    POST api/users/google
//@desc     Auth with google token
//@access   Public
// router.post('/google')

module.exports = router;
