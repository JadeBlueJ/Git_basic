

let last_msg_time=null
const chat_messages=document.getElementById('chat-messages')

const username = localStorage.getItem('user')
const token = localStorage.getItem('token')
let localMsg = localStorage.getItem('localMsg') 

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
  if(localMsg==null)
  { 
    await getMsg()
  }
  else
  {
    //use local files to populate index
    localMsg = localStorage.getItem('localMsg')
    parsedLocal = JSON.parse(localMsg)
    parsedLocal.forEach(msg => {
      arrayHandler(msg)
    });
    last_msg_time=parsedLocal[0].createdAt;
  }

  
  setInterval(async()=>{
    await updateMsg()

    //Check periodically for local storage updates and keep length to given param
    const allowedItems=12
    localMsg = localStorage.getItem('localMsg')
    parsedLocal = JSON.parse(localMsg)
    if(parsedLocal.length>0)
    { console.log('mod local storage in setinterval')
      while(parsedLocal.length>allowedItems)
      {
        parsedLocal.pop() 
      }
      const strLocal = JSON.stringify(parsedLocal)
      localStorage.setItem('localMsg',strLocal)
      last_msg_time=parsedLocal[0].createdAt //update last_msg_time with latest offline message

    }
  },2000)
})

//simple function getting all messages
async function getMsg() {
  const response = await axios.post('http://localhost:3000/getMessages',{last_msg_time:last_msg_time},{
    headers:{
      "authorization":token
    }
  });
  let allMsg = response.data.allMsg; //get all messages 

  // iterate over the allMsg array and display the messages
  if(allMsg.length>0){
    allMsg.forEach(msg => {
      arrayHandler(msg,false)
  });
  last_msg_time=allMsg[0].createdAt;
  localStorage.setItem('localMsg',JSON.stringify(allMsg))
  } 
}

//on entering a chat by user
async function chatmsg(e)
{
  e.preventDefault()
  const msg = e.target.message.value
  const response = await axios.post('http://localhost:3000/postMessage',{message:msg},{headers:{"authorization":token}})
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
  const response = await axios.post('http://localhost:3000/updateMessages',{last_msg_time:last_msg_time},{
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
        if(array_item.username==username)
        createSplashDiv('You have joined the chat',true)
        else 
        createSplashDiv(`${array_item.username} has joined the chat`,false)
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

//create welcome message 
function createSplashDiv(data, check)
{
  var new_msg = document.createElement('div');
  if(check)
  new_msg.classList = 'message_sent';
  else new_msg.classList = 'message_rec';
  new_msg.innerHTML=`
  <p class="text">${data}</p>`;
  chat_messages.appendChild(new_msg) 
  chat_messages.scrollTop = chat_messages.scrollHeight;
}


