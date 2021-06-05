module.exports = class ApiResponse {
    /**
     * @constructs ApiResponse
     * @param {number} code status code
     * @param {string} msg error message
     */
    constructor(code, msg) {
        this.code = code
        this.message = msg
    }
    static get badrequest() {
        return new ApiResponse(400, 'Bad request')
    }
    static get unauthorized() {
        return new ApiResponse(401, 'Unauthorized')
    }
    static get forbidden() {
        return new ApiResponse(403, 'Forbidden')
    }
    static get nocontent() {
        return new ApiResponse(203, 'No Content')
    }
    static get methodnotallowed() {
        return new ApiResponse(405, 'Method Not Allowed')
    }
    static get accepted() {
        return new ApiResponse(202, 'Accepted')
    }
    static get notfound() {
        return new ApiResponse(404, 'Not found')
    }
    static get error() {
        return new ApiResponse(503, 'Internal server error')
    }
    other() {
        return {
            code: this.code,
            message: this.message
        }
    }
}