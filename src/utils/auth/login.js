const jwt = require('jsonwebtoken'),
ApiError = require('../../helpers/ApiError'),
user = require('../../models/user.model'),
crypt = require('../../function/crypto'),
bcrypt = require('bcrypt'),
key = process.env.SECRET || require('../../../c.json').SECRET

module.exports = app => {
  app.post('/login', (req, res) => {
    if(!JSON.stringify(req.body)) return res.status(405).json(ApiError.badrequest)
    const { email, password } = req.body

    if (!email) return res.status(404).json(new ApiError(404, 'Missing email!'))
    if (!password) return res.status(404).json(new ApiError(404, 'Missing password!'))

    if (!email.includes('@')) return res.status(400).json(ApiError.badrequest)


    user.find({}, (err, doc) => {
      if (err) return res.status(503).json(ApiError.error)

      const checkemail = doc.find(a => {
        if(!a.email) return
        if (crypt.decrypt({iv: a.email.iv,content: a.email.content}, key) === email) return {
            status: true,
            iv: a.email.iv,
            content: a.email.content
          }
      })
      if(!checkemail) return res.status(404).json(new ApiError(404, "Invalid email"))

      user.findOne({
        "email.iv": checkemail.email.iv
      }).exec((e, d) => {
        if (e) return res.status(503).json(ApiError.error)
        if(!d) return res.status(500).json(ApiError.error)
        
        bcrypt.compare(password, d.password, (e, r) => {
          if(e) return res.status(500).json(ApiError.error)
          if (r) {
            let token = jwt.sign({
              ID: d._id
            }, d.password, {
              expiresIn: '24h'
            })

            res.status(203).json({
              token: token
            })

          } else return res.status(403).json(new ApiError(403, "Invalid password"))
        })
      })
    })
  })
}