const router = require("express").Router();
const Profile = require("../models/profileModel");
const User = require("../models/userModel");
const Cloud = require("../models/cloudModel");
const auth = require("../middleware/auth");
const { v4: generateId } = require("uuid");
const verifyItsYou = require("../middleware/verifyItsYou");
const showError = require("../config/showError");

//aws & s3 configure
const S3 = require("../config/aws");
const localUpload = require("../config/fileData");

//@route    GET api/profile
//@desc     get user profile
//@access   Private
router.get("/", auth, async (req, res) => {
  try {
    const user = req.user;
    const profile = await Profile.findOne({
      user: user.id,
    });
    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }
    return res.status(200).json({
      data: profile,
    });
  } catch (error) {
    showError(res, error);
  }
});

//@route    POST api/profile
//@desc     add user data for local method
//@access   Private
router.post("/", auth, async (req, res) => {
  const { firstname, lastname } = req.body;
  try {
    const user = req.user;
    const profile = await Profile.findOne({
      user: user.id,
    });
    if (!profile) {
      profile = await Profile.create({
        firstname,
        lastname,
      });
    } else {
      if (firstname) profile.firstname = firstname;
      if (lastname) profile.lastname = lastname;
    }

    await profile.save();

    return res.status(200).json({
      data: profile,
    });
  } catch (error) {
    showError(res, error);
  }
});

//@route    PUT api/profile/update
//@desc     Update user
//@access   Private
router.put("/update", [auth, verifyItsYou], async (req, res) => {
  const { firstname, lastname, password } = req.body;
  try {
    // const user = await User.findById(req.user.id);

    const profile = await Profile.findOne({
      user: req.user.id,
    });
    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    if (firstname) profile.firstname = firstname;
    if (lastname) profile.lastname = lastname;
    profile.updatedDate = Date.now();
    await profile.save();

    return res.status(200).json({
      data: profile,
    });
  } catch (error) {
    showError(res, error);
  }
});

//@route    POST api/profile/avatar/upload
//@desc     Update user
//@access   Private
router.post("/avatar/upload", auth, localUpload, async (req, res) => {
  if (!req.file) {
    return res.status(404).json({
      error: "Please attach file to upload",
    });
  }
  console.log(req.file);
  const image = req.file.originalname.split(".");
  const fileType = image[image.length - 1];

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${generateId()}.${fileType}`,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  };
  /*
        Todo - Progress bar with s3
    */
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    });
    if (!profile) {
      return res.status(404).json({
        error: "Profile not found please create one.",
      });
    }
    S3.upload(params, async (err, data) => {
      if (err)
        return res.status(400).json({
          error: err.message,
        });

      const awsUploadURL = data.Location;
      profile.avatar.url = awsUploadURL;
      profile.avatar.key = data.Key;
      profile.updatedDate = Date.now();

      await profile.save();

      return res.status(200).json({
        data: profile,
      });
    }).on("httpUploadProgress", (e) => {
      console.log(e.loaded);
    });
  } catch (error) {
    showError(res, error);
  }
});

//@route    DELETE api/profile
//@desc     Delete user
//@access   Private
router.delete("/", [auth, verifyItsYou], async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    });
    if (
      !(await Profile.findOne({
        user: req.user.id,
      }))
    ) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const profileUrl = profile.avatar.url;
    const key = profile.avatar.key;
    console.log(profileUrl);

    await User.findByIdAndDelete(req.user.id);
    await Profile.findOneAndDelete({
      user: req.user.id,
    });
    await Cloud.findOneAndDelete({
      user: req.user.id,
    });

    if (!profileUrl.includes("profile")) {
      console.log("Deleted from s3");
      S3.deleteObject(
        {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key,
        },
        (err, data) => {
          if (err) return console.log(err.message);
          console.log(data);
        }
      );
    }
    return res.status(200).json({
      message: "User Deleted",
    });
  } catch (error) {
    showError(res, error);
  }
});

module.exports = router;
