const ApiResponse = require('../helpers/ApiResponse'),
    jwt = require('jsonwebtoken')

module.exports = function (auth, secret) {

    try {
        return jwt.verify(auth, secret)
    } catch(e) {
        return ApiResponse.error;
    }

}