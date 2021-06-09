const jwt = require('jsonwebtoken'),
    ApiError = require('../../helpers/ApiError'),
    userm = require('../../models/user.model');
    Authorized = require("../../middlewares/authorization"),
    CheckAuth = require("../../middlewares/jwt"),
    {decrypt} = require("../../crypto/crypto");

module.exports = (app) => {
    app.delete("/users/:user", Authorized, (req, res) => {
    
        if(req.password) {
            try {
                CheckAuth(req.headers.authorization, req.password)
            } catch(e) {
                console.log(e)
                return res.status(401).send(ApiError.unauthorized);
            }
            let decoded = CheckAuth(req.headers.authorization, req.password)
         
            if(decoded == ApiError.error) return res.status(503).send(decoded);
            
            decoded = JSON.parse(JSON.stringify(decoded));

            //CODE
            const {user} = req.params;
            if(user == "@me") {
                userm.findById(decoded.ID, (err, doc) => {
                    if(err) return res.status(503).send(ApiError.error);
                    if(doc) {
                        const newuser = {
                            id: doc._id,
                            email: null,
                            username: "Deleted User",
                            tag: null,
                            avatar: null,
                            created_at: doc.CreatedAt,
                            status: null,
                            friends: null,
                            notifications: null
                        }

                        userm.findByIdAndUpdate(decoded.ID, newuser, (err, doc) => {
                            if(!err) {res.status(202).send(ApiError.accepted) } else{res.status(503).send(ApiError.error)}
                            
                        });
                        return res.status(200).json();
                    } else {
                        return res.status(503).send(ApiError.error); //si ce code est exec mon middleware pue la queue sltcv
                    }
                });
            } else {
                return res.status(405).send(ApiError.methodnotallowed);
            }
        }
    });
}