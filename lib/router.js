const app = require('nanoexpress')(),
path = require('path')

app.get('/', (req, res)=> {
    return res.status(203).json({ status: true, code: 203, message: 'hey 👋'})
})

app.listen(process.env.port || 3000)

require('./engine')(app, require('nanoexpress'))
require('glob').sync('../src/utils/**/*.js').forEach((a)=> {
    require(path.resolve(a)(app))
})