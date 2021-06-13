const ApiError = require('../../../helpers/ApiError'),
    users = require('../../../models/user.model'),
    auth = require("../../../middlewares/authorization"),
    {
        decrypt
    } = require("../../../function/crypto")

module.exports = (app) => {
    app.get("/users/@me", auth, async (req, res) => {

        if (req.password) {
            authorization = req.headers.authorization || req.signedCookies.Authorization
            let decoded = require('../../../middlewares/jwt')(authorization, req.password)

            if (!decoded.ID) return res.status(401).json(ApiError.unauthorized)

            let doc = await users.findById(decoded.ID)
            console.log(doc)
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
        }
    })
}