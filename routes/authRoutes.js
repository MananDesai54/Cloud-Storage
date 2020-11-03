const router = require("express").Router();
const auth = require("../middleware/auth");
const User = require("../models/userModel");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bCrypt = require("bcryptjs");
const passport = require("passport");
const showError = require("../config/showError");
const sendMail = require("../config/sendMail");

const { authUser, loginUser } = require("../controllers/authController");

//@route    GET api/auth
//@desc     Auth router
//@access   Private
router.get("/", auth, authUser);

//@route    POST api/auth
//@desc     Login user
//@access   Public
router.post(
  "/",
  [
    check("email", "Please Enter valid Email.").isEmail(),
    check("method", "Please provide method.").not().isEmpty(),
  ],
  loginUser
);

//@route    GET api/auth/verification/:token
//@desc     Verify user
//@access   Public
router.get("/verification/:token", async (req, res) => {
  const { token } = req.params;
  try {
    const decoded = jwt.decode(token, process.env.JWT_SECRET_KEY);
    if (!decoded) {
      return res
        .status(400)
        .redirect(
          `https://cloud-storage-client-b121d.web.app/cloud/setting?email=false&message=Invalid&user=${user.id}`
        );
    }
    const user = await User.findById(decoded.user.id);
    if (!user) {
      return res
        .status(404)
        .redirect(
          `https://cloud-storage-client-b121d.web.app/cloud/setting?email=false&message=Not found&user=${user.id}`
        );
    }
    if (user.email.verified) {
      return res.redirect(
        `https://cloud-storage-client-b121d.web.app/cloud/setting?email=true&message=Already&user=${user.id}`
      );
    }
    user.email = {
      ...user.email,
      verified: true,
    };
    // user.markModified("email");
    user.save();
    return res.redirect(
      `https://cloud-storage-client-b121d.web.app/cloud/setting?email=true&message=Email verified successfully&user=${user.id}`
    );
  } catch (error) {
    console.log(error.message);
    return res
      .status(400)
      .redirect(
        `https://cloud-storage-client-b121d.web.app/cloud/setting?email=false&message=Invalid`
      );
  }
});

//@route    GET api/auth/send-verification-mail
//@desc     Verify user
//@access   Public
router.post("/send-verification-mail", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      message: "Please provide email",
    });
  }
  const mailStatus = await sendMail(
    req.header("x-auth-token"),
    email.toLowerCase(),
    "VERIFY EMAIL",
    true
  );
  console.log(mailStatus);
  if (mailStatus.rejected.length > 0) {
    return res.status(400).json({
      message: "Something went wrong",
    });
  }
  return res.status(200).json({
    message: "Email sent",
  });
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
//@desc     check email exists
//@access   Public
router.get("/:email", async (req, res) => {
  const email = req.params.email.toLowerCase();
  try {
    const user = await User.findOne({
      "email.value": email,
    });

    if (user) {
      return res.status(200).json({
        message: "User with that Email already exist",
        found: true,
      });
    }
    return res.status(404).json({
      message: "No user found with this email id",
      found: false,
    });
  } catch (error) {
    showError(res, error);
  }
});

module.exports = router;
