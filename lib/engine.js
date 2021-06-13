const mongoose = require('mongoose'),
    bp = require('body-parser'),
    secret = process.env.SECRET || require("../c.json").SECRET

module.exports = app => {
    app.use(require('cors')({
        origin: 'http://localhost:3000',
        allowedHeaders: ['content-type', 'authorization'],
        optionsSuccessStatus: 203
    }))

    app.use(bp.urlencoded({ extended: false }))
    app.use(bp.json())
    app.use(require('cookie-parser')(secret))



    /**
    app.use((req, res, next)=> {
        if(res.status(404)) return res.send(ApiError.notfound)
    })
    */
    
    mongoose.connect(process.env.MONGO || require('../c.json').MONGO, {
        useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true
    })
    mongoose.connection.on('connected', e => {
        if(e) throw e
        console.info('connected to data base!')
    })
}