const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize =require('./util/database')

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const Product = require('./models/product')
const User = require('./models/user')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use((req,res,next)=>{
    User.findByPk(1)
    .then(user=>{
        // console.log(user);
        req.user=user;
        next();
    })
    .catch(e=>console.log(e))
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User,{constraints:true ,onDelete:'CASCADE'})
User.hasMany(Product) //Redundant

// sequelize.sync({force:true})

sequelize.sync()
.then(res=>{
    return User.findByPk(1)
})
.then(user=>{
    if(!user)
    {
        return User.create({name:'Jay',mailid:'jayjeet@gmail.com'})
    }
    else return user
})
.then(user=>{
    // console.log(user)
    app.listen(3000)
})
.catch(e=>console.log(e))


