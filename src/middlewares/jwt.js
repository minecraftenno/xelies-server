const ApiError = require('../helpers/ApiError'),
    jwt = require('jsonwebtoken')

module.exports = function CheckAuth(auth, secret) {

    jwt.verify(auth, secret, (e, d) => {
        if (e) return ApiError.unauthorized
        return { decoded: d }
    })

}