const ApiError = require('../../../helpers/ApiError'),
    auth = require('../../../middlewares/authorization'),
    CheckAuth = require('../../../middlewares/jwt'),
    invite = require('../../../models/invite.model')

module.exports = (app) => {
    app.get('/invite/:code', auth, async (req, res) => {

        if (!req.params) return res.status(400).json(ApiError.badrequest)

        const { code } = req.params,
        authorization = req.headers.authorization || req.signedCookies.Authorization
        let decoded = require('../../../middlewares/jwt')(authorization, req.password)

        if (!decoded.ID) return res.status(401).json(ApiError.unauthorized)

        let i = await invite.findOne({ code: code })

        if (!i) return res.status(404).json(ApiError.notfound)

        
        if(Date.parse(i.expired) < Date.now()) {
            i.remove()
            return res.status(404).json(ApiError.notfound)
        }

        return res.status(200).json(i)

    })
}