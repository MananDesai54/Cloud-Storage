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
            createdDate: {
                type: Date,
                default: Date.now()
            },
            updatedDate: {
                type: Date,
                default: Date.now()
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
            }
        }
    ],
    folders: [
        {
            name: {
                type: String,
                required: true
            },
            createdDate: {
                type: Date,
                default: Date.now()
            },
            updatedDate: {
                type: Date,
                default: Date.now()
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
            files: {
                type: [mongoose.Schema.Types.ObjectId]
            }
        }
    ],
    storage: {
        type: Number,
        default: 15
    }
});

module.exports = Cloud = mongoose.model('Cloud', Model);