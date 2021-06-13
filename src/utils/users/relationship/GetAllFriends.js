const ApiError = require('../../../helpers/ApiError'),
    user = require('../../../models/user.model'),
    friend = require('../../../models/friend.model'),
    auth = require('../../../middlewares/authorization')


module.exports = app => {

    app.get('/@me/relationship/', auth, async (req, res) => {
        const authorization = req.headers.authorization || req.signedCookies.Authorization

        if (!req.password) return res.status(401).json(ApiError.unauthorized)
    
        let decoded = require('../../../middlewares/jwt')(authorization, req.password)

        if (!decoded.ID) return res.status(401).json(ApiError.unauthorized)

        var pending_for_user = await friend.find({
                to: decoded.ID
            }),
            pending_by_user = await friend.find({
                by: decoded.ID
            }),
            arr_by = [],
            arr_for = [],
            arr = []

        pending_for_user.forEach(a => {
            if (a) return arr_for.push(Number(a.by))
        })
        pending_by_user.forEach(a => {
            arr_by.push(Number(a.to))
        })

        const _ = await user.find({
                '_id': {
                    $in: arr_by
                }
            }),
            __ = await user.find({
                '_id': {
                    $in: arr_for
                }
            })
        arr_by = [],
            arr_for = []

        _.forEach(a => {
            arr_by.push({
                id: a._id,
                username: a.username,
                tag: a.tag,
                avatar: a.avatar,
                CreatedAt: a.CreatedAt
            })
        })
        __.forEach(a => {
            arr_for.push({
                id: a._id,
                username: a.username,
                tag: a.tag,
                avatar: a.avatar,
                CreatedAt: a.CreatedAt
            })
        })
        let b = await user.findById(decoded.ID)
        ___ = await user.find({
            '_id': {
                $in: b.friends
            }
        })
        ___.forEach(a => {
            arr.push({
                id: a._id,
                username: a.username,
                tag: a.tag,
                avatar: a.avatar,
                CreatedAt: a.CreatedAt
            })
        })

        return res.status(200).json({
            pending: {
                by_user: arr_by,
                for_user: arr_for
            },
            friends: arr
        })
    })

}