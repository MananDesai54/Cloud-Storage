const router = require('express').Router();
const Cloud = require('../models/cloudModel');
const auth = require('../middleware/auth');
const cloudMiddleware = require('../middleware/cloud');
const showError = require('../config/showError');

//@route    POST api/cloud/folder
//@desc     create folder
//@access   Private
router.post('/folder', auth, async (req,res) => {
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
            cloud
        })

    } catch (error) {
        showError(res, error)   
    }
});

//@route    GET api/cloud
//@desc     get files & folder at root level
//@access   Private
router.get('/', auth, cloudMiddleware, (req, res) => {
    try {
        
        const cloud = req.cloud;
        console.log(cloud);
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

//@route    PUT api/cloud/folders/:id
//@desc     Update folder(rename)
//@access   Private
router.put('/folders/:id', auth, cloudMiddleware, async (req, res) => {
    const { name } = req.body;
    const { id } = req.params;
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
    } catch (error) {
        showError(res, error);
    }
})

module.exports = router;