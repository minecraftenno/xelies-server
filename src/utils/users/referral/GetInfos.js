const ApiError = require('../../../helpers/ApiError'),
    users = require('../../../models/user.model')

module.exports = (app) => {
    app.get("/referral/:code", async (req, res) => {
        const { code } = req.params,
        token = req.headers.authorization || req.signedCookies.Authorization,
        user = await users.findOne({ 'referral.code': code })

        if (!user) return res.status(404).json(ApiError.notfound)

        //check token
        if (!token) return res.status(200).json({
            code: 200,
            api_link: req.protocol + '://' + req.get('host') + '/referral/' + code,
            string: code,
            inviter: {
                username: user.username,
                tag: user.tag,
                id: user._id,
                avatar: user.avatar,
                createdAt: user.CreatedAt
            },
        })
        if (!token.split(".")[1]) return res.status(401).json(ApiError.unauthorized)
        if (!JSON.parse(Buffer.from(token.split(".")[1], "base64").toString("ascii"))) return res.status(401).json(ApiError.unauthorized)

        let ID = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString("ascii")).ID

        if (!ID) return res.status(401).json(ApiError.unauthorized)

        let client = await users.findById(ID)
        if (!client) return res.status(401).json(ApiError.unauthorized)
        if (!client.password || client.password == null) return res.status(401).json(ApiError.unauthorized)

        if(!require('../../../middlewares/jwt')(token, client.password).ID) return res.status(401).json(ApiError.unauthorized)

        return res.status(200).json({
            code: 200,
            api_link: req.protocol + '://' + req.get('host') + '/referral/' + code,
            string: code,
            inviter: {
                username: user.username,
                tag: user.tag,
                id: user._id,
                avatar: user.avatar,
                createdAt: user.CreatedAt
            },
            members: user.referral.members,
            members_count: user.referral.members.length || 0
        })
    })
}