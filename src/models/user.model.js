const mongoose = require('mongoose'),

u = new mongoose.Schema({
    email: String,
    username: String,
    tag: String,
    password: String,
    avatar: String,
    friends: Array,
    notifications: Array,
    bio: String,
    status: Number,
    CreatedAt: { default: Date.now(), type: Date }
})

module.exports = mongoose.model('user', u)