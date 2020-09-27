const router = require('express').Router();
const Cloud = require('../models/cloudModel');
const auth = require('../middleware/auth');

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
        console.log(error.message);
        return res.status(500).json({
            error: 'Server Error'
        })
    }
});

//@route    GET api/cloud
//@desc     get files & folder at root level
//@access   Private
router.get('/', auth, async (req, res) => {
    try {
        
        const cloud = await Cloud.findOne({ user: req.user.id });
        if(!cloud) {
            return res.status(404).json({
                error: 'Cloud not found !!!'
            })
        }
        const data = {
            storage: cloud.storage,
            files: cloud.files,
            folders: cloud.folders
        }

        return res.status(200).json({
            data
        })

    } catch (error) {
        console.log(error.message);
        return res.status({
            error: 'Server error'
        })
    }
})

//@route    GET api/cloud/folders/:id
//@desc     get any folder data
//@access   Private
router.get('/folders/:id', auth, async (req, res) => {
    const { id } = req.params;
    try {

        const cloud = await Cloud.findOne({ user: req.user.id });
        if(!cloud) {
            return res.status(404).json({
                error: 'Cloud not found.'
            });
        }
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
        console.log(error.message);
        return res.status(500).json({
            error: 'Server error'
        })
    }
})
module.exports = router;