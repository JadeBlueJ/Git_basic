const http = require('http')
const path = require('path')
const fs = require('fs')
const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
const adminRoutes = require('./routes/admin')
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
require('dotenv').config()
const Message = require('./models/Message');
const User = require('./models/User');
const Room = require('./models/Room');
const Room_User = require('./models/Room_User');

const app = express()
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   next();
// });
app.use(cors())

// const login_routes = require('./routes/login')
const sequelize = require('./util/database')
const auth = require('./middleware/auth')
const { Op } = require('sequelize');
const storage = new Storage();
const bucketName = process.env.GC_BUCKET_NAME;

app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '/public')));

const server = require('http').Server(app)

const io = require('socket.io')(server); // Attach Socket.io to the server


io.on('connection', (socket) => {

  // Joining a private chat room
  socket.on('joinPrivateChat', (roomId) => {

    if (!socket.rooms.has(roomId)) {
      socket.join(roomId);
    } else {
      // console.log('Already joined private chat room:', roomId);
    }
  });

  // Joining a group chat room
  socket.on('joinGroupChat', (roomId) => {
    if (!socket.rooms.has(roomId)) {
      socket.join(roomId);
    } else {
      // console.log('Already joined group chat room:', roomId);
    }
  });


  // Handling message sent by a user
  socket.on('sendMessage', (data) => {
    console.log('Received a message from a client:', data);
    const { message, sendTime, userName, isIntro } = data;
    const current_Room_ID = parseInt(data.current_Room_ID)
    // Broadcast the message to the corresponding room
    socket.to(current_Room_ID).emit('newMessage', { message, time: sendTime, userName: userName, roomId: current_Room_ID, isMedia: false, isIntro });
    console.log('Emitted to room:', current_Room_ID);
  });

  // Server-side code
  socket.on('mediaUploaded', async (data) => {
    const { message, sendTime, userName, fileType } = data;
    const current_Room_ID = parseInt(data.current_Room_ID)

    // Emit the new message to the appropriate room
    socket.to(current_Room_ID).emit('newMessage', { message, time: sendTime, userName: userName, roomId: current_Room_ID, isMedia: true, fileType });
    console.log('Media emitted to room:', current_Room_ID);
  });


});

// Multer configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'video/mp4'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Please upload a PDF, image, or video file.'));
    }
  },
});

// POST route for file upload
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const bucket = storage.bucket(bucketName);
    const blob = bucket.file(file.originalname);

    const blobStream = blob.createWriteStream({
      resumable: false,
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on('error', (error) => {
      console.error('Error uploading file:', error);
      res.status(500).json({ message: 'Failed to upload file.' });
    });

    let uploadedBytes = 0;
    const totalBytes = file.buffer.length;

    blobStream.on('progress', (progress) => {
      uploadedBytes = progress.bytesWritten;
      const percentage = Math.round((uploadedBytes / totalBytes) * 100);
      console.log(`Upload progress: ${percentage}%`);
      // Emit the progress event to the frontend
      io.emit('uploadProgress', { progress: percentage });
    });

    blobStream.on('finish', () => {
      res.status(200).json({ message: 'File uploaded successfully.' });
    });

    blobStream.end(file.buffer);
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'An error occurred while uploading the file.' });
  }
});



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

// get all users 
app.get('/getUsers/:localUserId', async (req, res) => {
  try {
    const userId = req.params.localUserId;
    const allUsers = await User.findAll({
      attributes: ['id', 'fname', 'phone', 'email'],
      where: {
        id: {
          [Op.ne]: userId, // Exclude the userId
        },
      },
    });
    // Extract the necessary data from the user objects
    const usersData = allUsers.map((user) => ({
      id: user.id,
      fname: user.fname,
      phone: user.phone,
      email: user.email,
      isSelected: false
    }));

    // Send the user data as a JSON response
    res.status(201).json({ users: usersData });

  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving users' });
  }
});

app.get('/getUserRooms', auth.authenticate, async (req, res) => {
  try {
    const user = req.user; // Assuming `req.user` contains the authenticated user object

    const rooms = await user.getRooms({
      order: [['last_activity', 'DESC']]
    });
    res.status(200).json({ success: true, rooms });
  } catch (error) {
    console.error('Error retrieving user rooms:', error);
    res.status(500).json({ success: false, message: 'Error retrieving user rooms' });
  }
});



//get all users in a room
app.get('/getRoomUsers/:room_ID', async (req, res) => {
  try {
    const room_ID = req.params.room_ID;
    const roomUserIDs = await Room_User.findAll({
      attributes: ['userId', 'isAdmin'],
      where: {
        roomId: {
          [Op.eq]: room_ID,
        },
      },
    });
    // Extract the necessary data from the user objects
    const roomUsers = await Promise.all(roomUserIDs.map(async (roomUser) => {
      const user = await User.findByPk(roomUser.userId);
      return {
        id: user.id,
        fname: user.fname,
        email: user.email,
        phone: user.phone,
        isAdmin: roomUser.isAdmin
      };
    }));

    // Send the user data as a JSON response
    res.status(201).json({ roomUsers });

  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving users' });
  }
});
//function to update room activity on any event
async function updateRoomActivity(roomId, message, userId, userName) {
  const room = await Room.findByPk(roomId)
  if (room) {
    room.last_activity = new Date();
    room.last_message = message
    room.last_userId = userId
    room.last_userName = userName
    await room.save();
    return
  }
  else {
    console.log('Invalid room')
    return
  }
}
//Create Public Room 
app.post('/createRoom/:roomName', async (req, res) => {
  const roomName = req.params.roomName;
  const { selectedUserList } = req.body

  if (!selectedUserList || selectedUserList.length === 0) {
    return res.status(400).json({ success: false, message: 'No users selected' });
  }
  else {
    let users = []
    try {
      const room = await Room.create({
        name: roomName,
        createdBy: selectedUserList[0].fname,
        isPrivate: false
      });

      const roomUserPromises = selectedUserList.map((user, index) => {
        users.push(user.fname)

        let connectedSocket = null;
        for (const socketId in io.sockets.sockets) {
          const socket = io.sockets.sockets[socketId];
          if (socket.userId == user.id) {
            connectedSocket = socket;
            break;
          }
        }
        if (connectedSocket) {
          console.log(`Joining connecedd socket, ${connectedSocket.userId} to new room`)
          connectedSocket.join(room.id)
        }

        return Room_User.create({
          userId: user.id,
          roomId: room.id,
          isAdmin: index === 0 // Set isAdmin to true only for the first user in the selectedUserList
        });
      });


      await Promise.all(roomUserPromises);
      console.log('Room created');

      const message = `${room.createdBy} created a new group with participants: ${users.join(', ')}`

      await Message.create({ username: selectedUserList[0].fname, text: message, isIntro: true, userId: selectedUserList[0].id, roomId: room.id })
      await updateRoomActivity(room.id, message, selectedUserList[0].id, selectedUserList[0].fname)

      //success response
      return res.status(200).json({ success: true, message: 'Room successfully created', msg: message, roomId: room.id });
    }
    catch (error) {
      console.error('Error creating room:', error);
      return res.status(500).json({ success: false, message: 'Error creating room' });
    }
  }

});

//Create pvt Room 
app.post('/createPrivateRoom/:userID', auth.authenticate, async (req, res) => {

  const { userID } = req.params
  const localUser = req.user
  if (!userID) {
    return res.status(400).json({ success: false, message: 'No user selected' });
  }
  try {
    const firstUser = await User.findOne({ where: { id: localUser.id } })
    const secondUser = await User.findOne({ where: { id: userID } })
    if (!secondUser || !firstUser) {
      return res.status(404).json({ succes: false, message: 'Selected User not found' })
    }

    // Sort the user IDs
    const userIds = [firstUser.id, secondUser.id].sort();
    // Generate a unique room name based on sorted user IDs
    const roomName = `Private_${userIds[0]}_${userIds[1]}`;
    // Check if a private room already exists between the users
    const existingRoom = await Room.findOne({
      where: {
        name: roomName,
        isPrivate: true,
      },
    });
    if (existingRoom) {
      // Private chat already exists
      console.log('Private chat already exists');
      return res.status(201).json({ success: true, message: 'Private Room already exists', roomId: existingRoom.id });
      // Return the existing chat or appropriate response
    }
    else {
      // Create a new private chat
      const room = await Room.create({
        name: roomName,
        createdBy: localUser.fname,
        isPrivate: true,
      });

      const add1 = await Room_User.create({
        userId: firstUser.id,
        roomId: room.id,
        isAdmin: false,
      });
      const add2 = await Room_User.create({
        userId: secondUser.id,
        roomId: room.id,
        isAdmin: false,
      });

      console.log('Private Room created');
      // Success response
      return res.status(200).json({ success: true, message: 'Private Room successfully created', roomId: room.id });
    }
  }
  catch (error) {
    console.error('Error creating private room:', error);
    return res.status(500).json({ success: false, message: 'Error creating pvt room' });
  }
});

//Add users to room
app.post('/admin/addUsersToRoom/:roomId/', auth.authenticate, async (req, res) => {
  const { roomId } = req.params;
  const { selectedAddUsersArray } = req.body;
  let addedUsers = []
  try {
    // Check if the authenticated user is an admin of the room
    const roomUser = await Room_User.findOne({
      where: { userId: req.user.id, roomId: roomId }
    });

    if (!roomUser || !roomUser.isAdmin) {

      return res.status(403).json({ success: false, message: 'You do not have permission to add users to this room.' });
    }

    // Iterate over the addUsersArray and add each user to the room
    const addPromises = selectedAddUsersArray.map(async (user) => {
      const existingUser = await Room_User.findOne({
        where: { userId: user.id, roomId: roomId }
      });

      if (existingUser) {
        return { success: false, message: `User with ID ${user.id} is already a member of this room.` };
      }
      else {
        addedUsers.push(user.fname)

        let connectedSocket = null;
        for (const socketId in io.sockets.sockets) {
          const socket = io.sockets.sockets[socketId];
          if (socket.userId == user.id) {
            connectedSocket = socket;
            break;
          }
        }
        if (connectedSocket) {
          console.log(`Joining connecedd socket, ${connectedSocket.userId} to existing room ${roomId}`)
          connectedSocket.join(roomId)
        }

        // Add the user to the room with isAdmin set to false
        await Room_User.create({
          userId: user.id,
          roomId: roomId,
          isAdmin: false
        });

        return { success: true, message: `User with ID ${user.id} added to the room successfully.` };
      }

    });

    const addResults = await Promise.all(addPromises);
    addedUsers = addedUsers.join(',')

    const message = `${req.user.fname} added following people to the group: ${addedUsers}`
    await Message.create({ username: req.user.fname, text: message, isIntro: true, userId: req.user.id, roomId: roomId })
    await updateRoomActivity(roomId, message, req.user.id, req.user.fname)

    return res.status(200).json({ results: addResults, message });
  } catch (error) {
    console.error('Error adding users to room:', error);
    return res.status(500).json({ success: false, message: 'Error adding users to room.' });
  }
});

//Remove user
app.delete('/admin/removeUserFromRoom/:roomId/:userId/:userName/', auth.authenticate, async (req, res) => {
  const { roomId, userId, userName } = req.params;

  try {
    // Check if the authenticated user is an admin of the room
    const roomUser = await Room_User.findOne({
      where: { userId: req.user.id, roomId: roomId }
    });

    if (!roomUser || !roomUser.isAdmin) {
      return res.status(403).json({ success: false, message: 'You do not have permission to remove users from this room.' });
    }

    // Check if the user to be removed exists in the room
    const existingUser = await Room_User.findOne({
      where: { userId: userId, roomId: roomId }
    });

    if (!existingUser) {
      return res.status(400).json({ success: false, message: 'User is not a member of this room.' });
    }

    // Remove the user from the room
    await Room_User.destroy({
      where: { userId: userId, roomId: roomId }
    });
    const message = `${req.user.fname} removed ${userName} from the group`
    await Message.create({ username: req.user.fname, text: message, isIntro: true, userId: req.user.id, roomId: roomId })

    let connectedSocket = null;
    for (const socketId in io.sockets.sockets) {
      const socket = io.sockets.sockets[socketId];
      if (socket.userId == userId) {
        connectedSocket = socket;
        break;
      }
    }
    if (connectedSocket) {
      console.log(`remove connected socket, ${connectedSocket.userId} from room: ${roomId}`)
      connectedSocket.leave(roomId)
    }
    else
    {
      console.log('Not connected')
    }

    await updateRoomActivity(roomId, message, req.user.id, req.user.fname)



    res.status(200).json({ success: true, message });
  } catch (error) {
    console.error('Error removing user from room:', error);
    res.status(500).json({ success: false, message: 'Error removing user from room.' });
  }
});


// //New connection event 
// app.post('/newEvent', auth.authenticate, async (req, res, next) => {
//   const { message, roomId,modifier } = req.body;

//   console.log(message, roomId)
//   try {
//     const data = await Message.create({ username: req.user.fname, text: message, isIntro: true, userId: req.user.id, roomId: roomId })
//     console.log("New Entry Added: ", data)
//     //Update room activity details:
//     const room = await Room.findByPk(roomId);
//     console.log('Updating new room activity after creation', room)
//     room.last_activity = new Date();
//     room.last_message = message
//     room.last_userId = req.user.id
//     room.last_userName = req.user.fname
//     await room.save();
//     return res.status(200).json({ message: 'New connection successful',roomId:room.id })
//   }
//   catch (err) {
//     console.log(err)
//     return res.status(404).json({ message: 'Error in new connection' })
//   }
// })

//Post message
app.post('/postMessage', auth.authenticate, async (req, res, next) => {
  const { message, roomId } = req.body;
  if (message.trim().length == 0) {
    res.status(400).json({ success: false, error: 'Null entry' })
  }
  const postMsg = await Message.create({ username: req.user.fname, text: message, isIntro: false, userId: req.user.id, roomId: roomId, isMedia: false }) // store the message in an array

  //Update room activity details:
  const room = await Room.findByPk(roomId);
  room.last_activity = new Date();
  room.last_message = message
  room.last_userId = req.user.id
  room.last_userName = req.user.fname
  await room.save();
  return res.status(200).json({ message: 'Posted Msg', createdAt: postMsg.createdAt, entry: postMsg });
});


//Post file => update msg
app.post('/postFile', auth.authenticate, async (req, res, next) => {
  const { roomId, message, alt, fileType } = req.body;
  if (!alt)
    return res.status(404).json({ message: 'Invalid alt text for image' })
  try {
    const postFile = await Message.create({ username: req.user.fname, text: message, isIntro: false, userId: req.user.id, roomId: roomId, isMedia: true, alt: alt, fileType: fileType }) // store the message in an array
    const room = await Room.findByPk(roomId);
    room.last_activity = new Date();
    room.last_message = message
    room.last_userId = req.user.id
    room.last_userName = req.user.fname
    await room.save();
    return res.status(200).json({ message: 'Posted File', createdAt: postFile.createdAt, entry: postFile });
  }
  catch (err) {
    console.log(err)
    return res.status(500).json({ msg: `Something went wrong while writing file details to db:${err}` })
  }

});

//Get messages of a room id
app.post('/getMessages', auth.authenticate, async (req, res, next) => {
  const { roomId } = req.body;

  if (roomId === undefined) {
    return res.status(400).json({ message: 'Room ID invalid' });
  }

  try {
    const allMsg = await Message.findAll({
      where: { roomId },
      order: [['createdAt', 'DESC']],
      limit: 25,
    });
    if (allMsg.length > 0) {
      const reversedMsg = allMsg.reverse();
      const firstMsgTime = allMsg[0].updatedAt
      return res.status(200).json({ allMsg: reversedMsg, firstMsgTime });
    }
    else {
      return res.status(200).json({ allMsg, firstMsgTime: null });
    }

  } catch (error) {
    console.error('Error retrieving messages:', error);
    return res.status(500).json({ message: 'Error retrieving messages' });
  }
});
//Get older messages of a room id
app.post('/getOldMessages', auth.authenticate, async (req, res, next) => {
  const { roomId, first_msg_time } = req.body;

  if (roomId === undefined) {
    return res.status(400).json({ message: 'Room ID invalid' });
  }

  try {
    const oldMsg = await Message.findAll({
      where: {
        roomId,
        createdAt: { [Op.lt]: first_msg_time }
      },
      order: [['createdAt', 'DESC']],
      limit: 10,
    });



    return res.status(200).json({ oldMsg });
  } catch (error) {
    console.error('Error retrieving messages:', error);
    return res.status(500).json({ message: 'Error retrieving messages' });
  }
});


//Make admin
app.put('/admin/updateAdminStatus/:roomId/:userId', auth.authenticate, async (req, res) => {
  const { roomId, userId } = req.params;

  try {
    // Check if the authenticated user is an admin of the room
    const roomUser = await Room_User.findOne({
      where: { userId: req.user.id, roomId: roomId }
    });

    if (!roomUser || !roomUser.isAdmin) {
      return res.status(403).json({ success: false, message: 'You do not have permission to make users admin of this room.' });
    }

    // Check if the user to be made admin exists in the room
    const existingUser = await Room_User.findOne({
      where: { userId: userId, roomId: roomId }
    });

    if (!existingUser) {
      return res.status(400).json({ success: false, message: 'User is not a member of this room.' });
    }

    // Update the user's isAdmin status to true
    existingUser.isAdmin = !existingUser.isAdmin;
    await existingUser.save();

    res.status(200).json({ success: true, message: 'User has been made admin of the room.' });
  } catch (error) {
    console.error('Error making user admin:', error);
    res.status(500).json({ success: false, message: 'Error making user admin.' });
  }
});


//Error page
app.use((req, res, next) => {
  res.status('404').send('<h1>Error 404: Page not Found</h1>')
})

//>>>>>>>>>>>>>>>>>>>>>  Defining relationships  <<<<<<<<<<<<<<<<<<<<<

Message.belongsTo(User, { foreignKey: { name: 'userId', allowNull: false }, onDelete: 'CASCADE' });
User.hasMany(Message, { foreignKey: { name: 'userId', allowNull: false }, onDelete: 'CASCADE' });

Message.belongsTo(Room, { foreignKey: { name: 'roomId', allowNull: false }, onDelete: 'CASCADE' });
Room.hasMany(Message, { foreignKey: { name: 'roomId', allowNull: false }, onDelete: 'CASCADE' });

Room.belongsToMany(User, { through: Room_User, foreignKey: 'roomId' });
User.belongsToMany(Room, { through: Room_User, foreignKey: 'userId' });

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// {alter:true}
sequelize.sync().then(res => {
  // console.log(res)
  server.listen(process.env.PORT || 3000, () => {
    console.log('Server is running on port 3000');
  });
})
  .catch(e => console.log(e))
