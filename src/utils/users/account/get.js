const ApiError = require('../../../helpers/ApiError'),
    userm = require('../../../models/user.model'),
    Authorized = require("../../../middlewares/authorization"),
    CheckAuth = require("../../../middlewares/jwt"),
    {
        decrypt
    } = require("../../../function/crypto")

module.exports = (app) => {
    app.get("/users/@me", Authorized, (req, res) => {

        if (req.password) {
            authorization = req.headers.authorization || req.signedCookies.Authorization
            let decoded = require('../../../middlewares/jwt')(authorization, req.password)
    
            if (!decoded.ID) return res.status(401).json(ApiError.unauthorized)

            userm.findById(decoded.ID, (e, doc) => {
                if (e) return res.status(503).send(ApiError.error)
                if (!doc) return res.status(401).send(ApiError.unauthorized)
                const email = decrypt({
                    content: doc.email.content,
                    iv: doc.email.iv
                }, process.env.SECRET || require('../../../../c.json').SECRET)
                return res.status(200).json({
                    code: 200,
                    user: {
                        id: String(doc._id),
                        username: doc.username,
                        tag: doc.tag,
                        email: email,
                        friends: doc.friends,
                        notifications: doc.notifications,
                        guilds: doc.guilds,
                        CreatedAt: doc.CreatedAt
                    }
                })
            })
        }
    })
}