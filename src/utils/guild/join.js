const ApiError = require("../../helpers/ApiError")
const Authorized = require("../../middlewares/authorization"),
CheckAuth = require("../../middlewares/jwt"),
guildSchema = require("../../models/guild.model"),
userSchema = require("../../models/user.model"),
channelSchema = require("../../models/channel.model")

module.exports = (app) => {
    app.post("/guild/join/:code", Authorized, (req, res) => {
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
                    console.log("caca")
                    res.send(500).send(ApiError.error)
                    throw err
                }else {
                    if(data) {
                        if(req.params.code) {
                            guildSchema.find({invitations: [req.params.code]}, (e, d) => {
                                if(e) {
                                    console.log("caca")
                                    res.send(ApiError.error).status(500)
                                } else {
                                    if(d) {
                                        if(data.guilds.includes(d._id)) {
                                            res.send(new ApiError(409, "You are already in the guild !")).status(409)
                                        } else {
                                            guildSchema.findByIdAndUpdate(d._id, {$push: {members: {
                                                id: data._id,
                                                createdAt: data.CreatedAt,
                                                joinedAt: Date.now(),
                                                permissions: ["*"],
                                                nickname: ""
                                            }}}, (err, doc) => {

                             
                                                        userSchema.findByIdAndUpdate(data._id, (error, result) => {
                                                            if(error) {
                                                                console.log("cagca")
                                                                res.send(ApiError.error).status(500)
                                                            } else {
                                             
                                                                    res.send(result).status(200)
                 
                                                            }
                                                        })

                                                
                                            })
                                        }
                                    } else {
                                        res.send(ApiError.notfound).status(404)
                                    }
                                }
                            })
                        } else {
                            res.send(ApiError.badrequest).status(400)
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