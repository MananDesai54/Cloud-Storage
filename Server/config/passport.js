const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GoogleTokenStrategy = require('passport-google-plus-token');
const mongoose = require('mongoose');
const User = require('../models/userModel');
const Profile = require('../models/profileModel');

module.exports = async function (passport) {
    googleOAuth(passport);
    googleAccessToken(passport);
}

function googleAccessToken(passport) {
    passport.use(new GoogleTokenStrategy({
        clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
        clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        passReqToCallback: true
    }, async (accessToken, refreshToken, profile, done) => {
        console.log(profile);
    }));
}

function googleOAuth(passport) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
        clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        callbackURL: '/api/users/google/callback'
    }, async (accessToken, refreshToken, profile, done) => {
        const {
            id,
            displayName,
            name,
            emails,
            photos
        } = profile;
        const firstname = name.givenName;
        const lastname = name.familyName;
        const email = emails[0].value; //verified true 
        const avatar = photos[0].value;
        console.log(displayName, email, firstname, lastname, avatar);
        console.log('Access token : ', accessToken);

        try {

            let user = await User.findOne({
                "email.value": email
            });
            if (user) {
                console.log('Already exist');
                return done(null, user);
            }
            user = await User.create({
                method: 'google',
                username: displayName,
                email: {
                    value: email,
                    verified: true
                },
                google: {
                    googleId: id
                }
            });
            const profile = await Profile.create({
                user: user.id,
                firstname: firstname,
                lastname: lastname,
                avatar: avatar
            })
            return done(null, user);

        } catch (error) {
            console.log(error.message);
        }
    }))

    passport.serializeUser((user, done) => done(null, user.id));

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => done(err, user));
    });
}