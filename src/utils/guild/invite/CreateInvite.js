const ApiError = require('../../../helpers/ApiError'),
    auth = require('../../../middlewares/authorization'),
    CheckAuth = require('../../../middlewares/jwt'),
    guilds = require('../../../models/guild.model'),
    roles = require('../../../models/roles.model'),
    invite = require('../../../models/invite.model'),
    channels = require('../../../models/channel.model'),
    users = require('../../../models/user.model'),
    gen = require('../../../function/genID'),
    uuid = require('../../../function/uuid').default

module.exports = (app) => {
    app.post('/guild/:guild_id/:channel_id/invite', auth, async (req, res) => {

        if (!req.params) return res.status(400).json(ApiError.badrequest)
        if (!req.password) return res.status(401).json(ApiError.unauthorized)
        const {
            guild_id,
            channel_id
        } = req.params,

        authorization = req.headers.authorization || req.signedCookies.Authorization
        let decoded = require('../../../middlewares/jwt')(authorization, req.password)

        if (!decoded.ID) return res.status(401).json(ApiError.unauthorized)


        if (isNaN(guild_id) || isNaN(channel_id)) return res.status(400).json(new ApiError(400, 'the value is not int'))
        if (!decoded.ID) return res.status(401).json(ApiError.unauthorized)

        let server = await guilds.findOne({
            _id: Number(guild_id),
            channels: Number(channel_id)
        })
        if (!server) return res.status(403).json(ApiError.forbidden)

        let channel = await channels.findOne({
            _id: Number(channel_id),
            guild_id: Number(guild_id)
        })
        if (!channel) return res.status(403).json(ApiError.forbidden)
        let member = await server.members.find(a => a.user.id === decoded.ID)

        if (!member) return res.status(403).json(ApiError.forbidden)

        let user = await users.findById(decoded.ID),
        role = await roles.find({
            '_id': {
                $in: member.roles
            }
        })

        expire = req.body.expire ? req.body.expire == 0 ? 3600000 : req.body.expire == 1 ? 86400000 : req.body.expire == 2 ? 604800000 : req.status(400).json(ApiError.badrequest) : 3153600000000

        let a = []
        role.forEach(b=> {
            b.permissions.forEach(c=> {
                a.push(String(c))
            })
        })

        if (!a.includes('ADMINISTRATOR') && !a.includes('CREATE_INVITE')) return res.status(401).json(ApiError.unauthorized)

        let create = await invite.create({
            _id: uuid.gen(),
            code: gen(7),
            guild: {

                id: server._id,
                name: server.name,
                icon: server.icon || null,
                description: server.description || null

            },
            channel: {

                id: Number(channel._id),
                name: channel.name,
                type: channel.type

            },

            inviter: {

                id: user._id,
                username: user.username,
                tag: user.tag,
                avatar: user.avatar || null

            },

            expired: Date.now() + expire

        })
        if(!create) return res.status(500).json(ApiError.error)
        guilds.findByIdAndUpdate(server._id, {
            $push: {
                invites: create._id
            }
        }, e => {
            if (e) return res.status(500).json(ApiError.error)
            return res.status(200).json({ code: 201, invite: create.code, id: create._id })
        })
    })
}
