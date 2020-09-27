const router = require('express').Router();
const Cloud = require('../models/cloudModel');
const auth = require('../middleware/auth');

//@route    GET api/cloud/folder
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

module.exports = router;