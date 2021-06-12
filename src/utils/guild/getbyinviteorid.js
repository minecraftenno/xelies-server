const ApiError = require("../../helpers/ApiError")
const Authorized = require("../../middlewares/authorization"),
CheckAuth = require("../../middlewares/jwt"),
guildSchema = require("../../models/guild.model"),
userSchema = require("../../models/user.model"),
channelSchema = require("../../models/channel.model")

module.exports = (app) => {
    app.get("/invite/:code", Authorized, (req, res) => {
        if(req.password) {
            try {
                CheckAuth(req.headers.authorization, req.password)
            } catch(e) {
                return res.status(401).send(ApiError.unauthorized)
            }
            let decoded = CheckAuth(req.headers.authorization, req.password)
         
            if(decoded == ApiError.error) return res.status(401).send(decoded)
            decoded = JSON.parse(JSON.stringify(decoded))

            
            
            //CODE
            userSchema.findById(decoded.ID, (err, data) => {
                if(err) {
                    res.send(500).send(ApiError.error)
                    throw err
                }else {
                    if(data) {
                        if(req.params.code) {
                            guildSchema.find({invitations: [req.params.code]}, (e, d) => {
                                if(e) {
                                    res.send(ApiError.error).status(500)
                                } else {
                                    if(d.length != 0) {
                                        const guild = d[0]
                                        res.json({
                                            name: guild.name,
                                            id: guild._id,
                                            channels: guild.channels,
                                            members: guild.members,
                                        })
                                    } else {
                                        guildSchema.findById(req.params.code, (err, guild) => {
                                            if(err) {
                                                res.send(ApiError.error).status(500)
                                            } else {
                                                if(guild) {
                                                    res.json({
                                                        name: guild.name,
                                                        id: guild._id,
                                                        channels: guild.channels,
                                                        members: guild.members,
                                                    })
                                                } else {
                                                    res.send(ApiError.notfound).status(404)
                                                }
                                            }
                                        })
                                    }
                                }
                            })
                        } else {
                            return res.status(400).send(ApiError.badrequest)
                        }
                    } else {
                        res.send(401).send(ApiError.unauthorized)
                    }
                }
            })
        } else {
            return res.status(401).send(ApiError.unauthorized)
        }
    })
}