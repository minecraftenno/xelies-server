const ApiError = require('../../../helpers/ApiError'),
    auth = require('../../../middlewares/authorization'),
    guilds = require('../../../models/guild.model'),
    roles = require('../../../models/roles.model'),
    invite = require('../../../models/invite.model'),
    users = require('../../../models/user.model')

module.exports = (app) => {
    app.post('/invite/:code', auth, async (req, res) => {

            if (!req.params) return res.status(400).json(ApiError.badrequest)
            if (!req.password) return res.status(401).json(ApiError.unauthorized)
            const {
                code
            } = req.params,
            authorization = req.headers.authorization || req.signedCookies.Authorization
            let decoded = require('../../../middlewares/jwt')(authorization, req.password)
    
            if (!decoded.ID) return res.status(401).json(ApiError.unauthorized)

            let user = await users.findById(decoded.ID)
            let i = await invite.findOne({
                code: code
            })
            if (!i) return res.status(404).json(ApiError.notfound)

            server = await guilds.findById(i.guild.id)
            if (server.banned.includes(decoded.ID)) return res.status(403).json(new ApiError(403, 'you are banned from this guild'))
            let a = server.members.find(a=> a.user.id === decoded.ID)
            if(a) return res.status(400).json(new ApiError(400, 'are already on the server'))

            role = await roles.find({
                '_id': {
                    $in: server.roles
                }
            })
            everyone = role.find(a => a.name === 'everyone' && a.default == true)

        guilds.findOneAndUpdate({
            _id: Number(i.guild.id),
            channels: Number(i.channel.id)
        }, {
            $push: {
                members: {
                    user: {
                        id: user._id,
                        username: user.username,
                        tag: user.tag,
                        avatar: user.avatar
                    },
                    roles: [everyone._id],
                    nickname: null,
                    createdAt: user.CreatedAt,
                    joinedAt: Date.now()
                }
            }
        }, (e, d) => {
            if (e) return res.status(500).json(ApiError.error)
            if (!d) return res.Status(404).json(ApiError.notfound)
        })

        users.findByIdAndUpdate(decoded.ID, {
            $push: {
                guilds: server._id
            }
        }, (e, d) => {
            if (e) return res.status(500).json(ApiError.error)
            if (!d) return res.status(404).json(ApiError.notfound)
        })

        return res.status(204).json()

    })
}