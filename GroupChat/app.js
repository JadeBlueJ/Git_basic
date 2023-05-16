const http = require('http')
const path = require('path')
const fs = require('fs')
const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
const adminRoutes = require('./routes/admin')


const Message = require('./models/Message');
const User= require('./models/User');
const Room = require('./models/Room');
const Room_User = require('./models/Room_User');


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



// get all users 
app.get('/getUsers/:localUserId', async (req, res) => {
  try {
    const userId = req.params.localUserId;
    const allUsers = await User.findAll({
      attributes: ['id', 'fname', 'phone'],
      where: {
        id: {
          [Op.ne]: userId, // Exclude the userId
        },
      },
    });
    // Extract the necessary data from the user objects
    const usersData = allUsers.map((user) => ({
      id:user.id,
      fname: user.fname,
      phone: user.phone
    }));

    // Send the user data as a JSON response
    res.status(201).json({ users: usersData });

  } 
  catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving users' });
  }
});

//Create Public Room 
app.post('/createRoom/:roomName', async (req, res) => {
  const roomName = req.params.roomName;
  const selectedUserList = req.body.selectedUserList;

  if (!selectedUserList || selectedUserList.length === 0) {
    return res.status(400).json({ success: false, message: 'No users selected' });
  }

  try {
    const room = await Room.create({
      name: roomName,
      createdBy: selectedUserList[0].name
    });

    const roomUserPromises = selectedUserList.map(user => {
      return Room_User.create({
        userId: user.id,
        roomId: room.id,
        isAdmin: true
      });
    });

    await Promise.all(roomUserPromises);

    console.log('Room created');
    //success response
    return res.status(200).json({ success: true, message: 'Room successfully created',roomId:room.id });
  } 
  catch (error) {
    console.error('Error creating room:', error);
    return res.status(500).json({ success: false, message: 'Error creating room' });
  }
});

app.get('/getUserRooms', auth.authenticate, async (req, res) => {
  try {
    const user = req.user; // Assuming `req.user` contains the authenticated user object

    const rooms = await user.getRooms();
    res.status(200).json({ success: true, rooms });
  } catch (error) {
    console.error('Error retrieving user rooms:', error);
    res.status(500).json({ success: false, message: 'Error retrieving user rooms' });
  }
});

//Singup+login page
app.use(adminRoutes)
  
app.post('/newConnection',auth.authenticate, async (req,res,next)=>{
  const { message,roomId } = req.body;
  console.log(req.user)
  try{
      const data = await Message.create({username:req.user.fname, text:message, isIntro:true,userId:req.user.id,roomId:roomId})
      console.log("New Entry Added: ",data)
      return res.status(200).json({message:'New connection successful'})
  }
  catch(err){
    console.log(err)
    return res.status(404).json({message:'Error in new connection'})
  }


})


app.post('/postMessage',auth.authenticate, async (req, res, next) => {
  const { message,roomId } = req.body;
  if( message.trim().length==0)
  {
    res.status(400).json({success:false, error: 'Null entry'})
  }
  const postMsg = await Message.create({username:req.user.fname, text:message, isIntro:false,userId:req.user.id,roomId:roomId}) // store the message in an array
  console.log("New Entry Added: ",postMsg); // log the array of messages
  return res.status(200).json({ message: 'Posted Msg',createdAt:postMsg.createdAt,entry:postMsg });
});

app.post('/getMessages', auth.authenticate, async (req, res, next) => {
  const { roomId } = req.body
  console.log(roomId)
  if(roomId==undefined)
  {
    return res.status(400).json({message:'Room ID invalid'})
  }
  const allMsg = await Message.findAll({
    where:{roomId:roomId},
    order: [['createdAt', 'DESC']]
    });
    return res.status(200).json({allMsg})
   
});

app.post('/updateMessages/', auth.authenticate, async(req,res,next) =>{
  const {last_msg_time,current_Room} = req.body
  // console.log(last_msg_time)
    const updateMsg = await Message.findAll({
      where:{createdAt: {[Op.gt]:last_msg_time},roomId:current_Room},
      order: [['createdAt', 'DESC']]
      });
    return res.status(200).json({updateMsg})
})

// app.use((req,res,next)=>{
//     res.status('404').send('<h1>Error 404: Page not Found</h1>')
// })

//>>>>>>>>>>>>>>>>>>>>>  Defining relationships  <<<<<<<<<<<<<<<<<<<<<

Message.belongsTo(User,{constraints: true, onDelete: 'NO ACTION'})
User.hasMany(Message)

Message.belongsTo(Room, {constraints: true, onDelete: 'NO ACTION'})
Room.hasMany(Message)

User.belongsToMany(Room, {through:Room_User})
Room.belongsToMany(User, {through:Room_User})





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