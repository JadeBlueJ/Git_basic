let last_msg_time = null
const chat_messages = document.getElementById('chat-messages')
const room_list = document.getElementById('room_list')
let currentRoomSplash = document.getElementById('currentRoom')
let room_list_data = null
const createGroupBtn = document.getElementById('createGroupBtn')
const viewUsersBtn = document.getElementById('viewUsersBtn')
const addUsersBtn = document.getElementById('addUsersBtn')
const adminBtn = document.getElementById('adminBtn')
const sendMsgBtn = document.getElementById("sendMsgBtn");
const chatForm = document.getElementById('chat-form');// import io from 'socket.io-client'
const chatBtn = document.getElementById('chatBtn');
//Socket
const socket = io('http://localhost:3000')

socket.on('connect', () => {
  console.log('connected socket, ID:', socket.id)
})

// Event listener for incoming messages
socket.on('newMessage', async (data) => {
  // Update the chat window with the new message
  console.log('Inside sockets recevied msg', data)
  // console.log('room:',roomId)
  // console.log('time',time)
  if (current_Room_ID == data.roomId) {
    console.log('same room')
    createRecDiv(data.message, data.time,'Name');
    container.scrollTop = container.scrollHeight;
    await getUserRooms()
  }
  else {
    console.log('Message from another group')
    await getUserRooms()
  }
});


const username = localStorage.getItem('username')
const localUser = JSON.parse(localStorage.getItem('user'))
const token = localStorage.getItem('token')
let localMsg = localStorage.getItem('localMsg')
let current_Room_ID = null
let current_Room_Name = null
const container = document.getElementById('main-chat');
const existingUsersUl = document.getElementById('existingUsers')
const adminStatusUl = document.getElementById('adminStatusUl')
let existingUsersArray = []
const sendPMBtn = document.getElementById('sendPMBtn');

//create group modal
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const selectedUsers = document.getElementById('selectedUsers');
const closeBtn = document.getElementById('closeBtn');
const cancelBtn = document.getElementById('cancelBtn');

//add user to group modal
const searchInput1 = document.getElementById('searchInput1');
const searchAddResults = document.getElementById('searchAddResults');
const selectedAddUsers = document.getElementById('selectedAddUsers');
const closeBtn1 = document.getElementById('closeBtn1');
// const cancelBtn1 = document.getElementById('cancelBtn1'); 
const cancelBtn2 = document.getElementById('cancelBtn2');
const cancelBtn3 = document.getElementById('cancelBtn3');
//   for PM modal
const searchInput2 = document.getElementById('searchInput2');
const searchResults2 = document.getElementById('searchResults2');
const cancelBtn4 = document.getElementById('cancelBtn3');
const closeBtn2 = document.getElementById('closeBtn2');
const selectedUserUl = document.getElementById('selectedUser')


let availableUsers = [] //for search person modal 
let selectedUsersArray = []// for keeping the selected users of search modal
let selectedUser = null; //for keeping selected PM user
let selectedAddUsersArray = []  // for keeping the selected users of add users search modal

window.addEventListener("load", async () => {
  try {
    await getUserList();
    await getUserRooms();

    current_Room_ID = localStorage.getItem('current_Room_ID');
    current_Room_Name = localStorage.getItem('current_Room_Name');

    if (current_Room_ID == null || current_Room_Name == null) {
      chat_messages.innerHTML = '';
      createSplashDiv('Please select a conversation');
    } else {
      currentRoomSplash.innerHTML = `${current_Room_Name}`;
      chat_messages.innerHTML = '';
      getMsg(current_Room_ID);
      getRoomUsers(current_Room_ID);
      container.scrollTop = container.scrollHeight;
    }
  } catch (error) {
    console.error('Error in window load event handler:', error);
  }
});

// if(localMsg==null)
//   { 
//     await getMsg()
//   }
// else
//   {
//     //use local files to populate index
//     localMsg = localStorage.getItem('localMsg')
//     parsedLocal = JSON.parse(localMsg)
//     parsedLocal.forEach(msg => {
//       arrayHandler(msg)
//     });
//     last_msg_time=parsedLocal[0].createdAt;
//   }


// Example list of all available users
async function getUserList() {
  try {
    const response = await axios.get(`http://localhost:3000/getUsers/${localUser.id}`);
    availableUsers = response.data.users;
    console.log('List of total availaible users without localUser:', availableUsers)
  }
  catch (error) {
    console.error(error);
    // Handle error scenario
  }
}

//all rooms of localuser
async function getUserRooms() {
  room_list.innerHTML = ''

  //get all rooms corresponding to local user
  const response = await axios.get(`http://localhost:3000/getUserRooms/`, {
    headers: {
      "authorization": token
    }
  })
  if (response.status == 200) {
    room_list_data = response.data.rooms
    console.log('Room list data sorted by activity time:', room_list_data)

  }
  else console.log('Something went wrong: GetRooms')

  room_list_data.forEach(room => {

    if (!room.isPrivate) {
      socket.emit('joinGroupChat', room.id);
      const tr = document.createElement('tr');
      const td1 = document.createElement('td');
      const td2 = document.createElement('td');

      if (room.last_message != null) {
        td1.innerHTML = `${room.name}<br><small>${room.last_message}</small><br>`;
      }
      else {
        td1.innerHTML = `${room.name}`;
      }
      if (room.last_activity != null)
        td2.innerHTML = `<small>${getTime(room.last_activity)}</small>`;
      tr.appendChild(td1);
      tr.appendChild(td2);


      tr.id = room.id
      room_list.appendChild(tr);

      tr.addEventListener('click', () => {
        // Call your function here

        currentRoomSplash.innerHTML = `${room.name}`
        //emit joining to a group here. 
        
        handleRoomClick(tr.id, room.name);
      });

    }
    else {
      socket.emit('joinPrivateChat', room.id);

      const tr = document.createElement('tr');
      const td1 = document.createElement('td');
      const td2 = document.createElement('td');

      const roomNameParts = room.name.split('_');
      const userIds = roomNameParts.slice(1);


      // Assuming you have the localUser variable containing the local user's ID
      const localUserId = localUser.id;

      let otherUserId;

      // Find the user ID that is not the local user's ID
      for (const userId of userIds) {
        if (parseInt(userId) !== localUserId) {
          otherUserId = parseInt(userId);
          break;
        }
      }
      const otherUser = availableUsers.find(user => user.id === otherUserId);
      if (otherUser) {
        const otherUserName = otherUser.fname;
        // console.log('Other User Name:', otherUserName);
        if (room.last_message != null) {
          td1.innerHTML = `${otherUserName}<br><small>${room.last_message}</small><br>`;
        }
        else {
          td1.innerHTML = `${otherUserName}`;
        }
        if (room.last_activity != null)
          td2.innerHTML = `<small>${getTime(room.last_activity)}</small>`;
        tr.appendChild(td1);
        tr.appendChild(td2);

        tr.id = room.id
        room_list.appendChild(tr);

        tr.addEventListener('click', () => {
          // Call your function here
          currentRoomSplash.innerHTML = `${otherUserName}`
          //emit joining to a pvt chat here. 

          handleRoomClick(tr.id, otherUserName);
        });
      }
    }
  })
}

//gets and updates all users in a room - Called when room clicked, and on refresh event with local user stored, on adding users and on remove
async function getRoomUsers(room_ID) {
  try {
    const response = await axios.get(`http://localhost:3000/getRoomUsers/${room_ID}`, {
      headers: {
        "authorization": token
      }
    })
    if (response.status == 201) {
      //clear modal UL 
      existingUsersUl.innerHTML = ''
      adminStatusUl.innerHTML = ''
      existingUsersArray = response.data.roomUsers

      console.log('existing users array: ', existingUsersArray)

      //Populate the existingUsersArray Modal
      existingUsersArray.forEach(user => {
        const li = document.createElement('li');
        li.classList = "list-group-item";
        li.id = user.id;

        const isAdmin = user.isAdmin ? '<i>(admin)</i>' : ''; // Check if user is admin
        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        const userExists = existingUsersArray.find(user => user.id === localUser.id);
        if (userExists.isAdmin && user.id != localUser.id) {
          deleteButton.classList = 'btn-close float-end';
        }
        else {
          deleteButton.classList = 'btn-close float-end disabled';
        }
        deleteButton.addEventListener('click', async () => {
          // Handle delete button click event
          console.log('Delete button clicked for user:', user.id);
          // Add your logic for deleting the user here
          try {
            const response = await axios.delete(`http://localhost:3000/admin/removeUserFromRoom/${room_ID}/${user.id}`, {
              headers: {
                "authorization": token
              }
            })
            if (response.status == 200) {
              alert('User deleted')
              console.log('User deleted')

              const userIndex = existingUsersArray.findIndex(u => u.id === user.id);
              if (userIndex !== -1) {
                existingUsersArray.splice(userIndex, 1);
                console.log('Removed user from array existingUsersArray:', existingUsersArray)
              }

              const liToRemove = document.getElementById(user.id);
              if (liToRemove) {
                existingUsersUl.removeChild(liToRemove);
              }
            }
          }
          catch (err) {
            console.log(err)
          }
        });

        li.innerHTML = `${user.fname} [${user.phone} ; ${user.email}] ${isAdmin}`;
        li.appendChild(deleteButton);

        existingUsersUl.appendChild(li);
      });
      // Populate admin check ul modal
      existingUsersArray.forEach(user => {
        const li = document.createElement('li');
        li.classList = "list-group-item";
        li.id = user.id;

        const adminCheckbox = document.createElement('input');
        adminCheckbox.classList = "float-end"
        adminCheckbox.type = 'checkbox';
        adminCheckbox.checked = user.isAdmin;
        adminCheckbox.addEventListener('change', async () => {
          const newAdminStatus = adminCheckbox.checked;
          await updateAdminStatus(room_ID, user.id, newAdminStatus);
          alert('Success')
          console.log('Admin status changed for user:', user.id);
        });

        li.innerHTML = `${user.fname} [${user.phone} ; ${user.email}]`;
        li.appendChild(adminCheckbox);
        adminStatusUl.appendChild(li)
        // ...
      });


    }
  }
  catch (err) {
    console.log('Something went wrong ', err)
  }
}

//updates the admin status
async function updateAdminStatus(roomId, userId, isAdmin) {
  try {
    const response = await axios.put(`http://localhost:3000/admin/updateAdminStatus/${roomId}/${userId}`, {
      isAdmin: isAdmin
    }, {
      headers: {
        "authorization": token
      }
    });
    if (response.status == 200) {
      console.log('Admin status updated successfully');
      // You can add further logic here if needed
    }
  } catch (error) {
    console.error('Error updating admin status:', error);
    // Handle error as needed
  }
}

//when user clicks on room, this is executed
async function handleRoomClick(roomId, roomName) {//clear message field
  chat_messages.innerHTML = ``

  current_Room_ID = roomId
  current_Room_Name = roomName
  localStorage.setItem('current_Room_ID', roomId)
  localStorage.setItem('current_Room_Name', roomName)

  //get all users of the room and add to modal
  await getRoomUsers(current_Room_ID)

  //get messages corresponding to room =>add last 10 messages to the chat
  await getMsg(current_Room_ID)
  //get all users in the current room

}

// Function to open the search modal and populate the user list
function openModal() {
  // Reset the user list
  searchResults.innerHTML = '';
  // Populate the user list with max 5 top people in availableUsers
  let top5Users = availableUsers.slice(0, 5)
  top5Users.forEach(user => {
    const li = document.createElement('li');
    li.classList = "list-group-item"
    li.id = user.id
    li.innerHTML = `${user.fname} [${user.phone} ; ${user.email}]`
    searchResults.appendChild(li);
  });
}
// Function to close the search modal
function closeModal() {
  searchResults.innerHTML = '';
  selectedUsers.innerHTML = '';
  searchInput.innerHTML = '';
  selectedUsersArray = []
}
// Function to open the add user modal and populate the user list
function openModal1() {

  const userExists = existingUsersArray.find(user => user.id === localUser.id);

  if (userExists && userExists.isAdmin) {
    console.log('Present user is admin')
    addUsersBtn.classList = "btn btn-primary"
    adminBtn.classList = "btn btn-success"
    // Reset the user list
    searchAddResults.innerHTML = '';

    // Populate the user list with max 5 top people in availableUsers
    let top5Users = availableUsers.slice(0, 5)
    top5Users.forEach(user => {
      const li = document.createElement('li');
      li.classList = "list-group-item"
      li.id = user.id
      li.innerHTML = `${user.fname} [${user.phone} ; ${user.email}]`
      searchAddResults.appendChild(li);

    });
  }
  else {
    console.log('Local user not admin')
  }



}
// Function to close the add user modal
function closeModal1() {
  searchAddResults.innerHTML = '';
  selectedAddUsers.innerHTML = '';
  searchInput1.innerHTML = '';
  selectedAddUsersArray = []
}


//search and add to UL
function performSearchTotal(query, ulToAddQuery) {
  // Clear previous search results
  ulToAddQuery.innerHTML = '';
  // Filter availableUsers based on the query
  let matchingUsers = availableUsers.filter(user =>
    user.fname.toLowerCase().includes(query.toLowerCase().trim()) ||
    user.phone.toLowerCase().includes(query.toLowerCase().trim()) ||
    user.email.toLowerCase().includes(query.toLowerCase().trim())

  );
  //if no users found
  if (matchingUsers.length == 0) {
    console.log('No matching users')
    const li = document.createElement('li');
    li.classList = "list-group-item "
    li.id = -1;
    li.innerHTML = 'No matching users'
    ulToAddQuery.appendChild(li);

  }
  else {
    // Display the matching users in the search results
    matchingUsers.forEach(user => {
      const li = document.createElement('li');
      li.classList = "list-group-item"
      li.id = user.id
      li.innerHTML = `${user.fname} [${user.phone} ; ${user.email}]`
      ulToAddQuery.appendChild(li);
      // searchAddResults.appendChild(li)
    });
  }

}


// Event listener for search input keyup
searchInput.addEventListener('keyup', event => {
  const query = event.target.value.trim();
  if (query.length > 0) {
    performSearchTotal(query, searchResults);
  }
});

searchInput1.addEventListener('keyup', event => {
  const query = event.target.value.trim();
  if (query.length > 0) {
    performSearchTotal(query, searchAddResults);
  }
});

searchInput2.addEventListener('keyup', event => {


  const query = event.target.value.trim();
  if (query.length > 0) {
    performSearchTotal(query, searchResults2);
  }
  // check if there is any selected user
  if (selectedUser != null) {
    const searchResultsItems = searchResults2.querySelectorAll('li');
    searchResultsItems.forEach(item => {
      item.classList.add('disabled');
    });
    sendMsgBtn.classList.remove('disabled')

  }
});

// Event delegation for search results click
searchResults.addEventListener('click', event => {
  const li = event.target
  if (li.id == -1) {
    console.log('User clicked:', event.target.id);
    alert('Please enter a valid username, phone, or mail');
    return
  } else {
    const checkExists = selectedUsersArray.some(user => user.id === parseInt(li.id));
    console.log('Same li exists: ', checkExists)

    if (!checkExists) {
      const userIndex = availableUsers.findIndex(user => user.id === parseInt(li.id));
      const user = availableUsers[userIndex]

      availableUsers[userIndex].isSelected = !availableUsers[userIndex].isSelected
      console.log('User clicked:', user);

      if (!li.classList.contains('selected')) {
        li.classList.add('selected');
        addUser(user, selectedUsers, selectedUsersArray);
      } else {
        li.classList.remove('selected');
        removeUser(user, selectedUsers, selectedUsersArray);
        const liToRemove = selectedUsers.querySelector(`li[id="${user.id}"]`);
        if (liToRemove) {
          liToRemove.remove();
        }
      }
    }
    else {
      alert('Already added to list')
      return
    }
  }
});

// Event delegation for search results click
searchAddResults.addEventListener('click', event => {
  const li = event.target
  if (li.id == -1) {
    console.log('User clicked:', event.target.id);
    alert('Please enter a valid username, phone, or mail');
    return
  } else {

    const checkExists = selectedAddUsersArray.some(user => user.id === parseInt(li.id)); //check if present in selected add users array or not
    const alreadyInRoom = existingUsersArray.some(user => user.id === parseInt(li.id)) //check if already present in room 
    console.log('Same li exists: ', checkExists)
    console.log('Already in group: ', alreadyInRoom)

    if (!checkExists && !alreadyInRoom) {
      const userIndex = availableUsers.findIndex(user => user.id === parseInt(li.id));
      const user = availableUsers[userIndex]

      availableUsers[userIndex].isSelected = !availableUsers[userIndex].isSelected
      console.log('User clicked:', user);

      if (!li.classList.contains('selected')) {
        li.classList.add('selected');
        addUser(user, selectedAddUsers, selectedAddUsersArray);
      } else {
        li.classList.remove('selected');
        removeUser(user, selectedAddUsers, selectedAddUsersArray);
        const liToRemove = selectedAddUsers.querySelector(`li[id="${user.id}"]`);
        if (liToRemove) {
          liToRemove.remove();
        }
      }
    }
    else {
      if (checkExists) {
        alert('Already added to list')
        return
      }
      else if (alreadyInRoom) {
        alert('Already present in room')
        return
      }
    }

  }
});

// Event delegation for search results click
searchResults2.addEventListener('click', event => {
  const li = event.target;
  if (li.id == -1) {
    console.log('User clicked:', event.target.id);
    alert('Please enter a valid username, phone, or mail');
    return;
  }

  if (selectedUser) {
    console.log('User already selected');
    return;
  }

  const userIndex = availableUsers.findIndex(user => user.id === parseInt(li.id));
  const user = availableUsers[userIndex];

  // const selectedUserContainer = document.getElementById('selectedUser');

  // Clear previous selection
  selectedUserUl.innerHTML = '';

  if (!li.classList.contains('selected')) {
    li.classList.add('selected');

    // Update the selected user
    selectedUser = user;

    // Create a new <li> element for the selected user
    const selectedUserLi = document.createElement('li');
    selectedUserLi.classList.add('list-group-item');
    selectedUserLi.id = user.id;
    selectedUserLi.innerHTML = `${user.fname} [${user.phone} ; ${user.email}]
    <button type="button" id="deleteBtn" class="btn-close float-end"></button>`;

    // Add click event listener to delete button
    const deleteBtn = selectedUserLi.querySelector('#deleteBtn');
    deleteBtn.addEventListener('click', function () {
      selectedUser = null;
      selectedUserUl.innerHTML = '';

      // Enable selection again
      const searchResultsItems = searchResults2.querySelectorAll('li');
      searchResultsItems.forEach(item => item.classList.remove('disabled'));
      //Enable the send PM button 
      sendMsgBtn.classList.add('disabled')
    });

    // Append the <li> element to the selected user container
    selectedUserUl.appendChild(selectedUserLi);

    //Enable the send PM button 
    sendMsgBtn.classList.remove('disabled')
    // Disable selection of other items
    const searchResultsItems = searchResults2.querySelectorAll('li');
    searchResultsItems.forEach(item => {
      if (item !== li) {
        item.classList.add('disabled');
      }
    });

    console.log('User clicked:', user);
  }
});


function addUser(user, ul, array) {
  const li = document.createElement('li');
  li.id = user.id;
  li.classList = "list-group-item"
  li.innerHTML = `${user.fname} [${user.phone} ; ${user.email}]
  <button type="button" id="deleteBtn" class="btn-close float-end"></button>`;

  array.push(user);
  console.log('After adding user, current array:', array);

  const deleteBtn = li.querySelector('.btn-close');

  deleteBtn.addEventListener('click', function () {
    const index = array.indexOf(user);
    if (index !== -1) {
      array.splice(index, 1);
    }
    console.log('After removing user, selectedUserArray:', array);
    li.remove();
  });

  ul.appendChild(li);
}

function removeUser(user, ul, array) {
  const liToRemove = ul.querySelector(`li[id="${user.id}"]`);

  if (liToRemove) {
    const index = array.indexOf(user);
    liToRemove.remove();
    if (index !== -1) {
      array.splice(index, 1);
    }
    console.log('After removing user, selectedUserArray:', array);
  }
}
// send new private message button (top left)
sendPMBtn.addEventListener("click", function () {

  // Reset the user list
  searchResults2.innerHTML = '';
  // Populate the user list with max 5 top people in availableUsers
  let top5Users = availableUsers.slice(0, 5)

  top5Users.forEach(user => {
    const li = document.createElement('li');
    li.classList = "list-group-item"
    li.id = user.id
    li.innerHTML = `${user.fname} [${user.phone} ; ${user.email}]`
    searchResults2.appendChild(li);
  });
  // Toggle the modal when the SVG icon is clicked
  var modal = new bootstrap.Modal(document.getElementById("sendPMModal"));
  modal.toggle();
});

// Event listener for createGroupBtn click
createGroupBtn.addEventListener('click', openModal);
// Event listener for view users click
viewUsersBtn.addEventListener('click', openModal1);
// Event listener for cancelBtn click
cancelBtn.addEventListener('click', closeModal);
cancelBtn2.addEventListener('click', closeModal1);
cancelBtn3.addEventListener('click', () => {
  adminStatusUl.innerHTML = ''
});

cancelBtn4.addEventListener("click", function () {
  searchResults2.innerHTML = '';
  searchInput2.innerHTML = '';
});


closeBtn.addEventListener('click', closeModal);
closeBtn1.addEventListener('click', closeModal1);
closeBtn2.addEventListener("click", function () {
  searchResults2.innerHTML = '';
  searchInput2.innerHTML = '';
});
// function for when create group clicked ---> Call the create room API for public room to create the chat room                                     
async function createGroup(e) {
  e.preventDefault();
  const roomName = document.getElementById('roomNameInput').value;
  if (roomName.trim().length > 0) {
    console.log('Room Name:', roomName)

    selectedUsersArray.unshift(localUser)//Finally add the local user
    if (selectedUsersArray.length >= 2) {
      // Perform further processing with the selected users
      console.log('Final selected list of users to create a new group with before API call: ', selectedUsersArray)

      //Backend call to API
      const response = await axios.post(`http://localhost:3000/createRoom/${roomName}`, {
        selectedUserList: selectedUsersArray
      })

      if (response.status == 200) {
        const room_ID = response.data.roomId
        console.log('Room ID for newly created room', room_ID)
        await getUserRooms()
        alert('Room Created')
        //Create a splash for new group and a list of all participants, uptil 10 people and say ....and x other people for the remaining ones. 
        if (selectedUsersArray.length > 4) {
          // Display message for more than 5 people
          const message = `Created room "${roomName}" with users: ${selectedUsersArray[0].fname}, ${selectedUsersArray[1].fname},
              ${selectedUsersArray[2].fname}, ${selectedUsersArray[3].fname}, and ${selectedUsersArray.length - 4} other people`;

          await axios.post('http://localhost:3000/newConnection', { message, roomId: room_ID }, { headers: { "authorization": token } });

          createSplashDiv(message);
        }

        else {
          // Display message for 2 to 4 people
          const participants = selectedUsersArray.map(user => user.fname).join(", ");
          const message = `Created room "${roomName}" with users: ${participants}`;

          await axios.post('http://localhost:3000/newConnection', { message, roomId: room_ID }, { headers: { "authorization": token } });

          createSplashDiv(message);
        }
        window.location.reload()
        // Close the modal
        const createGroupModal = document.getElementById('createGroupModal');
        const modal = bootstrap.Modal.getInstance(createGroupModal);
        modal.hide();
        closeModal();
      }
      else {
        alert('Something went wrong ')
      }
    }

    else {
      alert('Please select at least one user')
    }
  }
  else {
    alert('Please enter room name')
  }

};

async function sendPM(e) {
  e.preventDefault()
  //some logic to handle existing Private room required
  try {
    const response = await axios.post(`http://localhost:3000/createPrivateRoom/${selectedUser.id}`, { selectedUser }, {
      headers: {
        'authorization': token
      }
    })
    if (response.status == 200) {
      console.log(response.data.roomId)
      alert('Created new private room')
    }
    else if (response.status == 201) {
      console.log(response.data.roomId)
      alert('Already exists')
    }
  }
  catch (err) {
    console.log('error', err)
    // throw new Error(err)
  }
}

//function to add users to group
async function addUsers(e) {
  e.preventDefault()
  try {
    const response = await axios.post(`http://localhost:3000/admin/addUsersToRoom/${current_Room_ID}/`, { selectedAddUsersArray }, {
      headers: {
        'authorization': token
      }
    });
    if (response.status == 200) {
      console.log('Successfully added users to group', response.data.results)
      alert('Added users to group')
      await getRoomUsers(current_Room_ID)
      closeBtn1.click()
    }
  }
  catch (err) {
    console.log('Something went wrong in adding users:', err)
  }
}


//if local storage there, update the last_msg_time accordingly
if (localMsg != null) {
  last_msg_time = JSON.parse(localMsg)[0].createdAt;
  console.log('Last seen from LocalStorage: ', last_msg_time)
}

if (!username) {
  alert('Logged out')
  window.location.href = '/login'
}



// setInterval(async()=>{
//   await updateMsg()

//   //Check periodically for local storage updates and keep length to given param
//   const allowedItems=12
//   localMsg = localStorage.getItem('localMsg')
//   parsedLocal = JSON.parse(localMsg)
//   if(parsedLocal.length>0)
//   { console.log('mod local storage in setinterval')
//     while(parsedLocal.length>allowedItems)
//     {
//       parsedLocal.pop() 
//     }
//     const strLocal = JSON.stringify(parsedLocal)
//     localStorage.setItem('localMsg',strLocal)
//     last_msg_time=parsedLocal[0].createdAt //update last_msg_time with latest offline message

//   }
// },2000000)


// function getting all messages for a particular room 
async function getMsg(clickedRoom) {
  console.log('RoomID clicked:', clickedRoom)
  const response = await axios.post('http://localhost:3000/getMessages', {
    roomId: clickedRoom
  },
    {
      headers: {
        "authorization": token
      }
    });
  let allMsg = response.data.allMsg; //get all messages 
  // console.log('Messages in clicked room:',allMsg)
  // iterate over the allMsg array and display the messages
  if (allMsg.length > 0) {
    allMsg.forEach(msg => {
      arrayHandler(msg, false) //boolean parameter to check if to add message to bottom most position(for new messages)
    });
    last_msg_time = allMsg[0].createdAt;
    localStorage.setItem('localMsg', JSON.stringify(allMsg))

  }
  container.scrollTop = container.scrollHeight;
  // else
  // {
  //   createSplashDiv('Start the conversation',true)
  // }
}

//on entering a chat by user
// async function chatmsg(e)
// {
//   e.preventDefault()
//   const msg = e.target.message.value
//   console.log(msg)
//   alert(msg)
//   // const response = await axios.post('http://localhost:3000/postMessage',{message:msg,roomId:current_Room},{headers:{"authorization":token}})
//   // let entry = response.data.entry
//   // console.log(msg)
//   e.target.message.value = ""
//   // updateMsg() //Calling updatemsg here instead of creating div
//   // createSendDiv(msg,entry.createdAt,true)
//   // localStorage.setItem('localMsg',JSON.stringify(localMsg.reverse().push(entry).reverse()))
//   // last_msg_time=entry.createdAt

//   // window.location.reload()
// }

//updating the current messages. 
async function updateMsg() {
  console.log(current_Room_ID)
  // returns an array of objects in desc:createdAt
  const response = await axios.post('http://localhost:3000/getUpdatedMessages', { last_msg_time, current_Room }, {
    headers: {
      "authorization": token
    }
  });
  const updateMsg = response.data.updateMsg
  if (updateMsg.length > 0) {  //if there are any updates, update the local storage and add it in required order. 
    const updateLocal = JSON.parse(localStorage.getItem('localMsg'))
    updateLocal.reverse()
    updateMsg.reverse()

    updateMsg.forEach(msg => {
      updateLocal.push(msg)
    })
    //updated properly considering rtl layout
    localStorage.setItem('localMsg', JSON.stringify(updateLocal.reverse()))

    updateMsg.reverse().forEach(update => {
      arrayHandler(update, true)
    });
    last_msg_time = updateMsg[0].createdAt;//finally update last message time for client
  }
}

//creates divs according to given array items
function arrayHandler(array_item, add_location_bottom) {
  if (array_item.isIntro) {
    createSplashDiv(array_item.text)

  }
  else {
    if (array_item.username == username) {
      createSendDiv(array_item.text, array_item.createdAt, add_location_bottom)
    }
    else {
      createRecDiv(array_item.text, array_item.createdAt, array_item.username, add_location_bottom)
    }
  }

}

//send Div creation 
function createSendDiv(data, time, name, newcheck) {
  const tr = document.createElement('tr');
  tr.classList = 'message_sent';
  const td1 = document.createElement('td');
  const td2 = document.createElement('td');
  td1.classList = "col-10"
  td2.classList = "col-2"
  td1.innerHTML = `
    <p class="bg-primary p-2 mt-2 mr-2 mb-2 text-white float-end rounded shadow">
      ${data}
    </p>
  `;
  td2.innerHTML = `
    <p class="p-1 mt-2 mb-2 mr-3 shadow-sm float-end rounded-3">
      <small>${getTime(time)}</small>
    </p>
  `;

  tr.appendChild(td1);
  tr.appendChild(td2);
  chat_messages.appendChild(tr);

  // if(newcheck)
  // {
  //   chat_messages.insertBefore(new_msg, chat_messages.firstChild);

  // }
  // else
  // {
  //   chat_messages.appendChild(new_msg) 
  // }

}

//recc Div creation 
function createRecDiv(data, time, name, newcheck) {
  const tr = document.createElement('tr');
  tr.classList = 'message_rec';
  const td1 = document.createElement('td');
  const td2 = document.createElement('td');
  td1.classList = "col-10"
  td2.classList = "col-2"
  td1.innerHTML = `
  <p class="bg-success p-2 mt-2 mr-5 text-white float-start rounded shadow">
    <span style="font-size: small; font-style: italic">>. ${name}</span><br>
    ${data}
  </p>
`;
  td2.innerHTML = `
    <p class="p-1 mt-2 mr-3 shadow-sm float-end rounded-3">
      <small>${getTime(time)}</small>
    </p>
  `;
  tr.appendChild(td1);
  tr.appendChild(td2);
  chat_messages.appendChild(tr)

  // if(newcheck)
  // {
  //   chat_messages.insertBefore(new_msg, chat_messages.firstChild);

  // }
  // else
  // {
  //   chat_messages.appendChild(new_msg) 
  // }

}
//create welcome message 
function createSplashDiv(data) {
  const tr = document.createElement('tr');
  tr.classList = 'message_splash ';

  const td = document.createElement('td');
  // td.colSpan = '2';
  td.style.display = 'flex';
  td.style.justifyContent = 'center';
  td.innerHTML = `
    <div class="bg-secondary splash text-center rounded-3 text-white shadow-sm">
      <p class="splash-text m-1 p-1 "><small> ${data} </small></p>
    </div>
  `;

  tr.appendChild(td);
  chat_messages.appendChild(tr);
}


//better time format
function getTime(time) {
  const date = new Date(time)
  const timeString = date.toLocaleTimeString('en-US', { hour12: true })
  const timeWithoutSeconds = timeString.replace(/:\d{2}\s/, ' ')
  return timeWithoutSeconds
}

//implement logout
function logout(e) {
  e.preventDefault()
  localStorage.clear();
  alert('Logged out successfully')
  window.location.href = 'login.html'
}

//add the open close event for the menu 3 dot button, 
// document.addEventListener("DOMContentLoaded", function() {


//   menuTrigger.addEventListener("click", function() {
//     menuContent.style.display = menuContent.style.display === "none" ? "block" : "none";
//   });
// });
chatBtn.addEventListener('click', function (event) {
  event.preventDefault(); // Prevent any default click behavior
  submitForm();
});
chatForm.addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent the default form submission

  // Call your form submission function here
  submitForm();
});

// Add click event listener
async function submitForm() {

  // Get the chat form and message input
  const chatForm = document.querySelector('#chat-form');
  const messageInput = document.querySelector('#message');

  // Perform your form submission logic or custom actions here
  // For example, you can retrieve the input value and send it via AJAX

  const message = messageInput.value.trim();
  console.log('Submitted message:', message);

  if (message.length == 0) {
    alert('Please enter a message')
    return
  }
  try {
    const response = await axios.post('http://localhost:3000/postMessage', { message, roomId: current_Room_ID }, { headers: { "authorization": token } })
    if (response.status == 200)
      console.log('Message posted to server')
    // Reset the form after submission
    messageInput.value = '';
    // chat_messages.innerHTML=''
    // await getMsg(current_Room_ID)
    const sendTime = new Date()
    const data = { current_Room_ID, message, sendTime };
    socket.emit('sendMessage', data);

    createSendDiv(message, sendTime)
    container.scrollTop = container.scrollHeight;
    // const roomId = current_Room_ID// Obtain the room ID
    // const updatedAt = new Date(); // Current timestamp
    // const response1 = await axios.put(`http://localhost:3000/updateRoom/${roomId}`, { updatedAt });

    // if (response1.status === 200) {
    //   // Room updated successfully
    //   console.log('Room updated');
    // } else {
    //   // Handle update failure
    //   console.log('Room update failed');
    // }
  }
  catch (err) {
    console.log('Error sending message', err)
  }
  await getUserRooms()
  // window.location.reload()

}
