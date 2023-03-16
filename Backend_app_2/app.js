const http = require('http')
const path = require('path')
const bodyParser = require('body-parser')
const admin_routes = require('./routes/admin')
const shop_routes = require('./routes/shop')
const contact_routes = require('./routes/contact.js')

const express = require('express');

const app = express()
app.use(express.static(path.join(__dirname,'public')))

app.use(bodyParser.urlencoded({extended:false}))

app.use('/admin',admin_routes)
app.use('/',shop_routes)
app.use('/contactus',contact_routes)

app.use('/success',(req,res,next)=>{
    res.send('Form Successfully filled')
})

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

// const server = http.createServer(app);
// server.listen(4000)
 
app.listen(4000)



