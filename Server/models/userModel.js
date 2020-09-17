const mongoose = require('mongoose');

const Model = new mongoose.Schema({
    method: {
        type: String,
        enum: ['local', 'google', 'facebook'],
        required: true
    },
    username : {
        type: String,
        required: true,
    },
    email : {
        type: {
            value: {
                type: String
            },
            verified: {
                type: Boolean,
                default: false
            },
        },
        required: true,
        unique: true
    },
    local: {
        password: {
            type: String,
        },
    },
    google: {
        googleId: {
            type: String
        },
    },
    facebook: {
        facebookId: {
            type: String
        },
    },
    createdDate: {
        type: Date,
        default: Date.now()
    },
    updatedDate: {
        type: Date,
        default: Date.now()
    }
})

module.exports = User = mongoose.model('User',Model);