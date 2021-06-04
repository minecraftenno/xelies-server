const ApiError = require('../helpers/ApiError'),
jwt = require('jsonwebtoken')

module.exports = (req, res, next)=> {
    if(!req.headers.authorization) {
        return res.status(400).send(ApiError.badrequest)
    }
    try {
        req.user_id = jwt.verify(req.headers.authorization, process.env.SECRET || require('../../c.json').SECRET)
    } catch(e) {
        return res.status(401).send(ApiError.unauthorized)
    }
    next()
}
