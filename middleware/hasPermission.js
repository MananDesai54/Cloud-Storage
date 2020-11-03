const Cloud = require("../models/cloudModel");
const User = require("../models//userModel");
const checkPermission = require("../config/checkPermission");

const hasAccessToFolder = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await checkPermission({
      id,
      type: "folder",
      req,
    });
    if (result.success) {
      req.folder = result.data;
      console.log("You have permission");
      return next();
    } else {
      return res.status(400).json({
        message: result.data,
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      message: error.message,
    });
  }
};

const hasAccessToFile = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await checkPermission({
      id,
      type: "file",
      req,
    });
    if (result.success) {
      req.fileData = result.data;
      return next();
    } else {
      return res.status(400).json({
        message: result.data,
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = {
  hasAccessToFolder,
  hasAccessToFile,
};
