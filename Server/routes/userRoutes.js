const router = require('express').Router();
const { check,validationResult } = require('express-validator');
const User = require('../models/userModel');
const Profile = require('../models/profileModel');
const Cloud = require('../models/cloudModel');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const generateToken = require('../config/generateToken');
const auth = require('../middleware/auth');
const verifyItsYou = require('../middleware/verifyItsYou');

//@route    POST api/users
//@desc     Register router
//@access   Public
router.post('/', [
        check('username', 'username is required and username must not contain space.').not().isEmpty(),
        check('email', 'Email is not valid').isEmail(),
        check('password', 'Password must of length between 8-32, Contains capital letter , small letter , number and special character.').isLength({ min: 8, max: 32 })
        // .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_=+-/<>?`~:])[A-Za-z\d!@#$%^&*_=+-/<>?`~:]{8,32}$/g)
    ], async (req,res) => {
        
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.json({
                errors: errors.array()
            })
        }

        const { username, email, password } = req.body;
        try {
            
            let user = await User.findOne({ "email.value": email });

            if(user) {
                return res.status(401).json({
                    error: 'User with this username already exist'
                })
            }

            user = new User({
                method: 'local',
                username: username.toLowerCase(),
                email: {
                    value: email,
                    verified: false
                },
                local: {
                    password: password,
                    oldPasswords: []
                }
            });

            //encrypt Password
            const sault = await bcrypt.genSalt(10);
            user.local.password = await bcrypt.hash(user.local.password, sault);
            user.local.oldPasswords.push(user.local.password);

            await user.save();
            await Profile.create({
                user: user.id,
                avatar: {
                    url: 'https://cloud-storage-uploads.s3.amazonaws.com/profile.png',
                    key: 'profile.png'
                }
            });
            await Cloud.create({
                user: user.id
            });

            //generate JWT token
            const token = generateToken(user);
            return res.status(200).json({
                token
            });

        } catch (error) {
            console.log(error.message);
            res.status(500).json({
                error: 'Server error'
            })
        }      
})

//@route    GET api/users/google
//@desc     Auth with google
//@access   Public
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

//@route    GET /api/users/google/callback
//@desc     Google auth callback
//@access   Public
router.get('/google/callback',  passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {

    const token = generateToken(req.user);
    console.log(token);
    res.status(200).json({
        data: req.user,
        token
    })
});

//@route    PUT api/users
//@desc     Update user
//@access   Private
router.put('/', [auth, verifyItsYou], async (req, res) => {
    const { email, username, password, newPassword } = req.body;
    try {
        
        const user = await User.findById(req.user.id);

        if(email) user.email.value = email;
        if(username) user.username = username;
        if(newPassword) {
            const sault = await bcrypt.genSalt(10); 
            if(user.local.oldPasswords.find(pswd => {
                return bcrypt.compareSync(newPassword, pswd)
            })) {
                return res.status(400).json({
                    error: 'You cannot use the password that you have used before.'
                });
            }
            user.local.oldPasswords.push(bcrypt.hashSync(newPassword, sault));
            user.local.password = newPassword;
            user.local.password = await bcrypt.hash(user.local.password, sault);
        } 

        await user.save();
        return res.status(200).json({
            data: user,
            message: 'User updated'
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            error: 'Server Error'
        })
    }
});


/*
    @Todo social Logins
    do after done with Angular
*/
//@route    POST api/users/google
//@desc     Auth with google token
//@access   Public
//not working check why
// router.post('/google', passport.authenticate('google-plus-token'));

//@route    POST api/users/google
//@desc     Auth with google token
//@access   Public
// router.post('/google')

module.exports = router;