const mongoose = require('mongoose');

const Model = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    files: [
        {
            name: {
                type: String,
                required: true
            },
            fileType: {
                type: String,
                required: true
            },
            mimeType: {
                type: String,
                required: true
            },
            location: {
                type: String,
                required: true
            },
            sharable: {
                type: Boolean,
                default: false
            },
            sharedWith: {
                type: Array,
                default: []
            },
            sharableLink: {
                type: String
            },
            createdDate: {
                type: Date,
                default: Date.now()
            },
            updatedDate: {
                type: Date,
                default: Date.now()
            },
        }
    ],
    folders: [
        {
            name: {
                type: String,
                required: true
            },
            files: {
                type: [mongoose.Schema.Types.ObjectId]
            },
            folders: {
                type: [mongoose.Schema.Types.ObjectId]
            },
            location : {
                type: String,
                required: true
            },
            sharable: {
                type: Boolean,
                default: false
            },
            sharedWith: {
                type: Array
            },
            sharableLink: {
                type: String
            },
            createdDate: {
                type: Date,
                default: Date.now()
            },
            updatedDate: {
                type: Date,
                default: Date.now()
            },
        }
    ],
    storage: {
        type: Number,
        default: 15
    }
});

module.exports = Cloud = mongoose.model('Cloud', Model);