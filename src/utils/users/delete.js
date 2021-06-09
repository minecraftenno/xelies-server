const jwt = require('jsonwebtoken'),
ApiError = require('../../helpers/ApiError'),
userm = require('../../models/user.model'),
auth = require("../../middlewares/authorization"),
CheckAuth = require("../../middlewares/jwt"),
{
  decrypt
} = require("../../crypto/crypto");
module.exports = app => {
  app.delete("/users/@me", auth, (req, res) => {
    if (req.password) {
      try {
        CheckAuth(req.headers.authorization, req.password)
      } catch (e) {
        return res.status(401).send(ApiError.unauthorized)
      }
      let decoded = CheckAuth(req.headers.authorization, req.password)
      if (decoded == ApiError.error) return res.status(503).send(decoded)
      decoded = JSON.parse(JSON.stringify(decoded))
      userm.findById(decoded.ID, (e, doc) => {
        if (e) return res.status(500).json(ApiError.error)
        if (!doc) return res.status(500).json(ApiError.error)

        userm.findByIdAndUpdate(decoded.ID, {
          id: doc._id,
          email: null,
          username: "Deleted User",
          tag: null,
          avatar: null,
          created_at: doc.CreatedAt,
          status: null,
          friends: null,
          notifications: null
        }, (e) => {
          if (e) return res.status(500).json(ApiError.error)
        })
        return res.status(204)
      })
    }
  })
}
