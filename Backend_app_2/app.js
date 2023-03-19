const http = require('http')
const path = require('path')
const express = require('express');
const app = express()

const bodyParser = require('body-parser')
const admin_routes = require('./routes/admin')
const shop_routes = require('./routes/shop')
const contact_routes = require('./routes/contact.js')
const errctrl = require('./controllers/error')
const successsplash = require('./controllers/contact')


app.use(express.static(path.join(__dirname,'public')))
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({extended:false}))

app.use('/admin',admin_routes)
app.use('/',shop_routes)
app.use('/contactus',contact_routes)

app.use('/success',successsplash.splash)

app.use(errctrl.getErr);
 
app.listen(4000)



