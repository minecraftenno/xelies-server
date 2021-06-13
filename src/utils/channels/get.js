const ApiError = require('../../helpers/ApiError'),
    auth = require('../../middlewares/authorization'),
    CheckAuth = require('../../middlewares/jwt'),
    guilds = require('../../models/guild.model'),
    user = require("../../models/user.model"),
    channels = require("../../models/channel.model"),
    bcrypt = require("bcrypt")

module.exports = (app) => {
    app.get('/channels/:channelid', auth, async (req, res) => {

        if (!req.params) return res.status(400).json(ApiError.badrequest)
        if (!req.password) return res.status(401).json(ApiError.unauthorized)
        const {
            channelid
        } = req.params,
            {
                nsfw,
                password
            } = req.body,
            authorization = req.headers.authorization || req.signedCookies.Authorization
        let decoded = require('../../../middlewares/jwt')(authorization, req.password)
        if (!decoded.ID) return res.status(401).json(ApiError.unauthorized)

        user.findById(decoded.ID, (err, user) => {
            if (err) return res.send(ApiError.error).status(500);
            if (!user) return res.send(ApiError.unauthorized).status(401);

            channels.findById(channelid, (err, channel) => {
                if (err) return res.send(ApiError.error).status(500);
                if (!channel) return res.send(ApiError.badrequest).status(400);
                if (channel.nsfw) {
                    if (!nsfw || nsfw != true) return res.send(ApiError.forbidden).send(403);
                }
                if (channel.password != null) {
                    if (password == null) {
                        res.send(ApiError.unauthorized).status(401)
                    }
                    bcrypt.compare(password, channel.password, (err, result) => {
                        if (err) return res.send(ApiError.error).status(500);
                        if (result) {
                            res.json({
                                _id: channel._id,
                                name: channel.name,
                                description: channel.description,
                                author: channel.author,
                                type: channel.type,
                                permissions: channel.permissions,
                                position: channel.position,
                                CreatedAt: channel.CreatedAt,
                                messages: channel.messages
                            })
                        } else {
                            res.send(ApiError.unauthorized).status(401);
                        }
                    });
                } else {
                    res.json({
                        _id: channel._id,
                        name: channel.name,
                        description: channel.description,
                        author: channel.author,
                        type: channel.type,
                        permissions: channel.permissions,
                        position: channel.position,
                        CreatedAt: channel.CreatedAt,
                        messages: channel.messages
                    })
                }
            });
        });

        let server = await guilds.findById(code)
        if (!server) return res.status(404).json(ApiError.notfound)
        if (!await server.members.find(a => a.user.id === decoded.ID)) return res.status(403).json(ApiError.forbidden)


        return res.status(200).json(server)

    })
}
