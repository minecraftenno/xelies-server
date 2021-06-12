const ApiError = require('../../helpers/ApiError')
const Authorized = require("../../middlewares/authorization"),
    CheckAuth = require("../../middlewares/jwt"),
    guilds = require("../../models/guild.model"),
    user = require("../../models/user.model"),
    channel = require("../../models/channel.model")

module.exports = (app) => {
    app.post("/invite/:code", Authorized, async (req, res) => {
        if (!req.password) return res.status(401).json(ApiError.unauthorized)
        const decoded = CheckAuth(req.headers.authorization, req.password)
        if (!decoded.ID) return res.status(401).json(ApiError.unauthorized)

        const d = user.findById(decoded.ID)
        if (!d) return res.status(401).json(ApiError.unauthorized)
        if (!req.params.code) return res.status(403).json(ApiError.forbidden)

        let guild = guilds.findOne({
            invitations: [req.params.code]
        })
        if (!guild) return res.status(404).json(ApiError.notfound)

        if (d) {
            if (data.guilds.includes(d._id)) {
                res.json(new ApiError(409, "You are already in the guilds !")).status(409)
            } else {
                guilds.findByIdAndUpdate(d._id, {
                    $push: {
                        members: {
                            id: data._id,
                            createdAt: data.CreatedAt,
                            joinedAt: Date.now(),
                            permissions: ["*"],
                            nickname: ""
                        }
                    }
                }, (err, doc) => {


                    user.findByIdAndUpdate(data._id, (error, result) => {
                        if (error) {
                            console.log("cagca")
                            res.json(ApiError.error).status(500)
                        } else {

                            res.json(result).status(200)

                        }
                    })

                })
            }
        }
    })
}