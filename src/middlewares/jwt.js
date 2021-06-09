const ApiError = require('../helpers/ApiError'),
    jwt = require('jsonwebtoken')

module.exports = function (auth, secret) {

    try {
        return jwt.verify(auth, secret)
    } catch(e) {
        return ApiError.error;
    }

}