const mongoose = require('mongoose'),

    u = new mongoose.Schema({
        _id: Number,
        name: {
            type: String,
            required: true
        },
        guild: {
            type: Number,
            required: true
        },
        permissions: Array,
        color: String,
        default: {
            type: Boolean,
            required: true
        },
        deletable: {
            type: Boolean,
            required: true
        },
        CreatedAt: {
            default: Date.now(),
            type: Date,
            required: true
        }
    }, {
        versionKey: false
    })

module.exports = mongoose.model('roles', u)