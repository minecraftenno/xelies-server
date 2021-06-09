const app = require('express')(),
path = require('path')

app.get('/', (req, res)=> {
    return res.status(203).json({ status: true, code: 203, message: 'hey 👋'})
})

let start = new Date()

app.listen(process.env.PORT || 3000, (e)=> {
    if(e) throw e
    console.log(`[Server]: started successfully at [localhost:${process.env.PORT || 3000}] in [${new Date() - start}ms]`)
})

require('./engine')(app, require('express'))
require('glob').sync('src/utils/**/*.js').forEach((a)=> {
    require(path.resolve(a))(app)
})