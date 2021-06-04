const app = require('nanoexpress')(),
path = require('path')

app.get('/', (req, res)=> {
    return res.json({ status: true, code: 203, message: 'hey 👋'}).status(203)
})

app.listen(process.env.port || 3000)


require('./engine')(app, require('nanoexpress'))
require('glob').sync('../src/utils/**/*.js').forEach((a)=> {
    require(path.resolve(a)(app))
})