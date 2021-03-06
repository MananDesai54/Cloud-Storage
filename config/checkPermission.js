const Cloud = require("../models/cloudModel");
const User = require("../models//userModel");

module.exports = async ({ type, id, req }) => {
  const currentUser = req.user;
  const currentUserDetails = await User.findById(currentUser.id);
  const cloud = await Cloud.find({});
  let object, objectOwner;
  cloud.forEach((user) => {
    let isObject;
    if (type.toLowerCase() === "folder") {
      isObject = user.folders.find((folder) => folder.id.toString() === id);
    } else {
      isObject = user.files.find((folder) => folder.id.toString() === id);
    }
    if (isObject) {
      object = isObject;
      objectOwner = user;
      return;
    }
  });
  if (object) {
    console.log(object.sharedWith);
    if (objectOwner.user.toString() === currentUser.id) {
      return {
        success: true,
        data: object,
      };
    } else if (object.sharable) {
      if (
        object.sharedWith.length === 0 ||
        object.sharedWith.includes(currentUserDetails.email.value)
      ) {
        return {
          success: true,
          data: object,
        };
      } else {
        return {
          success: false,
          data: `You have not permission to access this ${type}`,
        };
      }
    } else {
      return {
        success: false,
        data: `You have not permission to access this ${type}`,
      };
    }
  } else {
    return {
      success: false,
      data: `${type.charAt(0).toUpperCase()}${type.slice(1)} not found`,
    };
  }
};
