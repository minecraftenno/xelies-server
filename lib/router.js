const app = require('express')(),
path = require('path')

app.get('/', (req, res)=> {
    return res.status(203).json({ status: true, code: 203, message: 'hey 👋'})
})

let start = new Date()

app.listen(process.env.PORT || 3000, (e)=> {
    if(e) throw e
    console.log(`[\x1b[36mServer\x1b[0m]: \x1b[32mstarted successfully at\x1b[0m [\x1b[36mlocalhost:${process.env.PORT || 3000}\x1b[0m] \x1b[32min\x1b[0m [\x1b[36m${new Date() - start}ms\x1b[0m]`)
})


require('./engine')(app, require('express'))
require('glob').sync('src/utils/**/*.js').forEach(a=> {
    require(path.resolve(a))(app)
    console.log(path.resolve(a))
})