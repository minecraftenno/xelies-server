const ApiError = require('../../helpers/ApiError'),
    auth = require('../../middlewares/authorization'),
    guilds = require('../../models/guild.model'),
    invites = require('../../models/invite.model'),
    channels = require('../../models/channel.model'),
    users = require('../../models/user.model'),
    roles = require('../../models/roles.model')

module.exports = (app) => {
    app.delete('/guild/:code', auth, async (req, res) => {

        if (!req.params) return res.status(400).json(ApiError.badrequest)
        if (!req.password) return res.status(401).json(ApiError.unauthorized)
        const {
            code
        } = req.params,
        authorization = req.headers.authorization || req.signedCookies.Authorization

        if (!req.password) return res.status(401).json(ApiError.unauthorized)
    
        let decoded = require('../../middlewares/jwt')(authorization, req.password)

        if (!decoded.ID) return res.status(401).json(ApiError.unauthorized)
        if (isNaN(code)) return res.status(400).json(new ApiError(400, 'the value is not int'))



        let server = await guilds.findById(code)
        if (!server) return res.status(404).json(ApiError.notfound)
        if (!await server.members.find(a => a.user.id === decoded.ID)) return res.status(403).json(ApiError.forbidden)

        if (server.owner.id === decoded.ID) {
            await invites.deleteMany({
                'guild.id': code
            })

            await channels.deleteMany({
                guild_id: code
            })

            await roles.deleteMany({
                guild: code
            })

            var arr = []

            server.members.forEach(a => {
                arr.push(a.user.id)
            })

            arr.forEach(async a => {
                console.log(a)
                await users.findByIdAndUpdate(a, {
                    $pull: {
                        guilds: Number(code)
                    }
                })
            })

            server.remove()
            return res.status(200).json({
                code: 200,
                message: 'deleted'
            })
        } else {
            guilds.findByIdAndUpdate(code, {
                $pull: {
                    "members": {
                        "user.id": decoded.ID
                    }
                }
            }, (e, d) => {
                if (e) return console.log(e)
                console.log(d)
            })
            await users.findByIdAndUpdate(decoded.ID, {
                $pull: {
                    guilds: Number(code)
                }
            })
            return res.status(200).json({
                code: 200,
                message: 'leaved'
            })
        }

    })
}