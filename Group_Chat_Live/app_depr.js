const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const formatMessage = require('./utils/messages')

const app=express()
const server = http.createServer(app)
const io = socketio(server)

const botName = 'Chatcore'


const bodyParser = require('body-parser');
const User = require('./models/User')

const cors = require('cors')
const sequelize =require('./util/database')
app.use(cors())

const adminRoutes  = require('./routes/admin');

app.use(bodyParser.json({ extended: false }));

app.use(express.static(path.join(__dirname, '/public')));

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '/public', 'login.html'));
});

app.use(adminRoutes)


// const connectedUsers = [];
app.get('/', () => {

});

//Run when client conn
io.on('connection',socket=>{
  socket.emit('message',formatMessage(botName,'Welcome to the chat'))

  //Broadcast when user connects
  socket.broadcast.emit('message',formatMessage(botName,'A user has joined'))

  //Disconnect
  socket.on('disconnect',()=>{
      io.emit('message',formatMessage(botName,'A user has left'))
  })
  //listen for chat msgs
  socket.on('chatMessage',(msg)=>{
      io.emit('message',formatMessage('USER',msg))
  })
})


sequelize.sync().then(res=>{
    // console.log(res)
    server.listen(process.env.PORT||3000);
})
.catch(e=>console.log(e))



// const express = require('express');
// const app = express();
// const http = require('http').createServer(app);
// const io = require('socket.io')(http);

// app.use(express.static('public'));

// io.on('connection', (socket) => {
// 	socket.on('chat message', (message) => {
// 		io.emit('chat message', message); // This broadcasts the message to all connected clients
// 	});
// });

// http.listen(3000, () => {
// 	console.log('listening on *:3000');
// });
