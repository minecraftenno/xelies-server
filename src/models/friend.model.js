const mongoose = require('mongoose'),

    a = new mongoose.Schema({
        to: {
            type: Number,
            required: true
        },
        by: {
            type: Number,
            required: true
        },
        status: {
            type: Number,
            required: true
        },
        CreatedAt: {
            default: Date.now(),
            type: Date
        }
    })

module.exports = mongoose.model('friend', a)