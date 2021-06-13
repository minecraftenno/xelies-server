const ApiError = require("../../helpers/ApiError"),
    Authorized = require("../../middlewares/authorization"),
    CheckAuth = require("../../middlewares/jwt"),
    guilds = require("../../models/guild.model"),
    user = require("../../models/user.model"),
    channels = require("../../models/channel.model"),
    roles = require('../../models/roles.model'),
    uuid = require('../../function/uuid').default

module.exports = (app) => {
    app.post("/guild", Authorized, async (req, res) => {

        const {
            name
        } = req.body,
        authorization = req.headers.authorization || req.signedCookies.Authorization

        if (!req.password) return res.status(401).json(ApiError.unauthorized)
    
        let decoded = require('../../../middlewares/jwt')(authorization, req.password)

        if (!decoded.ID) return res.status(401).json(ApiError.unauthorized)
        //CODE
        const d = await user.findById(decoded.ID)
        if (!d) return res.status(401).json(ApiError.unauthorized)

        const guild_id = uuid.gen(),

            channel = await channels.create({
                _id: uuid.gen(),
                name: "general",
                guild_id: guild_id,
                guild_name: name || "Server of " + d.username,
                rate_limit_per_user: 0,
                author: decoded.ID,
                type: 0,
                permissions: ['SEND_MESSAGE', 'CREATE_INVITE'],
                position: 0
            }),

            everyone = await roles.create({
                _id: uuid.gen(),
                name: 'everyone',
                guild: guild_id,
                permissions: ['SEND_MESSAGE', 'CREATE_INVITE'],
                color: null,
                default: true,
                deletable: false,
                CreatedAt: Date.now()
            }),
            owner = await roles.create({
                _id: uuid.gen(),
                name: 'owner',
                guild: guild_id,
                permissions: ['ADMINISTRATOR'],
                color: null,
                default: true,
                deletable: false,
                CreatedAt: Date.now()
            }),

            guild = await guilds.create({
                _id: guild_id,
                name: name || "Server of " + d.username,
                description: "Server of " + d.username,
                owner: {
                    id: decoded.ID,
                    name: d.username
                },
                icon: null,
                members: [{
                    user: {
                        id: decoded.ID,
                        username: d.username,
                        tag: d.tag,
                        avatar: d.avatar
                    },
                    roles: [everyone._id, owner._id],
                    nickname: null,
                    createdAt: d.CreatedAt,
                    joinedAt: Date.now(),
                }],
                default_channel_id: channel._id,
                system_channel_id: channel._id,
                channels: [channel._id],
                roles: [everyone._id, owner._id]
            })
        user.findByIdAndUpdate(decoded.ID, {
            $push: {
                guilds: guild._id
            }
        }, e => {
            if (e) return res.status(500).json(ApiError.error)
            return res.status(200).json(guild)
        })
    })
}