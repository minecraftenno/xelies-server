const mongoose = require('mongoose')

u = new mongoose.Schema({
    _id: Number, 
    name: String,
    guild: String,
    author: String,
    messages: {type: Array, default: []},
    type: Number,
    permissions: Number,
    position: Number,
    nsfw: { type: Boolean, default: false },
    CreatedAt: { type: Date, default: Date.now }
}, {
    versionKey: false
})

module.exports = mongoose.model('channel', u)