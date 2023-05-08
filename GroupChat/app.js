const http = require('http')
const path = require('path')
const fs = require('fs')
const express = require('express');
const bodyParser = require('body-parser')
const User = require('./models/User')
const cors = require('cors')
const adminRoutes = require('./routes/admin')
const Message = require('./models/Message');
// const login_routes = require('./routes/login')
const sequelize =require('./util/database')
const auth = require('./middleware/auth')
const { Op } = require('sequelize');

const app = express()
app.use(cors())
app.use(bodyParser.json()) 
app.use(express.static(path.join(__dirname, '/public')));
//Serve pages
app.get('/styles.css', (req, res) => {
    res.set('Content-Type', 'text/css');
    res.sendFile(__dirname + '/public/css/styles.css');
  });

app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/public/signup.html');
  });

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
  });

//Singup+login page
app.use(adminRoutes)
  
app.post('/newConnection',auth.authenticate, async (req,res,next)=>{
  const { username } = req.body;
  console.log(req.user)
  const checkExists=await Message.findOne({where:{isIntro:true,text:`${req.user.fname} has joined the chat`}})
  if(!checkExists){
  const data = await Message.create({username:req.user.fname, text:`${req.user.fname} has joined the chat`, isIntro:true,userId:req.user.id})
  console.log("New Entry Added: ",data)
  return res.status(200).json({message:'Posted User'})
  }
  else
  {
    console.log('newConnection exists')
    return res.status(200).json({message:'Exists'})
  }
})


app.post('/postMessage',auth.authenticate, async (req, res, next) => {
  const { message } = req.body;
  if( message.trim().length==0)
  {
    res.status(400).json({success:false, error: 'Null entry'})
  }
  const postMsg = await Message.create({username:req.user.fname, text:message, isIntro:false,userId:req.user.id}) // store the message in an array
  console.log("New Entry Added: ",postMsg); // log the array of messages
  return res.status(200).json({ message: 'Posted Msg',createdAt:postMsg.createdAt,entry:postMsg });
});

app.post('/getMessages', auth.authenticate, async (req, res, next) => {

  const allMsg = await Message.findAll({
    order: [['createdAt', 'DESC']]
    });
    return res.status(200).json({allMsg})
   
});

app.post('/updateMessages/', auth.authenticate, async(req,res,next) =>{
  const last_msg_time = req.body.last_msg_time
  // console.log(last_msg_time)
    const updateMsg = await Message.findAll({
      where:{createdAt: {[Op.gt]:last_msg_time}},
      order: [['createdAt', 'DESC']]
      });
    return res.status(200).json({updateMsg})
})

// app.use((req,res,next)=>{
//     res.status('404').send('<h1>Error 404: Page not Found</h1>')
// })
User.hasMany(Message)
Message.belongsTo(User)

sequelize.sync().then(res=>{
    // console.log(res)
    app.listen(process.env.PORT||3000);
})
.catch(e=>console.log(e))




// const { last_msg_time } = req.body
// console.log(last_msg_time)
// if(last_msg_time==null)


  // else{
  //     const allMsg = await Message.findAll({
  //     where:{createdAt: {[Op.gt]:last_msg_time}},
  //     order: [['createdAt', 'DESC']]
  //   });
  //   return res.status(200).json({allMsg})
  // }


// // Here we read from the file and post the chat string and then wait for the next request from client
// app.use('/chat',(req,res,next)=>{
//     fs.appendFile('msg.txt',`${req.body.username} :${req.body.message}`,()=>{
//         fs.readFile('msg.txt',(e,data)=>{
//             res.setHeader('Content-Type', 'text/html')
//             res.write(`<body>${data}</body>`)
//             res.write(' <form action="/chat" method="POST" onsubmit="document.getElementById(`uname`).value=localStorage.getItem(`username`)"><input type = "text" id = "msg" name = "message"><input type = "hidden" id = "uname" name = "username"><button type = "submit">Enter Your Message</button></form>')
//             res.write('</html>')
//             return res.end();

//         })
//     });
    
   
// })


// check if chats present before hand or else respond with a "send message" form. 
// app.use('/home',(req,res,next)=>{

//   // if(data.length==0)
//   // {
//   //     // // res.setHeader('Content-Type', 'text/html')
//   //     // // res.write(`<body>No chats Yet</body>`)
//   //     // // res.write(' <form action="/chat" method="POST" onsubmit="document.getElementById(`uname`).value=localStorage.getItem(`username`)"><input type = "text" id = "msg" name = "message"><input type = "hidden" id = "uname" name = "username"><button type = "submit">Enter Your Message</button></form>')
//   //     // // res.write('</html>')
//   //     // 
//   // }
//   // res.send(
//       // '<form action="/chat" method="POST" onsubmit="document.getElementById(`uname`).value=localStorage.getItem(`username`)"><input type = "text" id = "msg" name = "message"><input type = "hidden" id = "uname" name = "username"><button type = "submit">Enter Your Message</button></form>')
//       res.sendFile('index.html') 
// })