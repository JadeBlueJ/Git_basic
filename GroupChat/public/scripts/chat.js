let last_msg_time=null
const chat_messages=document.getElementById('chat-messages')
let room_list = document.getElementById('room-list')
// const createGroupBtn = document.getElementById('createGroupBtn')
const username = localStorage.getItem('username')
const localUser = JSON.parse(localStorage.getItem('user'))
const token = localStorage.getItem('token')
let localMsg = localStorage.getItem('localMsg') 
let current_Room = localStorage.getItem('current_Room') 
const createGroupBtn = document.getElementById('createGroupBtn');
const modal = document.getElementById('modal');

const createBtn = document.getElementById('createBtn');
const cancelBtn = document.getElementById('cancelBtn');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const selectedUsers = document.getElementById('selectedUsers');

let availableUsers=[] //for search person modal 

// Example list of available users
async function getUserList()
{
  try {
    const response = await axios.get(`http://localhost:3000/getUsers/${localUser.id}`);
    availableUsers = response.data.users;
    console.log('List of total availaible users without localUser:', availableUsers)
    // // Process the user data
    // availableUsers.forEach(user => {
    //   // Access the user properties (e.g., user.fname, user.phone)
    //   console.log(user.id, user.fname, user.phone);
    //   // Perform further processing or rendering of the user data
    // });
  } 
  catch (error) {
  console.error(error);
  // Handle error scenario
  }
}


async function getUserRooms()
{ room_list.innerHTML=''
  let room_list_data =null
  //get all rooms corresponding to local user
  const response = await axios.get(`http://localhost:3000/getUserRooms/`,{
    headers:{
    "authorization":token
    }
  })
  if(response.status==200) 
  {
    // console.log(response.data.rooms)
   room_list_data = response.data.rooms
  }
  else console.log('Something went wrong: GetRooms')

  room_list_data.forEach(room=>{
    // console.log(room)
    const li = document.createElement('li')
    li.id = room.id
    li.innerHTML=`${room.name}`

    li.addEventListener('click', () => {
      // Call your function here

      handleRoomClick(li.id);
    });
    room_list.appendChild(li)
  })
}



async function handleRoomClick(roomId)
{//clear message field
  chat_messages.innerHTML=''
  current_Room=roomId
  localStorage.setItem('current_Room',roomId)
  
  //get messages corresponding to room
  await getMsg(current_Room)
  //add messages to the chat
}


// Function to open the modal and populate the user list
function openModal() {
  // Reset the user list
  searchResults.innerHTML = '';

  // Populate the user list with max 5 top people in availableUsers
  let top5Users = availableUsers.slice(0,5)
  top5Users.forEach(user => {
    const li = document.createElement('li');
    li.id=user.id
    li.innerHTML = `${user.fname} (${user.phone})`;
    searchResults.appendChild(li);
  });

  // Show the modal
  modal.style.display = 'block';
}

// Function to close the modal
function closeModal() {
  modal.style.display = 'none';
  searchResults.innerHTML='';
  selectedUsers.innerHTML='';
  searchInput.innerHTML='';
}


function performSearch(query) {
  // Clear previous search results
  searchResults.innerHTML = '';

  // Filter availableUsers based on the query
  const matchingUsers = availableUsers.filter(user =>
    user.fname.toLowerCase().includes(query.toLowerCase().trim()) ||
    user.phone.toLowerCase().includes(query.toLowerCase().trim())
  );

  if(matchingUsers.length==0)
  { console.log('No matching users')
    const li = document.createElement('li');
    li.id=-1;
    li.innerHTML ='No matching users'
    searchResults.appendChild(li);
  }

  // Display the matching users in the search results
  matchingUsers.forEach(user => {
    const li = document.createElement('li');
    li.id=user.id
    li.innerHTML = `${user.fname} (${user.phone})`
    searchResults.appendChild(li);
  });
}


function addUser(user) {
  const li = document.createElement('li');
  li.id=user.id
  li.innerHTML = `${user.fname} (${user.phone})
  <span class="deleteBtn">X</span>
  `;  
  const deleteBtn = li.querySelector('.deleteBtn');
  deleteBtn.addEventListener('click', function() {
    li.remove();
  });

  selectedUsers.appendChild(li);
}

function removeUser(user) {
  const liToRemove = Array.from(selectedUsers.getElementsByTagName('li')).find(
    li => li.id === user.id
  );

  if (liToRemove) {
    liToRemove.remove()
  }
}


// Event listener for search input keyup
searchInput.addEventListener('keyup', event => {
  const query = event.target.value.trim();
  if(query.length>0)
  {
    performSearch(query);
  }
  // else{
  //   searchResults.innerHTML=''
    
  // }
});

// Event delegation for search results click
searchResults.addEventListener('click', event => {
  if (event.target.id == -1) {
    // Click event logic here
    console.log('User clicked:', event.target.id);
    alert('Please enter a valid username or phone number')
  }
  else{
    const li = event.target;
    const userId = li.id;
    const extractedName = li.textContent.split(' (')[0];
    const extractedPhone = li.textContent.split(' (')[1].slice(0, -1); 
    const user= { id:userId, fname:extractedName , phone:extractedPhone}
  
    if (!li.classList.contains('selected')) {
      li.classList.add('selected');
      addUser(user);
    } else {
      li.classList.remove('selected');
      removeUser(user);
    }
  }

});

// Event listener for createGroupBtn click
createGroupBtn.addEventListener('click', openModal);
// Event listener for cancelBtn click
cancelBtn.addEventListener('click', closeModal);

// Event listener for createBtn click ---> Here we extract the required data from the li elements, Call the create room API for public room to create the chat room                                     
document.getElementById('createGroupForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const roomName = document.getElementById('roomNameInput').value;
    console.log('Room Name:', roomName);

    const selectedUserList = Array.from(selectedUsers.getElementsByTagName('li')).map(li => {
      const name = li.childNodes[0].textContent.split(' (')[0];
      const id = parseInt(li.id);
      const phone = li.childNodes[0].textContent.trim().split(' (')[1].slice(0, -1); 
      return { id, name, phone };
    });;

  selectedUserList.unshift({id:localUser.id,name:localUser.fname,phone:localUser.phone})//Finally add the local user
  // Perform further processing with the selected users
    console.log('Final selected list of users to create a new group with: ',selectedUserList)
    //Backend call to API
    const response = await axios.post(`http://localhost:3000/createRoom/${roomName}`,{
      selectedUserList: selectedUserList
    })

    if(response.status==200) 
    { 
      const room_ID = response.data.roomId
      console.log('Room ID for newly created room',room_ID)
      await getUserRooms()
      alert('Room Created')
      //Create a splash for new group and a list of all participants, uptil 10 people and say ....and x other people for the remaining ones. 
      if (selectedUserList.length > 4) {
        // Display message for more than 5 people
          const message = `Created room "${roomName}" with users: ${selectedUserList[0].name}, ${selectedUserList[1].name},
          ${selectedUserList[2].name}, ${selectedUserList[3].name}, and ${selectedUserList.length - 4} other people`;
        
          await axios.post('http://localhost:3000/newConnection', { message,roomId:room_ID}, { headers: { "authorization": token } });
      
        createSplashDiv(message);
      }

      else {
        // Display message for 2 to 4 people
          const participants = selectedUserList.map(user => user.name).join(", ");
          const message = `Created room "${roomName}" with users: ${participants}`;
        
          await axios.post('http://localhost:3000/newConnection', { message,roomId:room_ID }, { headers: { "authorization": token } });
  
          createSplashDiv(message);
      }
    }

    else 
    {
      alert('Something went wrong ')
    }

  // Close the modal
  closeModal();
});



//if local storage there, update the last_msg_time accordingly
if(localMsg!=null)
{
  last_msg_time=JSON.parse(localMsg)[0].createdAt;
  console.log('Last seen from LocalStorage: ',last_msg_time)
}

if(!username)
{
  alert('Logged out')
  window.location.href='/login'
}

window.addEventListener("load",async(e)=>{
  e.preventDefault();
  getUserList() //Get the user List 

  getUserRooms() // get the local user's rooms and display it 
  

  current_Room=localStorage.getItem('current_Room')
  
  if(current_Room==null)
  {
    chat_messages.innerHTML=''
    createSplashDiv('Please select a conversation',true) //ask for chat selection
  }
  else{
    chat_messages.innerHTML=''
    getMsg(current_Room)
  }

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
  })
  
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
  console.log(clickedRoom)
  const response = await axios.post('http://localhost:3000/getMessages',{
    roomId:clickedRoom},
  {
    headers:{
      "authorization":token
    }
  });
  let allMsg = response.data.allMsg; //get all messages 

  // iterate over the allMsg array and display the messages
  if(allMsg.length>0){
    allMsg.forEach(msg => {
      arrayHandler(msg,false) //boolean parameter to check if to add message to bottom most position(for new messages)
  });
  last_msg_time=allMsg[0].createdAt;
  localStorage.setItem('localMsg',JSON.stringify(allMsg))
  } 
  else
  {
    createSplashDiv('Start the conversation',true)
  }
}

//on entering a chat by user
async function chatmsg(e)
{
  e.preventDefault()
  const msg = e.target.message.value
  const response = await axios.post('http://localhost:3000/postMessage',{message:msg,roomId:current_Room},{headers:{"authorization":token}})
  let entry = response.data.entry
  // console.log(msg)
  e.target.message.value = ""
  updateMsg() //Calling updatemsg here instead of creating div
  // createSendDiv(msg,entry.createdAt,true)
  // localStorage.setItem('localMsg',JSON.stringify(localMsg.reverse().push(entry).reverse()))
  // last_msg_time=entry.createdAt
  
  // window.location.reload()
}

//updating the current messages. 
async function updateMsg()
{ 
  // returns an array of objects in desc:createdAt
  const response = await axios.post('http://localhost:3000/updateMessages',{last_msg_time:last_msg_time,current_Room:current_Room},{
    headers:{
      "authorization":token
    }
  });
  const updateMsg = response.data.updateMsg
  if(updateMsg.length>0)
    {  //if there are any updates, update the local storage and add it in required order. 
      const updateLocal = JSON.parse(localStorage.getItem('localMsg'))
      updateLocal.reverse()
      updateMsg.reverse()
    
      updateMsg.forEach(msg=>{
      updateLocal.push(msg)
      })
      //updated properly considering rtl layout
      localStorage.setItem('localMsg',JSON.stringify(updateLocal.reverse()))

    updateMsg.reverse().forEach(update=>{
      arrayHandler(update,true)
    });
    last_msg_time=updateMsg[0].createdAt;//finally update last message time for client
  }
}

//creates divs according to given array items
function arrayHandler(array_item,add_location_bottom)
{
  if(array_item.isIntro)
      {
        createSplashDiv(array_item.text)

      }
      else
      {
        if(array_item.username==username)
        {
          createSendDiv(array_item.text,array_item.createdAt,add_location_bottom)
        }
        else {
          createRecDiv(array_item.text,array_item.createdAt,array_item.username,add_location_bottom)
        }
      }
}

//send Div creation 
function createSendDiv(data,time,newcheck)
{
  var new_msg = document.createElement('div');
  new_msg.classList = 'message_sent';
  new_msg.innerHTML=`<p class="meta">You <span> ${getTime(time)}</span></p>
  <p class="text">${data}</p>`;
  if(newcheck)
  {
    chat_messages.insertBefore(new_msg, chat_messages.firstChild);

  }
  else
  {
    chat_messages.appendChild(new_msg) 
  }
  chat_messages.scrollTop = chat_messages.scrollHeight;
}

//recc Div creation 
function createRecDiv(data,time,name,newcheck)
{
  var new_msg = document.createElement('div');
  new_msg.classList = 'message_rec';
  new_msg.innerHTML=`<p class="meta">${name} <span> ${getTime(time)}</span></p>
  <p class="text">${data}</p>`;
  if(newcheck)
  {
    chat_messages.insertBefore(new_msg, chat_messages.firstChild);

  }
  else
  {
    chat_messages.appendChild(new_msg) 
  }
  chat_messages.scrollTop = chat_messages.scrollHeight;
}

//create welcome message 
function createSplashDiv(data) {
  var new_msg = document.createElement('div');
  new_msg.classList.add('splash');

  // if (check) {
  //   new_msg.classList.add('message_sent');
  // } else {
  //   new_msg.classList.add('message_rec');
  // }

  new_msg.innerHTML = `
    <p class="splash-text">${data}</p>
  `;

  chat_messages.appendChild(new_msg);
  chat_messages.scrollTop = chat_messages.scrollHeight;
}

//better time format
function getTime(time) {
  const date = new Date(time)
  const timeString = date.toLocaleTimeString('en-US', { hour12: true})
  const timeWithoutSeconds = timeString.replace(/:\d{2}\s/, ' ')
  return timeWithoutSeconds
}

//implement logout
function logout(e)
{
  e.preventDefault()
  localStorage.removeItem('user')
  localStorage.removeItem('token')
  localStorage.removeItem('localMsg')
  alert('Logged out successfully')
  window.location.href='login.html'
}
