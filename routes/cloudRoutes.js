const router = require("express").Router();
const Cloud = require("../models/cloudModel");
const showError = require("../config/showError");
const { deleteSubFolders } = require("../config/deleteFolder");
const { v4: generateId } = require("uuid");
const { check, validationResult } = require("express-validator");

const { generate: generateShortId } = require("shortid");
const { isUri } = require("valid-url");

const auth = require("../middleware/auth");
const cloudMiddleware = require("../middleware/cloud");
const {
  hasAccessToFolder,
  hasAccessToFile,
} = require("../middleware/hasPermission");

const fileDetails = require("../config/fileData");
const S3 = require("../config/aws");

/**
 * Folder things
 */

//@route    GET api/cloud
//@desc     get files & folder at root level
//@access   Private
router.get("/", auth, cloudMiddleware, (req, res) => {
  try {
    const cloud = req.cloud;
    const data = {
      storage: cloud.storage,
      files: cloud.files,
      folders: cloud.folders,
      userId: cloud.user,
    };
    return res.status(200).json({
      ...data,
    });
  } catch (error) {
    showError(res, error);
  }
});

//@route    POST api/cloud/folder
//@desc     create folder
//@access   Private
router.post(
  "/folder",
  [
    auth,
    check("name", "Name is required").not().isEmpty(),
    check("location", "Location of file is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        messages: errors.array(),
      });
    }
    const { name, location } = req.body;
    try {
      const user = req.user;
      let cloud = await Cloud.findOne({
        user: user.id,
      });
      if (!cloud) {
        cloud = new Cloud({
          user: user.id,
        });
      }
      let folderIndex;
      if (location !== "root") {
        folderIndex = cloud.folders.findIndex(
          (folder) => folder.id === location
        );
        if (!cloud.folders[folderIndex]) {
          return res.status(404).json({
            error: "Folder not found.",
          });
        }
      }
      await cloud.folders.push({
        name,
        location,
      });
      if (location !== "root") {
        cloud.folders[folderIndex].folders.push(
          // cloud.folders[cloud.folders.length - 1].id
          cloud.folders[cloud.folders.length - 1]
        );
      }
      await cloud.save();
      const currentFolder = cloud.folders[folderIndex];
      return res.status(200).json({
        cloud: {
          storage: cloud.storage,
          files: cloud.files,
          folders: cloud.folders,
          userId: cloud.user,
        },
        newFolder: cloud.folders[cloud.folders.length - 1],
        currentFolder: currentFolder
          ? {
              name: currentFolder.name,
              files: currentFolder.files,
              folders: currentFolder.folders,
              location: currentFolder.location,
              sharable: currentFolder.sharable,
              sharedWith: currentFolder.sharedWith,
              sharableLink: currentFolder.sharableLink,
              id: currentFolder.id,
            }
          : cloud.folders,
      });
    } catch (error) {
      showError(res, error);
    }
  }
);

//@route    GET api/cloud/folders/:id
//@desc     get any folder data
//@access   Private
router.get(
  "/folders/:id",
  auth,
  cloudMiddleware,
  hasAccessToFolder,
  (req, res) => {
    try {
      if (req.folder) {
        const folder = req.folder;
        return res.status(200).json({
          name: folder.name,
          files: folder.files,
          folders: folder.folders,
          location: folder.location,
          sharable: folder.sharable,
          sharedWith: folder.sharedWith,
          sharableLink: folder.sharableLink,
          id: folder.id,
        });
      } else {
        return res.status(404).json({
          error: "Folder not found",
        });
      }
    } catch (error) {
      showError(res, error);
    }
  }
);

//@route    PUT api/cloud/folders
//@desc     Update folder(rename)
//@access   Private
router.put(
  "/folders",
  [
    auth,
    cloudMiddleware,
    check("name", "Name is required").not().isEmpty(),
    check("id", "Id is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        messages: errors.array(),
      });
    }
    const { name, id } = req.body;
    try {
      const cloud = req.cloud;
      const folder = await cloud.folders.find((folder) => folder.id === id);
      if (!folder) {
        return res.status(404).json({
          message: "Folder not found.",
        });
      }
      if (!(folder.location === "root")) {
        const parent = await cloud.folders.find(
          (Folder) => Folder.id === folder.location
        );
        const inParentIndex = await parent.folders.findIndex(
          (Folder) => Folder._id.toString() === id
        );
        // console.log(inParentIndex);
        parent.folders[inParentIndex].name = name;
      }
      folder.name = name;
      cloud.markModified("folders");
      await cloud.save();
      return res.status(200).json({
        name: folder.name,
        files: folder.files,
        folders: folder.folders,
        location: folder.location,
        sharable: folder.sharable,
        sharedWith: folder.sharedWith,
        sharableLink: folder.sharableLink,
        id: folder.id,
      });
    } catch (error) {
      showError(res, error);
    }
  }
);

//@route    DELETE api/cloud/folders/:id
//@desc     Delete folder
//@access   Private
router.delete("/folders/:id", auth, cloudMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const cloud = req.cloud;
    const folder = await cloud.folders.find((folder) => folder.id === id);
    if (!folder) {
      return res.status(404).json({
        error: "Folder not found.",
      });
    }
    const folderLocation = folder.location;
    let parent;
    if (folderLocation !== "root") {
      parent = await cloud.folders.find(
        (folder) => folder.id === folderLocation
      );
      // const inParentIndex = parent.folders.findIndex((folderId) => {
      //   return folderId.toString() === id;
      // });
      const inParentIndex = parent.folders.findIndex((folder) => {
        console.log(folder._id, id);
        return folder._id.toString() === id;
      });
      parent.folders.splice(inParentIndex, 1);
    }
    deleteSubFolders(folder, cloud)
      .then(async (data) => {
        const folderIndex = cloud.folders.findIndex(
          (Folder) => Folder.id === folder.id
        );
        cloud.folders.splice(folderIndex, 1);
        // await cloud.save();
        return res.status(200).json({
          folder: {
            name: folder.name,
            files: folder.files,
            folders: folder.folders,
            location: folder.location,
            sharable: folder.sharable,
            sharedWith: folder.sharedWith,
            sharableLink: folder.sharableLink,
            id: folder.id,
          },
          parent: parent || cloud.folders,
        });
      })
      .catch((error) => console.log(error));
  } catch (error) {
    showError(res, error);
  }
});

/**
 * File things
 */

//@route    POST api/cloud/file/:folderId
//@desc     Upload file
//@access   Private
router.post(
  "/file/:folderId",
  auth,
  cloudMiddleware,
  fileDetails,
  async (req, res) => {
    const file = req.file;
    const { folderId } = req.params;
    if (!file) {
      return res.status(404).json({
        message: "Please upload a file",
      });
    }
    const { originalname, mimetype, buffer, size } = req.file;
    const fileData = originalname.split(".");
    const fileType = fileData[fileData.length - 1];
    const fileName = fileData.slice(0, fileData.length - 1).join();
    const cloud = req.cloud;
    const sizeInGb = (size / 1024) * 10 ** -6;
    try {
      let folder;
      if (folderId !== "root") {
        folder = cloud.folders.find((folder) => folder.id === folderId);
        if (!folder) {
          return res.status(404).json({
            message: "Folder not found",
          });
        }
      }
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${generateId()}.${fileType}`,
        Body: buffer,
        ContentType: mimetype,
      };
      S3.upload(params, async (err, data) => {
        if (err)
          return res.status(400).json({
            message: err.message,
          });

        const { Location, key } = data;
        const uploadedData = {
          name: originalname,
          fileType,
          size: size,
          mimeType: mimetype,
          location: folderId,
          awsData: {
            url: Location,
            key,
          },
        };
        cloud.files.push(uploadedData);
        if (folderId !== "root") {
          // folder.files.push(cloud.files[cloud.files.length - 1].id);
          folder.files.push(cloud.files[cloud.files.length - 1]);
        }
        cloud.storage = +cloud.storage - sizeInGb;
        cloud.markModified("files");
        await cloud.save();
        const file = cloud.files[cloud.files.length - 1];
        return res.status(200).json({
          cloud: {
            storage: cloud.storage,
            files: cloud.files,
            folders: cloud.folders,
            userId: cloud.user,
          },
          file: {
            id: file.id,
            name: file.name,
            fileType: file.fileType,
            size: file.size,
            mimeType: file.mimeType,
            location: file.location,
            awsData: file.awsData,
            sharable: file.sharable,
            sharedWith: file.sharedWith,
            sharableLink: file.sharableLink,
          },
          parent: folder
            ? {
                name: folder.name,
                files: folder.files,
                folders: folder.folders,
                location: folder.location,
                sharable: folder.sharable,
                sharedWith: folder.sharedWith,
                sharableLink: folder.sharableLink,
                id: folder.id,
              }
            : cloud.files,
        });
      });
    } catch (error) {
      showError(res, error);
    }
  }
);

//@route    GET api/cloud/files/:id
//@desc     get file
//@access   Private
router.get(
  "/files/:id",
  auth,
  cloudMiddleware,
  hasAccessToFile,
  async (req, res) => {
    try {
      if (req.fileData) {
        const file = req.fileData;
        return res.status(200).json({
          id: file.id,
          name: file.name,
          fileType: file.fileType,
          size: file.size,
          mimeType: file.mimeType,
          location: file.location,
          awsData: file.awsData,
          sharable: file.sharable,
          sharedWith: file.sharedWith,
          sharableLink: file.sharableLink,
        });
      }
      return res.status(404).json({
        error: "File not found",
      });
    } catch (error) {
      showError(res, error);
    }
  }
);

//@route    PUT api/cloud/files
//@desc     update file(Rename)
//@access   Private
router.put(
  "/files",
  [
    auth,
    cloudMiddleware,
    check("name", "Name is required").not().isEmpty(),
    check("id", "Id is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        messages: errors.array(),
      });
    }

    const { name, id } = req.body;
    try {
      const { cloud } = req;
      const file = await cloud.files.find((file) => file.id === id);
      if (!file) {
        return res.status(404).json({
          error: "File not found",
        });
      }
      file.name = name;
      await cloud.save();
      return res.status(200).json({
        id: file.id,
        name: file.name,
        fileType: file.fileType,
        size: file.size,
        mimeType: file.mimeType,
        location: file.location,
        awsData: file.awsData,
        sharable: file.sharable,
        sharedWith: file.sharedWith,
        sharableLink: file.sharableLink,
      });
    } catch (error) {
      showError(res, error);
    }
  }
);

//@route    DELETE api/cloud/files/:fileId
//@desc     delete file
//@access   Private
router.delete("/files/:fileId", auth, cloudMiddleware, async (req, res) => {
  const { fileId } = req.params;
  try {
    const { cloud } = req;
    const fileIndex = await cloud.files.findIndex(
      (file) => file._id.toString() === fileId
    );
    const file = cloud.files[fileIndex];
    if (!file) {
      return res.status(404).json({
        error: "File not found",
      });
    }
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: file.awsData.key,
    };
    let folder;
    S3.deleteObject(params)
      .promise()
      .then(async (data) => {
        console.log(data);
        if (file.location !== "root") {
          folder = cloud.folders.find(
            (folder) => folder._id.toString() === file.location
          );
          const inFolderIndex = folder.files.findIndex(
            // (file) => file.toString() === fileId
            (file) => file._id.toString() === fileId
          );
          folder.files.splice(inFolderIndex, 1);
        }
        cloud.storage = +cloud.storage + (file.size / 1024) * 10 ** -6;
        cloud.files.splice(fileIndex, 1);
        await cloud.save();
        return res.status(200).json({
          cloud,
          file: {
            name: file.name,
            files: file.files,
            folders: file.folders,
            location: file.location,
            sharable: file.sharable,
            sharedWith: file.sharedWith,
            sharableLink: file.sharableLink,
            id: file.id,
          },
          parent: folder || cloud.files,
        });
      })
      .catch((error) => {
        console.log(error.message);
        return res.status(400).json({
          data: "Something went wrong",
        });
      });
  } catch (error) {
    showError(res, error);
  }
});

/**
 * File folder sharing
 */

//@route    PUT api/cloud/permission
//@desc     Add permission to all/someone
//@access   Private
router.put(
  "/permission",
  [
    check("id", "Please provide folder id").not().isEmpty(),
    check("users", "Please provide users' email id").isArray(),
    check("type", "Please provide type").not().isEmpty(),
  ],
  auth,
  cloudMiddleware,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        messages: errors.array(),
      });
    }
    const { id, users, type } = req.body;
    try {
      const cloud = req.cloud;
      let object;
      if (type.toLowerCase() === "folder") {
        object = await cloud.folders.find((folder) => folder.id === id);
      } else if (type.toLowerCase() === "file") {
        object = await cloud.files.find((file) => file.id === id);
      } else {
        return res.status(404).json({
          error: `Please provide valid type`,
        });
      }
      if (!object) {
        return res.status(404).json({
          error: `${type} not found`,
        });
      }
      if (users[0].toLowerCase() === "all") {
        //set permission to anyone
        object.sharedWith = [];
        object.sharable = true;
      } else if (users[0].toLowerCase() === "none") {
        //set permission to none
        object.sharedWith = [];
        object.sharable = false;
      } else if (users[0] === "-") {
        const removeUser = users.slice(1);
        removeUser.forEach((user) => {
          const userIndex = object.sharedWith.findIndex((id) => id === user);
          if (userIndex !== -1) {
            object.sharedWith.splice(userIndex, 1);
          }
        });
        if (object.sharedWith.length === 0) {
          object.sharable = false;
        }
      } else {
        await object.sharedWith.push(...users);
        object.sharable = true;
      }
      await cloud.save();
      return res.status(200).json({
        data: object,
      });
    } catch (error) {
      showError(res, error);
    }
  }
);

/**
 * File download
 */
//@route    GET api/cloud/download/:id
//@desc     download file
//@access   Private
router.get("/download/:id", auth, cloudMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const cloud = req.cloud;
    const file = cloud.files.find((file) => file.id === id);
    if (!file) {
      res.status(404).json({
        error: "File not found",
      });
    }
    const fileStream = S3.getObject(
      { Bucket: process.env.AWS_BUCKET_NAME, Key: file.awsData.key },
      (err, data) => {
        if (err) {
          return res.status(400).json({
            message: err.message,
          });
        }
      }
    )
      .createReadStream()
      .on("error", (err) => {
        console.log(err.message);
      });

    fileStream.pipe(res);
    // res.attachment(file.name);
  } catch (error) {
    showError(res, error);
  }
});

/**
 * shorten link
 */

//@route    PUT api/cloud/shorten
//@desc     shorten link
//@access   Private
router.put(
  "/shorten",
  [
    check("longUrl", "longUrl is required").not().isEmpty(),
    check("type", "type is required").not().isEmpty(),
    check("id", "id is required").not().isEmpty(),
  ],
  auth,
  cloudMiddleware,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        messages: errors.array(),
      });
    }

    const { longUrl, type, id } = req.body;
    const BASE_URL = process.env.BASE_URL;

    if (!isUri(BASE_URL)) {
      return res.status(401).json({
        error: "Invalid baseURL",
      });
    }

    try {
      const shortId = generateShortId();
      if (isUri(longUrl)) {
        const cloud = req.cloud;
        let object;

        if (type.toLowerCase() === "file") {
          object = await cloud.files.find((file) => file.id === id);
        } else if (type.toLowerCase() === "folder") {
          object = await cloud.folders.find((folder) => folder.id === id);
        }

        if (!object) {
          return res.status(404).json({
            error: `${type} not found`,
          });
        }

        if (object.sharableLink) {
          object.sharableLink = {
            longUrl,
            shortUrl: BASE_URL + shortId,
            urlCode: shortId,
          };
        }

        await cloud.save();
        return res.status(200).json({
          data: object,
        });
      } else {
        return res.status(401).json({
          error: "Invalid baseURL",
        });
      }
    } catch (error) {
      showError(res, error);
    }
  }
);

/**
 * file upload loading
 * short url , work on it after angular
 */
module.exports = router;
