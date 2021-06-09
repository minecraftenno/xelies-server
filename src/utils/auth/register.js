const jwt = require('jsonwebtoken'),
    ApiError = require('../../helpers/ApiError'),
    user = require('../../models/user.model'),
    crypt = require('../../crypto/crypto'),
    bcrypt = require('bcrypt'),
    key = process.env.SECRET || require('../../../c.json').SECRET;

module.exports = (app) => {

    app.post('/register', (req, res, next) => {
        if (!req.body) return res.status(400).json(ApiError.badrequest)
        const {
            username,
            email,
            password
        } = req.body

        //check
        if (!username) {
            return res.status(400).json(new ApiError(400, 'No username field found.'))
        } else if (!email) {
            return res.status(400).json(new ApiError(400, 'No email field found.'))
        } else if (!password) {
            return res.status(400).json(new ApiError(400, 'No password field found.'))
        } else if (password.length < 6) {
            return res.status(400).json(new ApiError(400, 'The password given is too short.'))
        }

        var h = crypt.encrypt(email, key)

        //findAll
        user.find({}).exec((err, doc) => {
            if (err) throw err

            const checkemail = doc.find(a => {
                if (crypt.decrypt({
                  iv: a.email.iv,
                  content: a.email.content
              }, key) === email) return true
              
            })
            if (checkemail) return res.status(503).json({
                code: 503,
                message: 'The email is already used'
            })
            user_id = Date.now() + 5000000000000 * 9000
            bcrypt.genSalt(12, (e, r) => {
                if (e) throw e
                bcrypt.hash(password, r, (e, p) => {
                    if (e) throw e

                    new user({
                        _id: user_id,
                        username: username,
                        email: {
                            iv: h.iv,
                            content: h.content
                        },
                        password: p
                    }).save((e, r) => {
                        if (e) return res.status(503)
                   //     console.log(r)
                    })
                    let token = jwt.sign({
                        ID: user_id
                    }, p, {
                        expiresIn: '24h'
                    })
                    res.status(203).json({
                        token: token
                    })
                })
            })
        })
    })
}