const ApiError = require('../../../helpers/ApiError'),
  user = require('../../../models/user.model'),
  auth = require("../../../middlewares/authorization"),
  CheckAuth = require("../../../middlewares/jwt")

module.exports = app => {
  app.delete("/users/@me", auth, (req, res) => {
    if (req.password) {
      const authorization = req.headers.authorization || req.signedCookies.Authorization

      if (!req.password) return res.status(401).json(ApiError.unauthorized)
  
      let decoded = require('../../../middlewares/jwt')(authorization, req.password)

      if (!decoded.ID) return res.status(401).json(ApiError.unauthorized)
      user.findById(decoded.ID, (e, doc) => {
        if (e) return res.status(500).json(ApiError.error)
        if (!doc) return res.status(500).json(ApiError.error)

        user.findByIdAndUpdate(decoded.ID, {
          email: null,
          username: "Deleted User",
          tag: null,
          avatar: null,
          notifications: null,
          password: null
        }, (e, r) => {
          console.log(r)
          if (e) return res.status(500).json(ApiError.error), console.log(e)
        })
      })
      return res.status(204).json()
    }
  })
}