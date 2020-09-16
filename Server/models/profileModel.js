const mongoose = require('mongoose');

const Model = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    firstname : {
        type: String
    },
    lastname : {
        type: String
    },
    avatar: {
        type: String
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

module.exports = Profile = mongoose.model('Profile',Model);