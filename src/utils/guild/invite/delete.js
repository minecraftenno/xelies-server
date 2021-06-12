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
    app.delete('/invite/:code', auth, async (req, res) => {

        if (!req.params) return res.status(400).json(ApiError.badrequest)
        if (!req.password) return res.status(401).json(ApiError.unauthorized)
        const {code} = req.params,
        decoded = CheckAuth(req.headers.authorization, req.password)
        
        if (!decoded.ID) return res.status(401).json(ApiError.unauthorized)

        i = await invite.findOne({
            code: code
        })

        if (!i) return res.status(404).json(ApiError.notfound)

        server = await guilds.findById(i.guild.id)

        if (!server) return res.status(403).json(ApiError.forbidden)

        let member = await server.members.find(a => a.user.id === decoded.ID)

        if (!member) return res.status(403).json(ApiError.forbidden)

        role = await roles.find({
            '_id': {
                $in: member.roles
            }
        })



        let a = []
        role.forEach(b=> {
            b.permissions.forEach(c=> {
                a.push(String(c))
            })
        })

        if (!a.includes('ADMINISTRATOR') && !a.includes('MANAGE_INVITE')) return res.status(401).json(ApiError.unauthorized)

        i.remove()

        return res.status(204).json()

    })
}
