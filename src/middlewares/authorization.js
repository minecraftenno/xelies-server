const ApiError = require('../helpers/ApiError'),
    users = require("../models/user.model")

module.exports = async function Authorized(req, res, next) {
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

    let user = await users.findById(ID)
    if (!user) return res.status(401).json(ApiError.unauthorized)
    if (!user.password || user.password == null) return res.status(401).json(ApiError.unauthorized)
    req.password = user.password
    next()
}