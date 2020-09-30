const Cloud = require("../models/cloudModel");

const hasAccessToFolder = async (req, res, next) => {
  const { id } = req.params;
  try {
    const currentUser = req.user;
    const cloud = await Cloud.find({});
    let folder;
    cloud.forEach((user) => {
      // console.log(user);
      folder = user.folders.find((folder) => {
        return folder.id.toString() === id;
      });
      if (folder) {
        if (folder.sharable || user.user.toString() === currentUser.id) {
          console.log(folder);
          return next();
        } else {
          console.log("No permission");
          return res.status(401).json({
            error: "You have not permission to access this file",
          });
        }
      }
    });
    if (!folder) {
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
