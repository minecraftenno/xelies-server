const mongoose = require('mongoose'),
    bp = require('body-parser')

module.exports = (app) => {
    app.use(require('cors')())
    app.use(bp.urlencoded({ extended: false }))
    app.use(bp.json())
    
    mongoose.connect(process.env.MONGO || require('../c.json').MONGO, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    mongoose.connection.on('connected', e => {
        if(e) throw e
        console.info('connected to data base!')
    })
}