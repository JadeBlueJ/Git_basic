const http = require('http')

const bodyParser = require('body-parser')
const admin_routes = require('./routes/admin')
const shop_routes = require('./routes/shop')

const exp = require('express');

const app = exp()

app.use(bodyParser.urlencoded({extended:false}))

app.use('/admin',admin_routes)
app.use('/shop',shop_routes)

app.use((req,res,next)=>{
    res.status('404').send('<h1>Error 404: Page not Found</h1>')
})

// const server = http.createServer(app);
// server.listen(4000)
 
app.listen(4000)



