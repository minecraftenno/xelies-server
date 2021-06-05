const mongoose = require('mongoose'),

u = new mongoose.Schema({
    _id: Number,
    email: { type: Object, required: true, unique: true },
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