module.exports = class ApiError {
    /**
     * @constructs ApiError
     * @param {number} code status code
     * @param {string} msg error message
     */
    constructor(code, msg) {
        this.code = code
        this.message = msg
    }
    static get badrequest() {
        return new ApiError(400, 'Bad request')
    }
    static get unauthorized() {
        return new ApiError(401, 'Unauthorized')
    }
    static get forbidden() {
        return new ApiError(403, 'Forbidden')
    }
    static get nocontent() {
        return new ApiError(203, 'No Content')
    }
    static get methodnotallowed() {
        return new ApiError(405, 'Method Not Allowed')
    }
    static get accepted() {
        return new ApiError(202, 'Accepted')
    }
    static get notfound() {
        return new ApiError(404, 'Not found')
    }
    static get error() {
        return new ApiError(503, 'Internal server error')
    }
    other() {
        return {
            code: this.code,
            message: this.message
        }
    }
}