const mongoose = require('mongoose'),

    u = new mongoose.Schema({
        _id: Number,
        code: String,
        guild: {

            id: {
                type: Number,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            icon: {
                type: String
            },
            description: String,

        },

        channel: {

            type: Object,
            required: true
            
        },

        inviter: {

            id: {
                type: Number,
                required: true
            },
            username: {
                type: String,
                required: true
            },
            avatar: String,
            tag: String

        },

        expired: {
            required: true,
            type: Date
        },

        target_users: [{
            id: Number,
            username: String,
            avatar: String,
            tag: String
        }],


    }, {
        versionKey: false
    })

module.exports = mongoose.model('invite', u)