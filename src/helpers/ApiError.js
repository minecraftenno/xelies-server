module.exports = class ApiError {
     /**
     * @constructs ApiError
     * @param {number} code status code
     * @param {string} msg error message
     */
    constructor (code, msg) {
        this.code = code
        this.message = msg
    }
    static badrequest() {
        return new ApiError(400, 'Bad request')
    }
    static unauthorized() {
        return new ApiError(401, 'Unauthorized')
    }
    static forbidden() {
        return new ApiError(403, 'Forbidden')
    }
    static nocontent() {
        return new ApiError(203, 'No Content')
    }
    static notfound() {
        return new ApiError(404, 'Not found')
    }
}