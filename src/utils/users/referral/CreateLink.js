const ApiError = require('../../../helpers/ApiError'),
    users = require('../../../models/user.model'),
    auth = require("../../../middlewares/authorization"),
    gen = require('../../../function/genID')

module.exports = (app) => {
    app.post("/referral", auth, async (req, res) => {

        if (req.password) {
            authorization = req.headers.authorization || req.signedCookies.Authorization
            let decoded = require('../../../middlewares/jwt')(authorization, req.password)
    
            if (!decoded.ID) return res.status(401).json(ApiError.unauthorized)

            let user = await users.findById(decoded.ID)
            if(!user) return res.status(401).json(ApiError.unauthorized)

            const code = gen(7)

            user.referral.code = code
            user.save()

            return res.status(201).json({ code: 201, api_link: req.protocol + '://' + req.get('host') + '/referral/' + code, string: code })

        }
    })
}