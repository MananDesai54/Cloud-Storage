const router = require('express').Router();
const Cloud = require('../models/cloudModel');
const auth = require('../middleware/auth');
const cloudMiddleware = require('../middleware/cloud');
const showError = require('../config/showError');
const deleteFolder = require('../config/deleteFolder');
const { v4: generateId } = require('uuid');
const { check, validationResult } = require('express-validator');

const fileDetails = require('../config/fileData');
const S3 = require('../config/aws');


//@route    GET api/cloud
//@desc     get files & folder at root level
//@access   Private
router.get('/', auth, cloudMiddleware, (req, res) => {
    try {
        
        const cloud = req.cloud;
        const data = {
            storage: cloud.storage,
            files: cloud.files,
            folders: cloud.folders
        }

        return res.status(200).json({
            data
        })

    } catch (error) {
        showError(res, error)   
    }
})

//@route    POST api/cloud/folder
//@desc     create folder
//@access   Private
router.post('/folder', [
    auth,
    check('name', 'Name is required').not().isEmpty(),
    check('location', 'Location of file is required').not().isEmpty()
], async (req,res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.json({
            errors: errors.array()
        })
    }

    const { name, location } = req.body;
    try {
        
        const user = req.user;
        let cloud = await Cloud.findOne({ user: user.id });
        if(!cloud) {
            cloud = new Cloud({
                user: user.id
            })
        }
        let folderIndex;
        if(location !== 'root') {
            folderIndex = cloud.folders.findIndex(folder => folder.id === location);
            if(!cloud.folders[folderIndex]) {
                return res.status(404).json({
                    error: 'Folder not found.'
                });
            }
        }
        await cloud.folders.push({
            name,
            location
        });
        if(location !== 'root') {
            cloud.folders[folderIndex].folders.push(cloud.folders[cloud.folders.length-1].id);
        }
        await cloud.save();
        return res.status(200).json({
            data: cloud.folders[cloud.folders.length-1]
        })

    } catch (error) {
        showError(res, error)   
    }
});

//@route    GET api/cloud/folders/:id
//@desc     get any folder data
//@access   Private
router.get('/folders/:id', auth, cloudMiddleware, async (req, res) => {
    const { id } = req.params;
    try {

        const cloud = req.cloud;
        const folder = await cloud.folders.find(folder => folder.id === id);
        if(!folder) {
            return res.status(404).json({
                error: 'Folder not found.'
            })
        }
        return res.status(200).json({
            data: folder
        })
    } catch (error) {
        showError(res, error)   
    }
})

//@route    PUT api/cloud/folders
//@desc     Update folder(rename)
//@access   Private
router.put('/folders', [
    auth,
    cloudMiddleware,
    check('name', 'Name is required').not().isEmpty(),
    check('id', 'Id is required').not().isEmpty()
], async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.json({
            errors: errors.array()
        })
    }
    const { name, id } = req.body;
    try {
        const cloud = req.cloud;
        const folder = await cloud.folders.find(folder => folder.id === id);
        if(!folder) {
            return res.status(404).json({
                error: 'Folder not found.'
            })
        }
        folder.name = name;
        await cloud.save();
        return res.status(200).json({
            data: folder
        });
    } catch (error) {
        showError(res, error)   
    }
});

//@route    DELETE api/cloud/folders/:id
//@desc     Delete folder
//@access   Private
router.delete('/folders/:id', auth, cloudMiddleware, async (req, res) => {
    const { id } = req.params;
    try {

        const cloud = req.cloud;
        const folder = await cloud.folders.find(folder => folder.id === id);
        if(!folder) {
            return res.status(404).json({
                error: 'Folder not found.'
            })
        }
        const folderLocation = folder.location;
        if(folderLocation !== 'root') {
            const parent = cloud.folders.find(folder => folder.id === folderLocation);
            const inParentIndex = parent.folders.findIndex(folderId => {
                return folderId.toString() === id
            });
            parent.folders.splice(inParentIndex, 1);
        }
        deleteFolder(folder, cloud, res);
        const folderIndex = cloud.folders.findIndex(Folder => Folder.id === folder.id);
        cloud.folders.splice(folderIndex, 1);
        
        await cloud.save();
        return res.status(200).json({
            message: 'Folder deleted'
        });
    } catch (error) {
        showError(res, error);
    }
})

//@route    POST api/cloud/file/:folderId
//@desc     Upload file
//@access   Private
router.post('/file/:folderId', auth, cloudMiddleware, fileDetails, async (req, res) => {
    const file = req.file;
    const { folderId } = req.params;
    if(!file) {
        return res.status(404).json({
            error: 'Please upload a file'
        });
    }
    const { originalname, mimetype, buffer, size } = req.file;
    const fileData = originalname.split('.');
    const fileType = fileData[fileData.length - 1];
    const fileName = fileData.slice(0,fileData.length - 1).join();
    try {
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${generateId()}.${fileType}`,
            Body: buffer,
            ContentType: mimetype
        }
        S3.upload(params, async (err, data) => {
            if(err) return res.status(400).json({
                error: err.message
            })

            const { Location, key } = data;
            const cloud = req.cloud;
            const uploadedData = {
                name: originalname,
                fileType,
                mimeType: mimetype,
                location: folderId,
                awsData: {
                    url: Location,
                    key
                }
            }
            cloud.files.push(uploadedData);
            if(folderId !== 'root') {
                const folder = cloud.folders.find(folder => folder.id === folderId);
                folder.files.push(cloud.files[cloud.files.length - 1].id);
            }
            await cloud.save();

            return res.status(200).json({
                data: cloud.files[cloud.files.length - 1]
            });
        });
    } catch (error) {
        showError(res, error);
    }
});

//@route    GET api/cloud/files/:fileId
//@desc     get file
//@access   Private
router.get('/files/:fileId', auth, cloudMiddleware, async (req, res) => {
    const { fileId } = req.params;
    try {
        const cloud = req.cloud;
        const file = await cloud.files.find(file => file.id === fileId);
        if(!file) {
            return res.status(404).json({
                error: 'File not found'
            });
        }
        return res.json({
            data: file
        })

    } catch (error) {
        showError(res, error);
    }
});

//@route    PUT api/cloud/files
//@desc     update file(Rename)
//@access   Private
router.put('/files', [
    auth,
    cloudMiddleware,
    check('name', 'Name is required').not().isEmpty(),
    check('id', 'Id is required').not().isEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.json({
            errors: errors.array()
        })
    }

    const { name, id } = req.body;
    try {
        const { cloud } = req;
        const file = await cloud.files.find(file => file.id === id);
        if(!file) {
            return res.status(404).json({
                error: 'File not found'
            });
        }
        file.name = name;
        await cloud.save();
        return res.status(200).json({
            data: file
        })

    } catch (error) {
        showError(res, error);
    }
})

//@route    DELETE api/cloud/files/:fileId
//@desc     delete file
//@access   Private
router.delete('/files/:fileId', auth, cloudMiddleware, async (req, res) => {
    const { fileId } = req.params;
    try {
        const { cloud } = req;
        const fileIndex = await cloud.files.findIndex(file => file.id.toString() === fileId);
        if(!cloud.files[fileIndex]) {
            return res.status(404).json({
                error: 'File not found'
            });
        }
        const params = { 
            Bucket: process.env.AWS_BUCKET_NAME, 
            Key: cloud.files[fileIndex].awsData.key
        }
        S3.deleteObject(params).promise()
            .then(async (data) => {
                console.log(data);
                if(cloud.files[fileIndex].location !== 'root') {
                    const folder = cloud.folders
                            .find(folder => folder.id.toString() === cloud.files[fileIndex].location);
                    const inFolderIndex = folder.files.findIndex(file => file.id.toString() === fileId);
                    folder.files.splice(inFolderIndex, 1);
                }
                cloud.files.splice(fileIndex, 1);
                await cloud.save();
                return res.status(200).json({
                    message: 'File Deleted'
                });
            })
            .catch(error => {
                console.log(error.message);
                return res.status(400).json({
                    data: 'Something went wrong'
                });
            })

    } catch (error) {
        showError(res, error);
    }
});


/*
    Todo on Folder Delete files delete remain
    file upload loading
    decrease available space out of 15 gb
*/
module.exports = router;