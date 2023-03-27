const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const User = require('./models/User')
const cors = require('cors')

// const errorController = require('./controllers/error');
const sequelize =require('./util/database')

const app = express();

app.use(cors())

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/user/add-user', async (req,res,next)=>{
    try{
        console.log(req.body)
        if(!req.body.phone)
        {
            throw new Error('Phone number mandatory')
        }
    const name = req.body.name
    const mailid = req.body.mailid
    const phone = req.body.phone
    const data = await User.create({name:name, mailid:mailid, phone:phone})
    res.status(201).json({newUserDetail:data})
    }
    catch(e) 
    {
        res.status(500).json({
            error:e
        })
    }
})

app.get('/user/get-user',async(req,res,next)=>{

        const users = await User.findAll()
        res.json({allUsers:users})
    })

// app.use(errorController.get404);
app.delete('/user/delete-user/:id',async(req,res,next)=>{
    const deluser = req.params.id
    // console.log(deluser)
    User.findByPk(deluser)
    .then(user=>{
      user.destroy()
    })
    .then(result=>{
      console.log('Deleted')
    })
    .catch(e=>console.log(e))
})


sequelize.sync().then(res=>{
    // console.log(res)
    app.listen(3000);
})
.catch(e=>console.log(e))


