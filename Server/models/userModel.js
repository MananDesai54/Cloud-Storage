const mongoose = require('mongoose');

const Model = new mongoose.Schema({
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
    password: {
        type: String,
        required: true,
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