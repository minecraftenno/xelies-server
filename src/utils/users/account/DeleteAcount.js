const ApiError = require('../../../helpers/ApiError'),
  users = require('../../../models/user.model'),
  auth = require("../../../middlewares/authorization")

module.exports = app => {
  app.delete("/users/@me", auth, async (req, res) => {
    if (req.password) {
      const authorization = req.headers.authorization || req.signedCookies.Authorization

      if (!req.password) return res.status(401).json(ApiError.unauthorized)

      let decoded = require('../../../middlewares/jwt')(authorization, req.password)

      if (!decoded.ID) return res.status(401).json(ApiError.unauthorized)
      let user = await users.findById(decoded.ID)
      if (!user) return res.status(401).json(ApiError.unauthorized)
      await users.findByIdAndUpdate(decoded.ID, {
        email: null,
        username: "Deleted User",
        tag: null,
        avatar: null,
        notifications: null,
        password: null
      })
      return res.status(204).json()
    }
  })
}