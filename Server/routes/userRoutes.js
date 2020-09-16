const router = require('express').Router();
const { check,validationResult } = require('express-validator');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
            
            let user = await User.findOne({ email });

            if(user) {
                return res.status(401).json({
                    error: 'User with this username already exist'
                })
            }

            user = new User({
                username: username.toLowerCase(),
                email,
                password
            });

            //encrypt Password
            const sault = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, sault);

            await user.save();

            //generate JWT token
            const payload = {
                user: {
                    id: user.id
                }
            }
            jwt.sign(payload, process.env.JWT_SECRET_KEY, {
                        expiresIn: '24hr'
                    },(err, token) => {
                        if(err) return res.status(500).json({
                            error: 'Server error'
                        });

                        return res.status(200).json({
                            user,
                            token
                        });
                    })

        } catch (error) {
            console.log(error.message);
            res.status(500).json({
                error: 'Server error'
            })
        }
        
})

module.exports = router;