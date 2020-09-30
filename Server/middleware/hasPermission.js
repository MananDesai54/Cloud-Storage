const Cloud = require("../models/cloudModel");
const User = require("../models//userModel");

const hasAccessToFolder = async (req, res, next) => {
  const { id } = req.params;
  try {
    const currentUser = req.user;
    const currentUserDetails = await User.findById(currentUser.id);
    const cloud = await Cloud.find({});
    let folder, folderOwner;
    cloud.forEach((user, index) => {
      const isFolder = user.folders.find(
        (folder) => folder.id.toString() === id
      );
      if (isFolder) {
        folder = isFolder;
        folderOwner = user;
        return;
      }
    });
    if (folder) {
      console.log(folder.sharedWith);
      if (folderOwner.user.toString() === currentUser.id) {
        req.folder = folder;
        return next();
      } else if (folder.sharable) {
        if (
          folder.sharedWith.length === 0 ||
          folder.sharedWith.includes(currentUserDetails.email.value)
        ) {
          req.folder = folder;
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
        message: "Folder not found",
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
};
