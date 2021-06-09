const jwt = require('jsonwebtoken'),
ApiError = require('../../helpers/ApiError'),
user = require('../../models/guild.model'),
crypt = require('../../crypto/crypto'),
bcrypt = require('bcrypt'),
key = process.env.SECRET || require('../../../c.json').SECRET;

module.exports = (app) => {
  app.post('/login', (req, res) => {
    const {
      email,
      password
    } = req.body;

    if (!email || !password) return res.status(400).json(ApiError.badrequest);
    if (!email.includes('@')) return res.status(400).json(ApiError.badrequest);
    user.find({}, (err, doc) => {
      if (err) return res.status(503).json(ApiError.error)

      const checkemail = doc.find(a => {
        if (crypt.decrypt({
          iv: a.email.iv,
          content: a.email.content
        }, key) === email) return {
            status: true,
            iv: a.email.iv,
            content: a.email.content
          }
      });
      if(!checkemail) {
        return res.status(403).json(new ApiError(403, "Invalid email"));
      } else {
        console.log(checkmail)
      }

      user.findOne({
        "email.iv": checkemail.iv
      }).exec((e, d) => {
        if (e) return res.status(503).json(ApiError.error), console.error(e)
        console.log("doc: ", d)
        if(!d) return res.status(403).json(new ApiError(403, "Invalid email"));
        
        bcrypt.compare(password, d.password, (err, result) => {
          if (result == true) {

            let token = jwt.sign({
              ID: doc._id
            }, doc.password, {
              expiresIn: '24h'
            });

            res.status(203).json({
              token: token
            });

          } else return res.status(403).json(new ApiError(403, "Invalid password."))
        });
      });
    });
  })
}
