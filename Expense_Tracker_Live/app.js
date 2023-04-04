const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const User = require('./models/User')
const Expense = require('./models/Expense')
const cors = require('cors')

// const errorController = require('./controllers/error');
const sequelize =require('./util/database')

const app = express();

app.use(cors())

// app.set('view engine', 'ejs');
// app.set('views', 'views');
const adminRoutes  = require('./routes/admin');


app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(adminRoutes)

sequelize.sync().then(res=>{
    // console.log(res)
    app.listen(3000);
})
.catch(e=>console.log(e))


