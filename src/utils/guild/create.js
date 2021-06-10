const ApiError = require("../../helpers/ApiError")
const Authorized = require("../../middlewares/authorization"),
CheckAuth = require("../../middlewares/jwt"),
guildSchema = require("../../models/guild.model"),
userSchema = require("../../models/user.model"),
channelSchema = require("../../models/channel.model")

module.exports = (app) => {
    app.post("/guild/create", Authorized, (req, res) => {
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
                    res.send(503).send(ApiError.error)
                    throw err
                }else {

                    if(data) {
                        guildSchema.countDocuments((err2, count) => {
                  
                            if(err2) {
                     
                                res.send(503).send(ApiError.error)
                            } else {

                                channelSchema.countDocuments((err3, id) => {

                                    //TODO TEMPLATES
                                    const channel = {
                                        _id: id++,
                                        name: "general",
                                        guild: count++,
                                        author: data._id,
                                        type: 0,
                                        permissions: 0,
                                        position: 0
                                    }

                                     new channelSchema(channel).save((err4, doc) => {
                                         if(err4) return res.send(ApiError.error).status(500)
                                        const guild = {
                                            _id: count + 1,
                                            name: "Server of " + data.username,
                                            members: [{
                                                id: data._id,
                                                createdAt: data.CreatedAt,
                                                joinedAt: Date.now(),
                                                permissions: ["*"],
                                                nickname: ""
                                            }],
                                            channels: [doc._id]
                                        }
        
                                        new guildSchema(guild).save((e, r) => {
        
                                            if (e != null) {
                                                return res.status(500).send(ApiError.error)
                                            } else {
                                                userSchema.findByIdAndUpdate(decoded.ID, { $push: { guilds: r._id} }, (err, data) => {
                                                    if(err) {
                                                        return res.status(500).send(ApiError.error)
                                                    } else {
                                                        return res.status(200).send(r)
                                                    }
                                                })
                                              // 
                                            }
                                        })
                                     })

                                })

                                
                            }                            
                        })
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