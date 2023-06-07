
let first_msg_time = null//stores the last message time of selected room after api call. 
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
//Socket config
const socket = io('http://localhost:3000')

socket.on('connect', () => {
  socket.userId = parseInt(localUser.id)
  console.log('connected socket, uID:', socket.userId)
})
// Event listener for incoming messages
socket.on('newMessage', async (data) => {
  // Update the chat window with the new message
  console.log('Received a new message:', data);
  const { isMedia, isIntro } = data;

  if (!isMedia) {
    const { message, time, userName, roomId } = data;

    if (!isIntro) {
      if (parseInt(current_Room_ID) == roomId) {
        console.log('Same room');
        createRecDiv(message, time, userName);
        container.scrollTop = container.scrollHeight;
      } else {
        console.log('Message from another group');
      }
    }
    else if (isIntro) {
      if (parseInt(current_Room_ID) == roomId) {
        createSplashDiv(message, false)
        container.scrollTop = container.scrollHeight;
      }
      else {
        console.log('Message from another group');
      }
    }

  }
  else if (isMedia) {
    const { message, time, userName, roomId, fileType } = data;

    if (parseInt(current_Room_ID) == roomId) {
      console.log('Same room');
      createRecDiv(message, time, userName, true, fileType);
      container.scrollTop = container.scrollHeight;
    } else {
      console.log('Message from another group');
    }
  }
  await getUserRooms();
  active_Swap();

});

//upload progress
socket.on('uploadProgress', (data) => {
  const progress = data.progress;
  // Update your UI or perform actions based on the progress value
  console.log(`Upload progress: ${progress}%`);

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
const loadingIcon = document.getElementById('loadingIcon');

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
      return
    } else {
      currentRoomSplash.innerHTML = `${current_Room_Name}`;
      chat_messages.innerHTML = '';
      getMsg(current_Room_ID);
      getRoomUsers(current_Room_ID);
      active_Swap()

      container.scrollTop = container.scrollHeight;
      return
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
  room_list_data.forEach(room => populateRoomList(room))
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
          if (confirm('Remove user from group?')) {
            try {
              const response = await axios.delete(`http://localhost:3000/admin/removeUserFromRoom/${room_ID}/${user.id}/${user.fname}`, {
                headers: {
                  "authorization": token
                }
              })
              if (response.status == 200) {
                alert('User deleted')
                console.log('User deleted')

                //emit message
                const message = response.data.message
                const sendTime = new Date()
                const data = { room_ID, message, sendTime, userName: localUser.fname, isIntro: true };
                socket.emit('sendMessage', data);

                createSplashDiv(message, false)
                container.scrollTop = container.scrollHeight;

                //disconnect the socket from the room??


                const userIndex = existingUsersArray.findIndex(u => u.id === user.id);
                if (userIndex !== -1) {
                  existingUsersArray.splice(userIndex, 1);
                  console.log('Removed user from array existingUsersArray:', existingUsersArray)
                }

                const liToRemove = document.getElementById(user.id);
                if (liToRemove) {
                  existingUsersUl.removeChild(liToRemove);
                }

                await getUserRooms()
                active_Swap()
              }
            }
            catch (err) {
              console.log(err)
            }
          }
          // Add your logic for deleting the user here

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

  active_Swap()

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

// Event delegation for add users results click
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

// Event delegation for send PM results click
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
  selectedUser = null
  selectedUserUl.innerHTML = ''
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
        selectedUserList: selectedUsersArray,
      })

      if (response.status == 200) {
        const room_ID = response.data.roomId
        console.log('Room ID for newly created room', room_ID)
        alert('Room Created')
        //Join the creator to the new room socket
        // socket.join(room_ID)

        await getUserRooms()
        // await getRoomUsers(room_ID)
        active_Swap()
        // Close the modal
        const createGroupModal = document.getElementById('createGroupModal');
        const modal = bootstrap.Modal.getInstance(createGroupModal);
        modal.hide();
        closeModal();
        //emit message
        const message = response.data.msg
        const sendTime = new Date()
        const data = { current_Room_ID, message, sendTime, userName: localUser.fname, isIntro: true };
        socket.emit('sendMessage', data);

        createSplashDiv(message, false)
        container.scrollTop = container.scrollHeight;
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

async function newPvtChat(e) {
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
      // alert('Created new private room')
      closeBtn2.click()
      await getRoomUsers(response.data.roomId)
      await getUserRooms()
      const tbody = document.getElementById("room_list")
      const lastTr = tbody.lastElementChild;
      lastTr.click()
      return
    }
    else if (response.status == 201) {
      const roomId = response.data.roomId;
      const tr = document.querySelector(`#room_list tr[id='${roomId}']`);
      closeBtn2.click()
      tr.click();
      return
      // alert('Already exists');
    }
    closeBtn2.click()
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
      //emit message
      const message = response.data.message
      const sendTime = new Date()
      const data = { current_Room_ID, message, sendTime, userName: localUser.fname, isIntro: true };
      socket.emit('sendMessage', data);
      socket.emit('joinGroupChat', current_Room_ID)
      createSplashDiv(message, false)
      container.scrollTop = container.scrollHeight;

      await getUserRooms()
      await getRoomUsers(current_Room_ID)
      active_Swap()
      // createSplashDiv(response.data.message)
      closeBtn1.click()
    }
  }
  catch (err) {
    console.log('Something went wrong in adding users:', err)
  }
}

if (!username) {
  alert('Logged out')
  window.location.href = '/login'
}

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
  first_msg_time = response.data.firstMsgTime
  console.log('Last msg time for selected group: ', getTime(first_msg_time))

  // iterate over the allMsg array and display the messages
  if (allMsg.length > 0) {
    allMsg.forEach(msg => {
      arrayHandler(msg, false)
    });
    localStorage.setItem('localMsg', JSON.stringify(allMsg))
  }
  if (container.scrollHeight > 10)
    container.scrollTop = container.scrollHeight;
}

container.addEventListener('scroll', async () => {
  if (container.scrollTop === 0) {
    lastMsg = chat_messages.firstElementChild
    // User has scrolled to the top, load more messages
    if (lastMsg)
      await loadMoreMessages(lastMsg);
  }
});

async function loadMoreMessages(lastMsg) {

  const response = await axios.post('http://localhost:3000/getOldMessages', {
    roomId: current_Room_ID,
    first_msg_time
  },
    {
      headers: {
        "authorization": token
      }
    });
  let oldMsg = response.data.oldMsg; //get all messages 
  if (oldMsg.length > 0) {
    console.log('oldMsg:', oldMsg)
    oldMsg.forEach(msg => {
      arrayHandler(msg, true)
    })
    first_msg_time = oldMsg[oldMsg.length - 1].createdAt
    console.log('After updating old msg, first msg time:', getTime(first_msg_time))
    lastMsg.scrollIntoView();
  }
  else {
    console.log('No older messages')
  }



}
//creates divs according to given array items
function arrayHandler(array_item, isOld) {

  if (array_item.isIntro) {
    createSplashDiv(array_item.text, isOld)
  }
  else if (array_item.isMedia) {
    if (array_item.username == username) {
      createSendDiv(array_item.alt, array_item.createdAt, true, array_item.fileType, isOld)
    }
    else {
      createRecDiv(array_item.alt, array_item.createdAt, array_item.username, true, array_item.fileType, isOld)
    }
  }
  else {
    if (array_item.username == username) {
      createSendDiv(array_item.text, array_item.createdAt, false, null, isOld)
    }
    else {
      createRecDiv(array_item.text, array_item.createdAt, array_item.username, false, null, isOld)
    }

  }



}

//send Div creation 
function createSendDiv(data, time, isMedia, fileType, isOld) {
  const tr = document.createElement('tr');
  tr.classList = 'message_sent';
  const td1 = document.createElement('td');
  const td2 = document.createElement('td');
  td1.classList = "col-10"
  td2.classList = "col-2"
  const messageElement = document.createElement('p');
  messageElement.classList = 'bg-primary p-2 mt-2 mr-2 mb-2 text-white float-end rounded shadow';

  if (isMedia && fileType.startsWith('image/')) {
    const imageElement = document.createElement('img');
    imageElement.src = `https://storage.googleapis.com/gca_files/${data}`; // Replace with your GCS bucket URL
    imageElement.classList = 'sent-image fit-image float-end';
    messageElement.appendChild(imageElement);
  }
  else if (isMedia && fileType.startsWith('video/')) {
    const videoElement = document.createElement('video');
    videoElement.src = `https://storage.googleapis.com/gca_files/${data}`;
    videoElement.controls = true;
    videoElement.classList = 'sent-video fit-video float-end';
    messageElement.appendChild(videoElement);
  }
  else {
    if (isMedia) {
      const fileLinkElement = document.createElement('a');
      fileLinkElement.href = `https://storage.googleapis.com/gca_files/${data}`;
      fileLinkElement.classList = 'text-white small fst-italic';
      fileLinkElement.textContent = data;
      messageElement.appendChild(fileLinkElement);
    }
  }

  if (!isMedia) {
    messageElement.textContent = data;
  }
  td1.appendChild(messageElement);
  td2.innerHTML = `
    <p class="p-1 mt-2 mb-2 mr-3 shadow-sm float-end rounded-3">
      <small>${getTime(time)}</small>
    </p>
  `;

  tr.appendChild(td1);
  tr.appendChild(td2);
  if (!isOld) {
    chat_messages.appendChild(tr);
  }
  else if (isOld) {
    const firstRow = container.querySelector('tr:first-child');
    chat_messages.insertBefore(tr, firstRow)
  }
}

//recc Div creation 
function createRecDiv(data, time, name, isMedia, fileType, isOld) {

  const tr = document.createElement('tr');
  tr.classList = 'message_rec';
  const td1 = document.createElement('td');
  const td2 = document.createElement('td');
  td1.classList = "col-10"
  td2.classList = "col-2"

  const messageElement = document.createElement('p');
  messageElement.classList = 'bg-success p-2 mt-2 mr-5 text-white float-start rounded shadow';

  const nameElement = document.createElement('span');
  nameElement.style = 'font-size: small; font-style: italic';
  nameElement.textContent = `>. ${name}`;

  messageElement.appendChild(nameElement);
  messageElement.appendChild(document.createElement('br'));

  if (isMedia && fileType.startsWith('image/')) {
    const imageElement = document.createElement('img');
    imageElement.src = `https://storage.googleapis.com/gca_files/${data}`;
    imageElement.classList = 'received-image fit-image float-start';
    messageElement.appendChild(imageElement);
  }
  else if (isMedia && fileType.startsWith('video/')) {
    const videoElement = document.createElement('video');
    videoElement.src = `https://storage.googleapis.com/gca_files/${data}`;
    videoElement.controls = true;
    videoElement.classList = 'received-video fit-video float-start';
    messageElement.appendChild(videoElement);
  }
  else if (isMedia) {
    const fileLinkElement = document.createElement('a');
    fileLinkElement.href = `https://storage.googleapis.com/gca_files/${data}`;
    fileLinkElement.classList = 'text-white small fst-italic';
    fileLinkElement.textContent = data;
    messageElement.appendChild(fileLinkElement);
  }
  if (!isMedia) {
    messageElement.textContent = data;
  }
  td1.appendChild(messageElement);

  td2.innerHTML = `
    <p class="p-1 mt-2 mr-3 shadow-sm float-end rounded-3">
      <small>${getTime(time)}</small>
    </p>
  `;
  tr.appendChild(td1);
  tr.appendChild(td2);
  if (!isOld) {
    chat_messages.appendChild(tr);
  }
  else if (isOld) {
    const firstRow = container.querySelector('tr:first-child');
    chat_messages.insertBefore(tr, firstRow)
  }
}

//create welcome message 
function createSplashDiv(data, isOld) {
  const tr = document.createElement('tr');
  tr.classList = 'message_splash ';

  const td = document.createElement('td');
  // td.colSpan = '2';
  td.style.display = 'flex';
  td.style.justifyContent = 'center';
  td.innerHTML = `
    <div class="bg-secondary splash text-center rounded-3 text-white shadow-sm">
      <p class="splash-text m-1 p-1 "><small><i> ${data}</i> </small></p>
    </div>
  `;

  tr.appendChild(td);
  if (!isOld) {
    chat_messages.appendChild(tr);
  }
  else if (isOld) {
    const firstRow = container.querySelector('tr:first-child');
    chat_messages.insertBefore(tr, firstRow)
  }
}

//fill room list with provided room entry
function populateRoomList(room) {
  if (!room.isPrivate) {
    socket.emit('joinGroupChat', room.id);
    const tr = document.createElement('tr');
    tr.className = "table"
    const td1 = document.createElement('td');
    td1.classList = 'col-10 table-row'
    const td2 = document.createElement('td');

    if (room.last_message != null) {
      if (localUser.id == room.last_userId)
        td1.innerHTML = `${room.name}<br><small>You: ${room.last_message}</small><br>`;
      else
        td1.innerHTML = `${room.name}<br><small><i>~${room.last_userName}</i>: ${room.last_message}</small><br>`;
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
    tr.className = "table"
    const td1 = document.createElement('td');
    td1.classList = 'col-10  table-row'
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
        if (room.last_userId == localUser.id)
          td1.innerHTML = `${otherUserName}<br><small>You: ${room.last_message}</small><br>`;
        else
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

//swap active room
function active_Swap() {
  const trElements = document.querySelectorAll('#room_list tr');
  trElements.forEach((trElement) => {
    const roomId = parseInt(trElement.id);

    // Toggle the active class based on the room ID
    if (roomId == parseInt(current_Room_ID)) {
      trElement.className = "table-active"
    }
    else {
      trElement.className = "table"
    }
  });
}

chatBtn.addEventListener('click', function (event) {
  event.preventDefault();
  submitForm();
});
chatForm.addEventListener('submit', function (event) {
  event.preventDefault();
  submitForm();
});

// Add click event listener
async function submitForm() {

  const messageInput = document.querySelector('#message');
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
    //emit the message 
    const sendTime = new Date()
    const data = { current_Room_ID, message, sendTime, userName: localUser.fname, isIntro: false };
    socket.emit('sendMessage', data);

    createSendDiv(message, sendTime)
    container.scrollTop = container.scrollHeight;
  }
  catch (err) {
    console.log('Error sending message', err)
  }
  await getUserRooms()
  active_Swap()
}


// const form = document.getElementById('uploadForm');
const fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', uploadBucket);

//first ul to cloud
async function uploadBucket() {
  const file = fileInput.files[0];
  console.log(file);
  if (file) {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'video/mp4'];
    const maxFileSize = 10 * 1024 * 1024; // 10MB

    // Validate file type and size
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Please upload a PDF, image, or video file.');
      return;
    }

    if (file.size > maxFileSize) {
      alert('File size exceeds the maximum limit of 10MB.');
      return;
    }
    const uniqueId = Date.now(); // Generate a unique identifier (e.g., timestamp)
    const fileName = `${uniqueId}_${file.name}`; // Append the unique identifier to the file name

    const formData = new FormData();
    formData.append('file', file, fileName);

    // Show progress bar

    loadingIcon.style.display = 'block';

    try {
      const response = await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        // File uploaded successfully, update UI or perform further actions
        alert('File uploaded successfully!');

        //after cloud upload successful, sync details with db
        await postFile(fileName, file.type)
        //emit the message 
        const sendTime = new Date()
        const data = { current_Room_ID, message: fileName, sendTime, userName: localUser.fname, fileType: file.type };
        socket.emit('mediaUploaded', data);
        createSendDiv(fileName, sendTime, true, file.type);
        container.scrollTop = container.scrollHeight;

      } else {
        alert('Failed to upload file. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('An error occurred while uploading the file.');
    } finally {
      // Hide progress bar
      loadingIcon.style.display = 'none';
      await getUserRooms()
      active_Swap()
    }
  }
  else {
    alert('No file available')
    return
  }

}
//after cloud upload=>upload file details to server
async function postFile(fileName, fileType) {

  try {
    const response = await axios.post('http://localhost:3000/postFile', { message: "media", roomId: current_Room_ID, alt: fileName, fileType: fileType }, { headers: { "authorization": token } })
    if (response.status == 200)
      return
  }
  catch (err) {
    console.log(err)
  }


}