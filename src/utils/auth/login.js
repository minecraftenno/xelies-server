const jwt = require('jsonwebtoken'),
ApiResponse = require('../../helpers/ApiResponse'),
user = require('../../models/user.model'),
crypt = require('../../crypto/crypto'),
bcrypt = require('bcrypt'),
key = process.env.SECRET || require('../../../c.json').SECRET

module.exports = (app) => {
  app.post('/login', (req, res) => {
    const {
      email,
      password
    } = req.body

    if (!email || !password) return res.status(503).json(ApiResponse.badrequest)
    if (!email.includes('@')) return res.status(503).json(ApiResponse.badrequest)
    user.find({}, (err, doc) => {
      if (err) return res.status(503).json(ApiResponse.error)

      const checkemail = doc.find(a => {
        if (crypt.decrypt({
          iv: a.email.iv,
          content: a.email.content
        }, key) === email) {
          return {
            status: true,
            iv: a.email.iv,
            content: a.email.content
          }
        } else return { status: false }
      })
      console.log(checkemail)
      if(checkemail.status == false) return res.status(403).json(ApiResponse(403, "Invalid email"))

      user.findOne({
        'email.iv': checkemail.iv
      }).exec((e, d) => {
        if (e) return res.status(503).json(ApiResponse.error), console.error(e)
        console.log(d)
        if(!d) return res.status(403).json(new ApiResponse(403, "Invalid email"))
        
        bcrypt.compare(password, d.password, (err, result) => {
          if (result) {

            let token = jwt.sign({
              ID: doc._id
            }, doc.password, {
              expiresIn: '24h'
            })

            res.status(203).json({
              token: token
            })

          } else return res.status(403).json(new ApiResponse(403, "Invalid password."))
        })
      })
    })
  })
}
