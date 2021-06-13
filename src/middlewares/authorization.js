const ApiError = require('../helpers/ApiError'),
    user = require("../models/user.model")

module.exports = function Authorized(req, res, next) {
    var token = req.headers.authorization || req.signedCookies.Authorization

    if (!token) return res.status(401).json(ApiError.unauthorized)

    token = token.split(".")
    if (!token[1]) return res.status(401).json(ApiError.unauthorized)

    try {
        JSON.parse(Buffer.from(token[1], "base64").toString("ascii"))
    } catch (e) {
        return res.status(401).json(ApiError.unauthorized)

    }

    let ID = JSON.parse(Buffer.from(token[1], "base64").toString("ascii")).ID

    if (!ID) return res.status(401).json(ApiError.unauthorized)

    user.findById(ID, (e, doc) => {
        if (e) return res.status(500).json(ApiError.error), console.error(e)
        if (!doc) return res.status(401).json(ApiError.unauthorized)
        if(!doc.password || doc.password == null) return res.status(401).json(ApiError.unauthorized)
        req.password = doc.password
        next()
    })
}