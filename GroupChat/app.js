const http = require('http')
const path = require('path')
const fs = require('fs')
const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
const adminRoutes = require('./routes/admin')


const Message = require('./models/Message');
const User = require('./models/User');
const Room = require('./models/Room');
const Room_User = require('./models/Room_User');


// const login_routes = require('./routes/login')
const sequelize = require('./util/database')
const auth = require('./middleware/auth')
const { Op } = require('sequelize');

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '/public')));

const server = require('http').Server(app)

const io = require('socket.io')(server); // Attach Socket.io to the server

io.on('connection', (socket) => {
  // Joining a private chat room
  socket.on('joinPrivateChat', (roomId) => {
    console.log('GC join: ',roomId)
    socket.join(roomId);
  });

  // Joining a group chat room
  socket.on('joinGroupChat', (roomId) => {
    console.log('GC join: ',roomId)
    socket.join(roomId);
  });

  // Handling message sent by a user
  socket.on('sendMessage', (data) => {
    console.log('Received a message from a client:', data);
    const {  message, sendTime } = data;
    const current_Room_ID=parseInt(data.current_Room_ID)
  
    // Broadcast the message to the corresponding room
    socket.to(current_Room_ID).emit('newMessage', { message, roomId: current_Room_ID, time: sendTime });
    console.log('emitted to room')
  });
  
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
    // console.log(rooms)
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

//Create Public Room 
app.post('/createRoom/:roomName', async (req, res) => {
  const roomName = req.params.roomName;
  const { selectedUserList } = req.body

  if (!selectedUserList || selectedUserList.length === 0) {
    return res.status(400).json({ success: false, message: 'No users selected' });
  }
  else {

    try {
      const room = await Room.create({
        name: roomName,
        createdBy: selectedUserList[0].fname,
        isPrivate: false
      });

      const roomUserPromises = selectedUserList.map((user, index) => {
        return Room_User.create({
          userId: user.id,
          roomId: room.id,
          isAdmin: index === 0 // Set isAdmin to true only for the first user in the selectedUserList
        });
      });


      await Promise.all(roomUserPromises);

      console.log('Room created');
      //success response
      return res.status(200).json({ success: true, message: 'Room successfully created', roomId: room.id });
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
      console.log('Private chat already exists:', existingRoom);
      return res.status(201).json({ success: true, message: 'Private Room already exists', roomId: existingRoom.roomId });
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

//New connection event 
app.post('/newConnection', auth.authenticate, async (req, res, next) => {
  const { message, roomId } = req.body;
  console.log(req.user)
  try {
    const data = await Message.create({ username: req.user.fname, text: message, isIntro: true, userId: req.user.id, roomId: roomId })
    console.log("New Entry Added: ", data)
    return res.status(200).json({ message: 'New connection successful' })
  }
  catch (err) {
    console.log(err)
    return res.status(404).json({ message: 'Error in new connection' })
  }
})

//Post message
app.post('/postMessage', auth.authenticate, async (req, res, next) => {
  const { message, roomId } = req.body;
  if (message.trim().length == 0) {
    res.status(400).json({ success: false, error: 'Null entry' })
  }

  const postMsg = await Message.create({ username: req.user.fname, text: message, isIntro: false, userId: req.user.id, roomId: roomId }) // store the message in an array
  console.log("New Entry Added: "); // log the array of messages

  const room = await Room.findByPk(roomId);
  room.last_activity = new Date();
  room.last_message = message
  await room.save();


  return res.status(200).json({ message: 'Posted Msg', createdAt: postMsg.createdAt, entry: postMsg });
});

//Get messages
app.post('/getMessages', auth.authenticate, async (req, res, next) => {
  const { roomId } = req.body;
  console.log(roomId);
  
  if (roomId === undefined) {
    return res.status(400).json({ message: 'Room ID invalid' });
  }
  
  try {
    const allMsg = await Message.findAll({
      where: { roomId },
      order: [['createdAt', 'DESC']],
      limit: 10,
    });
    const reversedMsg = allMsg.reverse();
    
    return res.status(200).json({ allMsg:reversedMsg });
  } catch (error) {
    console.error('Error retrieving messages:', error);
    return res.status(500).json({ message: 'Error retrieving messages' });
  }
});


//Provide updated messages after last local message time for user. 
app.post('/getUpdatedMessages/', auth.authenticate, async (req, res, next) => {
  const { last_msg_time, current_Room } = req.body
  console.log(current_Room)
  const updateMsg = await Message.findAll({
    where: { createdAt: { [Op.gt]: last_msg_time }, roomId: current_Room },
    order: [['createdAt', 'DESC']]
  });
  return res.status(200).json({ updateMsg })
})

//Add users to room
app.post('/admin/addUsersToRoom/:roomId/', auth.authenticate, async (req, res) => {
  const { roomId } = req.params;
  const { selectedAddUsersArray } = req.body;

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

      // Add the user to the room with isAdmin set to false
      await Room_User.create({
        userId: user.id,
        roomId: roomId,
        isAdmin: false
      });

      return { success: true, message: `User with ID ${user.id} added to the room successfully.` };
    });

    const addResults = await Promise.all(addPromises);

    res.status(200).json({ results: addResults });
  } catch (error) {
    console.error('Error adding users to room:', error);
    res.status(500).json({ success: false, message: 'Error adding users to room.' });
  }
});


//Remove user
app.delete('/admin/removeUserFromRoom/:roomId/:userId', auth.authenticate, async (req, res) => {
  const { roomId, userId } = req.params;

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

    res.status(200).json({ success: true, message: 'User removed from the room successfully.' });
  } catch (error) {
    console.error('Error removing user from room:', error);
    res.status(500).json({ success: false, message: 'Error removing user from room.' });
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

//update activity status
app.put('/updateRoom/:roomId', async (req, res) => {
  const { roomId } = req.params;
  const { updatedAt } = req.body;

  try {
    const room = await Room.findByPk(roomId);

    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    // Update the updatedAt field
    room.updatedAt = updatedAt;
    await room.save();

    return res.status(200).json({ success: true, message: 'Room updated successfully' });
  } catch (error) {
    console.error('Error updating room:', error);
    return res.status(500).json({ success: false, message: 'Error updating room' });
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

// Define the afterCreate hook
Message.afterCreate(async (message, options) => {
  const roomId = message.roomId;

  // Update the corresponding Room's updatedAt field
  await Room.update({ updatedAt: message.createdAt }, { where: { id: roomId } });
});

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// {alter:true}
sequelize.sync().then(res => {
  // console.log(res)
  server.listen(process.env.PORT || 3000, () => {
    console.log('Server is running on port 3000');
  });
})
  .catch(e => console.log(e))
