const mongoose = require('mongoose'),

    u = new mongoose.Schema({
        _id: Number,
        name: {
            
            type: String,
            required: true

        },
        description: {
            type: String,
            default: 'just a guild'
        },
        icon: {

            type: String,
            default: null

        },
        default_channel_id: {

            type: Number,
            required: true

        },
        system_channel_id: {

            type: Number,
            required: true

        },
        owner: {

            id: {
                type: Number,
                required: true
            },
            name: {
                type: String,
                required: true
            }

        },
        members: [{

            user: {
                id: Number,
                username: String,
                tag: String,
                avatar: String
            },

            roles: Array,
            nickname: String,

            createdAt: {

                type: Date,
                default: Date.now(),
                required: true

            },

            joinedAt: {

                type: Date,
                required: true

            }

        }],
        channels: Array,
        invites: Array,
        roles: Array,

        CreatedAt: {

            default: Date.now(),
            type: Date,
            required: true

        }

    }, {
        versionKey: false
    })

module.exports = mongoose.model('guild', u)