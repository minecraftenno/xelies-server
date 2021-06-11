const ApiError = require('../../../helpers/ApiError'),
    user = require('../../../models/user.model'),
    friend = require('../../../models/friend.model'),
    auth = require('../../../middlewares/authorization')

module.exports = app => {

    app.post('/@me/relationship/:to', auth, (req, res) => {
        const {
            authorization
        } = req.headers, {
            to
        } = req.params
        if (!req.password) return res.status(401).json(ApiError.unauthorized)

        let decoded = require('../../../middlewares/jwt')(authorization, req.password)

        if (!decoded.ID) return res.status(401).json(ApiError.unauthorized)
        if (isNaN(to)) return res.status(403).json(new ApiError(403, 'the value is not int'))
        if (decoded.ID === Number(to)) return res.status(403).json(new ApiError(403, 'You cannot add yourself as a friend'))

        user.findById(to, async (e, d) => {
            if (e) return res.status(500).json(ApiError.error), console.error(e)
            if (!d) return res.status(403).json(ApiError.forbidden)
            if (d.bot) return res.status(401).json(ApiError.unauthorized)
            if (await d.friends.includes(decoded.ID)) return res.status(403).json(new ApiError(403, 'You are already friends.'))

            const check = await friend.findOne({
                by: decoded.ID,
                to: Number(to)
            }),
            reverse = await friend.findOne({
                by: Number(to),
                to: decoded.ID
            })
            
            if (check) return res.status(403).json(new ApiError(403, 'Request already sent.'))
            
            if (!check && !reverse) {
                new friend({
                    by: decoded.ID,
                    to: to,
                    CreatedAt: Date.now()
                }).save(e => {
                    if (e) return res.status(500).json(ApiError.error), console.error(e)
                })
    
                return res.status(204).json()
            }
    
            if (reverse.to === decoded.ID) {
                reverse.remove()
    
                user.findByIdAndUpdate(decoded.ID, { $push: { friends: Number(to) }}, e=>{
                    if(e) return res.status(500).json(ApiError.error), console.error(e)
                })
                user.findByIdAndUpdate(Number(to), { $push: { friends: decoded.ID }}, e=>{
                    if(e) return res.status(500).json(ApiError.error), console.error(e)
                })
                return res.status(204).json()
            }

        })

    })

}