const router = require('express').Router();
const Profile = require('../models/profileModel');
const auth = require('../middleware/auth');
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { v4: generateId } = require('uuid');

//aws & s3 configure
aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
})

const S3 = aws.S3();
const upload = multer({
    storage: multerS3({
        s3: S3,
        bucket: 'cloud-storage-uploads',
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            cb(null, rq.s3Key);
        }
    })
});

const singleFileUpload = upload.single('image');

const uploadToS3 = (req, res) => {
    req.s3Key = generateId();
    const downloadURL = `https://cloud-storage-uploads.s3.amazonaws.com/${req.s3Key}`;
    return new Promise((resolve, reject) => {
        return singleFileUpload(req, res, err => {
            if(err) return reject(err);
            return resolve(downloadURL);
        })
    })
}


//@route    GET api/profile
//@desc     get user profile
//@access   Private
router.get('/', auth, async (req,res) => {
    try {
        const user = req.user;
        const profile = await Profile.findOne({ user: user.id });
        if(!profile) {
            return res.status(404).json({
                message: 'Profile not found'
            });
        }
        return res.status(200).json(profile);
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            error: 'Server Error'
        })
    }
});

//@route    POST api/profile
//@desc     add user data for local method
//@access   Private
router.post('/', auth, async (req, res) => {
    const { firstname, lastname, avatar } = req.body;
    try {
        const user = req.user;
        const profile = await Profile.findOne({ user: user.id });
        if(!profile) {
            return res.status(404).json({
                message: 'Profile not found'
            });
        }

        if(firstname) profile.firstname = firstname;
        if(lastname) profile.lastname = lastname;
        if(avatar) profile.avatar = avatar;

        await profile.save();

        return res.status(200).json(profile);
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            error: 'Server Error'
        })
    }
});

//@route    PUT api/profile/update
//@desc     Update user
//@access   Private
router.put('/', auth, async (req, res) => {
    const { firstname, lastname } = req.body;
    try {
        const user = req.user;
        const profile = await Profile.findOne({ user: user.id });
        if(!profile) {
            return res.status(404).json({
                message: 'Profile not found'
            });
        }

        if(firstname) profile.firstname = firstname;
        if(lastname) profile.lastname = lastname;

        await profile.save();

        return res.status(200).json(profile);
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            error: 'Server Error'
        })
    }
});

//@route    PUT api/profile/avatar/upload
//@desc     Update user
//@access   Private
router.put('/avatar/upload', auth, (req, res) => {
    console.log(req.body);
    uploadToS3(req, res)
        .then(downloadURL => {
            return res.status(200).json({
                downloadURL
            })
        })
        .catch(err => {
            console.log(err);
            res.redirect('/');
        })
});

module.exports = router;