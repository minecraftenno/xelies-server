const ApiError = require('../../helpers/ApiError'),
    userm = require('../../models/user.model'),
    Authorized = require("../../middlewares/authorization"),
    CheckAuth = require("../../middlewares/jwt"),
    { decrypt } = require("../../crypto/crypto")

module.exports = app => {
    app.get("/users/:user", Authorized, (req, res) => {

        if (req.password) {
            try {
                CheckAuth(req.headers.authorization, req.password)
            } catch (e) {
                console.log(e)
                return res.status(401).send(ApiError.unauthorized);
            }
            let decoded = CheckAuth(req.headers.authorization, req.password)

            if (decoded == ApiError.error) return res.status(503).send(decoded);

            decoded = JSON.parse(JSON.stringify(decoded));

            //CODE
            const {
                user
            } = req.params;
            if (user == "@me") {
                userm.findById(decoded.ID, (err, doc) => {
                    if (err) return res.status(503).send(ApiError.error);
                    if (doc) {
                        const email = decrypt(doc.email.content, doc.email.iv)
                        return res.status(200).json({
                            id: doc._id,
                            email: email,
                            username: doc.username,
                            tag: doc.tag,
                            avatar: doc.avatar,
                            created_at: doc.CreatedAt,
                            status: doc.status
                        });
                    } else {
                        return res.status(401).send(ApiError.unauthorized); //Si ce code est utilisé, c'est que le token de l'utilisateur est déclalé de quelques chiffres / que le checkauth ne donne rien comme err
                    }
                });
            } else {
                userm.findById(user, (err, doc) => {
                    if (err) return res.status(503).send(ApiError.error);
                    return res.status(200).json({
                        id: doc._id,
                        username: doc.username,
                        tag: doc.tag,
                        avatar: doc.avatar,
                        created_at: doc.CreatedAt,
                        status: doc.status
                    });
                });
            }
        }
    });
}