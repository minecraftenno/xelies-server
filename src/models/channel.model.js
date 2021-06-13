const mongoose = require('mongoose')

u = new mongoose.Schema({
    _id: Number,
    name: {
        type: String,
        required: true
    },
    guild: {
        id: {
            type: Number,
            required: true
        },
        name: {
            type: String,
            required: true
        }
    },
    password: {
        type: String,
        required: false
    },
    rate_limit_per_user: {
        type: Number,
        default: 0,
        required: true
    },
    author: Number,
    messages: {
        type: Array,
        default: []
    },
    type: Number,
    permissions: {
        type: Array
    },
    position: Number,
    nsfw: {
        type: Boolean,
        default: false,
        required: true
    },
    CreatedAt: {
        type: Date,
        default: Date.now,
        required: true
    }
}, {
    versionKey: false
})

module.exports = mongoose.model('channel', u)