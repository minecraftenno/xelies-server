const ApiError = require('../../../helpers/ApiError'),
    user = require('../../../models/user.model'),
    friend = require('../../../models/friend.model'),
    auth = require('../../../middlewares/authorization')

module.exports = app => {

    app.delete('/@me/relationship/:to', auth, (req, res) => {
        const {
            authorization
        } = req.headers, {
            to
        } = req.params
        if (!req.password) return res.status(401).json(ApiError.unauthorized)

        let decoded = require('../../../middlewares/jwt')(authorization, req.password)

        if (!decoded.ID) return res.status(401).json(ApiError.unauthorized)
        if (isNaN(to)) return res.status(403).json(new ApiError(403, 'the value is not int'))
        if (decoded.ID === Number(to)) return res.status(403).json(new ApiError(403, 'are you serious ?'))

        user.findById(to, async (e, d) => {
            if (e) return res.status(500).json(ApiError.error), console.log(e)
            if (!d) return res.status(403).json(ApiError.forbidden)
            if (d.bot) return res.status(401).json(ApiError.unauthorized)

            const c = await friend.findOne({ by: Number(to), to: decoded.ID })
            if(c) return c.remove(), res.status(204).json()

            if (await !d.friends.includes(decoded.ID)) return res.status(403).json(new ApiError(403, 'You cannot delete a non-existent friend'))

            let end = function() {
                user.findByIdAndUpdate(decoded.ID, { $pull: { friends: Number(to) }}, (e, d)=> {
                    if(e) return res.status(500).json(ApiError.error), console.error(e)
                    if(!d) return res.status(403).json(ApiError.forbidden)
                })
                user.findByIdAndUpdate(to, { $pull: { friends: decoded.ID }}, (e, d)=> {
                    if(e) return res.status(500).json(ApiError.error), console.error(e)
                    if(!d) return res.status(403).json(ApiError.forbidden)
                })
                return true
            }
            
            if(end()) return res.status(204).json()

        })
    })

}