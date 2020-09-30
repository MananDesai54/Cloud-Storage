const Cloud = require("../models/cloudModel");
const User = require("../models//userModel");
const checkPermission = require("../config/checkPermission");

const hasAccessToFolder = async (req, res, next) => {
  const { id } = req.params;
  try {
    const currentUser = req.user;
    const currentUserDetails = await User.findById(currentUser.id);
    const cloud = await Cloud.find({});
    const result = checkPermission({
      cloud,
      currentUser,
      currentUserDetails,
      id,
      type: "folder",
    });
    if (result.success) {
      req.folder = result.data;
      return next();
    } else {
      return res.status(400).json({
        error: result.data,
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      error: error.message,
    });
  }
};

const hasAccessToFile = async (req, res, next) => {
  const { fileId } = req.params;
  try {
    const currentUser = req.user;
    const currentUserDetails = await User.findById(currentUser.id);
    const cloud = await Cloud.find({});
    let file, fileOwner;
    cloud.forEach((user, index) => {
      const isFile = user.files.find((file) => file.id.toString() === id);
      if (isFile) {
        file = isFile;
        fileOwner = user;
        return;
      }
    });
    if (file) {
      console.log(file.sharedWith);
      if (fileOwner.user.toString() === currentUser.id) {
        req.fileData = file;
        return next();
      } else if (file.sharable) {
        if (
          file.sharedWith.length === 0 ||
          file.sharedWith.includes(currentUserDetails.email.value)
        ) {
          req.fileData = file;
          return next();
        } else {
          console.log("No permission");
          return res.status(401).json({
            error: "You have not permission to access this file",
          });
        }
      } else {
        console.log("No permission");
        return res.status(401).json({
          error: "You have not permission to access this file",
        });
      }
    } else {
      return res.status(404).json({
        message: "File not found",
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      error: error.message,
    });
  }
};

module.exports = {
  hasAccessToFolder,
  hasAccessToFile,
};
