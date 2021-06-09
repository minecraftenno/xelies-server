const mongoose = require('mongoose'),

u = new mongoose.Schema({
    _id: Number,
    name: String,
    members: Array,
    channels: Array,
    invitations: Array,
    CreatedAt: { default: Date.now(), type: Date }
}, {
    versionKey: false
})

module.exports = mongoose.model('guild', u)