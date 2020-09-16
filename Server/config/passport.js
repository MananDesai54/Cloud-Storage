const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = require('../models/userModel');
const Profile = require('../models/profileModel');
const { use } = require('../routes/userRoutes');

module.exports = async function(passport, req, res) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
        clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        callbackURL: '/api/users/google/callback'
    }, async (accessToken, refreshToken, profile, done) => {
        const { id, displayName, name, emails, photos } = profile;
        const firstname = name.givenName;
        const lastname = name.familyName;
        const email = emails[0].value; //verified true 
        const avatar = photos[0].value;
        console.log(displayName, email, firstname, lastname, avatar);

        try {
            
            let user = await User.findOne({ email: { value: email } });
            if (user) {
                return done(null, user);
            }
            user = await User.create({
                username: displayName,
                email: {
                    value: email,
                    verified: true
                },
                password: id
            });
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