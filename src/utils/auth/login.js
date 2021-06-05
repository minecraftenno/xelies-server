const jwt = require('jsonwebtoken'),
    ApiResponse = require('../../helpers/ApiResponse'),
    user = require('../../models/user.model'),
    crypt = require('../../crypto/crypto'),
    bcrypt = require('bcrypt');

module.exports = (app) => {
    app.post('/login', (req, res) => {
        const {
            username,
            email,
            password
        } = req.body

        if(typeof username == "undefined" && typeof email == "undefined") {
            return res.status(503).json(ApiResponse.badrequest)
        }

        if(typeof username != "undefined") {
            user.findOne({username: username}, (err, doc) => {
                if(err) return res.status(503).json(ApiResponse.error)
                if(doc) {
                    bcrypt.compare(password, doc.password, (err, result) => {
                        if(result == true) {
                            let token = jwt.sign({
                                ID: doc._id
                            }, doc.password, {
                                expiresIn: '24h'
                            })
                            res.status(203).json({
                                token: token
                            })
                        } else {
                            return res.status(403).json(ApiResponse(403, "Invalid username or password."))
                        }
                    });
                } else {
                    return res.status(403).json(ApiResponse(403, "Invalid username or password."))
                }
            });
        } else if(typeof email != "undefined") {
            user.findOne({email: email}, (err, doc) => {
                if(err) return res.status(503).json(ApiResponse.error)
                if(doc) {
                    bcrypt.compare(password, doc.password, (err, result) => {
                        if(result == true) {
                           
                            let token = jwt.sign({
                                ID: doc._id
                            }, doc.password, {
                                expiresIn: '24h'
                            });
                            res.status(203).json({
                                token: token
                            });
                        } else {
                            return res.status(403).json(ApiResponse(403, "Invalid email or password."))
                        }
                    });
                } else {
                    return res.status(403).json(ApiResponse(403, "Invalid email or password."))
                }
            });
        } else {
            return res.status(400).json(ApiResponse.badrequest)
        }
    })
}