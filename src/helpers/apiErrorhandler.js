const ApiError = require('./ApiError');

module.exports = apiErrorHandler = (e,req,res,next)=>{
    if(e instanceof ApiError){
        res.status(e.code).json(e.message);
    } else {
        res.status(500).json('Internel server error');
    }
}