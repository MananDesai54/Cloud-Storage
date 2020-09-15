const router = require('express').Router();
const auth = require('../middleware/auth');
const User = require('../models/userModel');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bCrypt = require('bcryptjs');

//@route    GET api/auth
//@desc     Auth router
//@access   Private
router.get('/', auth, async (req,res) => {
    try {
     
        const user = await User.findById(req.user.id).select('-password');
        if(!user) {
            return res.status(401).json({
                error: 'Not authorized'
            });
        }
        return res.status(200).json(user);

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            error: 'Server error'
        })
    }
});

//@route    POST api/auth
//@desc     Login user
//@access   Public
router.post('/', [
        check('email', 'Invalid Email.').isEmail(),
        check('password', 'Please provide password.').exists()
    ], async (req, res) => {

        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({
                error: errors.array()
            })
        }

        const { email, password } = req.body;

        try {
            
            const user = await User.findOne({ email });
            if(!user) {
                return res.status(404).json({
                    error: 'Invalid credential.E'
                })
            }

            const isMatch = await bCrypt.compare(password, user.password);
            if(!isMatch) {
                return res.status(404).json({
                    error: 'Invalid credential.P'
                });
            }

            //jwt
            const payload = {
                user: {
                    id: user.id
                }
            }
            jwt.sign(payload, process.env.JWT_SECRET_KEY,{ expiresIn: '24hr' }, (err, token) => {
                if(err) return res.status(500).json({
                    error: 'Server Error'
                });

                return res.status(200).json({ token });
            })

        } catch (error) {
            console.log(error.message);
            return res.status(500).json({
                error: 'Server Error'
            })
        }

    })

module.exports = router;