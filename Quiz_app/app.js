const http = require('http')
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const User = require('./models/User');
const adminRoutes = require('./routes/admin')
const app = express()

const sequelize = require('./util/database')
const auth = require('./middleware/auth')
const { Op } = require('sequelize');
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '/public')));

//signup/login
app.use(adminRoutes)

app.post('/postResult', auth.authenticate, async (req, res) => {
    const { score, time } = req.body
    const user = req.user
    if (user) {
        user.newScore = score
        user.newTime = time
        if (user.bestScore == null)
            user.bestScore = score 
        else if (user.bestScore < score)
            user.bestScore = score
        if (user.bestTime == null)
            user.bestTime = time
        else if (user.bestTime > time)
            user.bestTime = time

        await user.save();
        return res.status(200).json({ msg: 'Success' })
    }
    else {
        console.log('Invalid user')
        return res.status(400).json({ msg: 'Fail' })
    }

})

app.get('/getLdb', auth.authenticate, async (req, res) => {

    try {
        const topUsers = await User.findAll({
          attributes: [
            'fname',
            'bestScore',
            'bestTime'
          ],
        //   group: ['bestScore'],
          order: [['bestScore', 'DESC']],
          limit: 10,
        });
        topUsers.forEach(user=>{
            console.log(user)
        })
        // console.log(topUsers)
        res.status(200).json({topUsers});
      } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server Error' });
      }

})

app.get('/getResult', auth.authenticate, async (req, res) => {
    if(req.user)
    {
        return res.status(200).json({user:req.user})
    }
    else
    return res.status(404).json({message:'Error'})
})

sequelize.sync().then(res => {
    // console.log(res)
    app.listen(process.env.PORT || 3000);
})
    .catch(e => console.log(e))
