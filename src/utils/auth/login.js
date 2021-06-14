const jwt = require('jsonwebtoken'),
  ApiError = require('../../helpers/ApiError'),
  user = require('../../models/user.model'),
  crypt = require('../../function/crypto'),
  bcrypt = require('bcrypt'),
  key = process.env.SECRET || require('../../../c.json').SECRET

/*
 ___               ___ 
|  _|             |_  |
| |     __ _ ___    | |
| |    / _` / __|   | |
| |   | (_| \__ \   | |
| |_   \__,_|___/  _| |
|___|             |___|
                       
*/

module.exports = app => {
  app.post('/login', async (req, res) => {
    if (!JSON.stringify(req.body)) return res.status(400).json(ApiError.badrequest)
    const { email, password } = req.body

    if (!email) return res.status(404).json(new ApiError(404, 'Missing email!'))
    if (!password) return res.status(404).json(new ApiError(404, 'Missing password!'))

    if (!email.includes('@')) return res.status(400).json(ApiError.badrequest)

    let users = await user.find({})

    const checkemail = users.find(a => {
      if (!a.email) return
      if (crypt.decrypt({
          iv: a.email.iv,
          content: a.email.content
        }, key) === email) return {
        status: true,
        iv: a.email.iv,
        content: a.email.content
      }
    })
    if (!checkemail) return res.status(403).json(new ApiError(403, "Invalid email"))

    let client = await user.findOne({
      "email.iv": checkemail.email.iv
    })
    if (!client) return res.status(500).json(ApiError.error)

    bcrypt.compare(password, client.password, (e, r) => {
      if (e) return res.status(500).json(ApiError.error)
      if (r) {

        let token = jwt.sign({
          ID: client._id
        }, client.password, {
          expiresIn: '24h'
        })

        res.cookie("Authorization", token, {
          maxAge: 86400000,
          httpOnly: true,
          signed: true
        })
        
        return res.status(200).json({
          token: token
        })

      } else return res.status(403).json(new ApiError(403, "Invalid password"))
    })
  })
}
