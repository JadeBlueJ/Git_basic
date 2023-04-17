const path = require('path');
const express = require('express');
const app = express();


const bodyParser = require('body-parser');
const User = require('./models/User')
const Expense = require('./models/Expense')
const Order = require('./models/Order')
const Forgotpwd= require('./models/Forgotpwd')
const DLArchive= require('./models/DLArchive')
const cors = require('cors')

// const errorController = require('./controllers/error');
const sequelize =require('./util/database')



app.use(cors())

// app.set('view engine', 'ejs');
// app.set('views', 'views');
const adminRoutes  = require('./routes/admin');
const purchaseRoutes= require('./routes/purchase')
const premiumRoutes= require('./routes/premium')
const pwdRoutes= require('./routes/forgot')


app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(adminRoutes)
app.use(purchaseRoutes)
app.use(premiumRoutes)
app.use(pwdRoutes)


User.hasMany(Expense)
Expense.belongsTo(User)

User.hasMany(Order)
Order.belongsTo(User)

User.hasMany(Forgotpwd)
Forgotpwd.belongsTo(User)

User.hasMany(DLArchive)
DLArchive.belongsTo(User)

sequelize.sync().then(res=>{
    // console.log(res)
    app.listen(3000);
})
.catch(e=>console.log(e))


