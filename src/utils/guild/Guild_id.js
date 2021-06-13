const ApiError = require('../../helpers/ApiError'),
    auth = require('../../middlewares/authorization'),
    guilds = require('../../models/guild.model')

module.exports = (app) => {
    app.get('/guild/:code', auth, async (req, res) => {

        if (!req.params) return res.status(400).json(ApiError.badrequest)
        if (!req.password) return res.status(401).json(ApiError.unauthorized)
        const {
            code
        } = req.params,
        authorization = req.headers.authorization || req.signedCookies.Authorization


    
        let decoded = require('../../middlewares/jwt')(authorization, req.password)

        if (!decoded.ID) return res.status(401).json(ApiError.unauthorized)
        if (isNaN(code)) return res.status(400).json(new ApiError(400, 'the value is not int'))



        let server = await guilds.findById(code)
        if (!server) return res.status(404).json(ApiError.notfound)
        if (!await server.members.find(a => a.user.id === decoded.ID)) return res.status(403).json(ApiError.forbidden)


        return res.status(200).json(server)

    })
}