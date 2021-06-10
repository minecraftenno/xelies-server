const ApiError = require('../../../helpers/ApiError'),
    user = require('../../../models/user.model'),
    friend = require('../../../models/friend.model'),
    check = require('../../../middlewares/jwt'),
    auth = require('../../../middlewares/authorization')

module.exports = app => {

    app.post('/@me/relationship/:to', auth, (req, res) => {
        const {
            authorization
        } = req.headers, {
            to
        } = req.params
        if (!req.password) return res.status(401).json(ApiError.unauthorized)

        let decoded = check(authorization, req.password)

        if (!decoded.ID) return res.status(401).json(ApiError.unauthorized)
        if (isNaN(to)) return res.status(403).json(new ApiError(403, 'the value is not int'))
        if (decoded.ID === Number(to)) return res.status(403).json(new ApiError(403, 'You cannot add yourself as a friend'))

        user.findById(to, (e, d) => {
            if (e) return res.status(500).json(ApiError.error), console.log(e)
            if (!d) return res.status(403).json(ApiError.forbidden)
            console.log(d)

            if (d.bot) return res.status(401).json(ApiError.unauthorized)

        })


        friend.findOne({
            by: decoded.ID,
            to: Number(to)
        }, (e, d) => {
            if (e) return res.status(500).json(ApiError.error), console.log(e)

            if (d && d.status == 1) return res.status(403).json(new ApiError(403, 'You are already friends.'))
            if (d && d.status == 0) return res.status(403).json(new ApiError(403, 'Request already sent.'))
        })

        new friend({
            by: decoded.ID,
            to: to,
            status: 0,
            CreatedAt: Date.now()
        }).save(e => {
            if (e) return res.status(500).json(ApiError.error), console.log(e)
        })

        return res.status(204).json()
    })

}