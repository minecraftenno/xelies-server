const ApiError = require('../../../helpers/ApiError'),
    user = require('../../../models/user.model'),
    friend = require('../../../models/friend.model'),
    auth = require('../../../middlewares/authorization')

module.exports = app => {

    app.get('/@me/relationship/', auth, async (req, res) => {
        const {
            authorization
        } = req.headers
        if (!req.password) return res.status(401).json(ApiError.unauthorized)

        let decoded = require('../../../middlewares/jwt')(authorization, req.password)

        if (!decoded.ID) return res.status(401).json(ApiError.unauthorized)

        //let pending_for_user = await friend.find({
        //    to: decoded.ID
        //})

        /**
         *  return {
         *      id: d._id,
         *      username: d.username,
         *      tag: d.tag,
         *      avatar: d.avatar,
         *      CreatedAt: d.CreatedAt
         *  } 
         */

        return res.status(200).json({
            pending: {
                by_user: /*pending_by_user()*/ [],
                for_user: /*pending_for_user()*/ []
            }
        })
    })

}