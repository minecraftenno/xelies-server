const ApiError = require('../../../helpers/ApiError'),
user = require('../../../models/user.model'),
friend = require('../../../models/friend.model'),
check = require('../../../middlewares/jwt'),
auth = require('../../../middlewares/authorization')

module.exports = app => {

    app.post('/@me/relationship/:to', auth, (req, res)=> {
        const { authorization } = req.headers,
        { to } = req.params
        if(!req.password) return res.status(401).json(ApiError.unauthorized)
        
        let decoded = check(authorization, req.password)

        if(!decoded.ID) return res.status(401).json(ApiError.unauthorized)
        //je finis demain

    })

}