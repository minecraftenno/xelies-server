const ApiResponse = require('../helpers/ApiResponse'),
    jwt = require('jsonwebtoken')
    user = require("../models/user.model")

module.exports = function Authorized(req, res, next) {
    let token = req.headers.authorization;
    const ogtoken = req.headers.authorization;

    if(!token) return res.status(401).send(ApiResponse.unauthorized);

    token = token.split(".");
    if(token[1]) {

        try {
            JSON.parse(Buffer.from(token[1], "base64").toString("ascii"));
        } catch(e) {
            return res.status(401).send(ApiResponse.unauthorized);
          
        }

        let ID = JSON.parse(Buffer.from(token[1], "base64").toString("ascii")).ID;

        if(!ID) return res.status(401).send(ApiResponse.unauthorized);
     
        user.findById(ID, (err, doc) => {
            if(err) {
                return res.status(503).send(ApiResponse.error)
            } else {
                if(doc) {
                    req.password = doc.password;
                    next();
                } else {
        
                    return res.status(401).send(ApiResponse.unauthorized);
                   
                }
            }
        });
    }else{

        res.status(401).send(ApiResponse.unauthorized);
 
    }
}