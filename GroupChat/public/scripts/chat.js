

let last_msg_time=null
const chat_messages=document.getElementById('chat-messages')

const username = localStorage.getItem('user')
const token = localStorage.getItem('token')
if(!username)
{
  alert('Logged out')
  window.location.href='/login'
}


async function getMsg() {
  const response = await axios.post('http://localhost:3000/getMessages',{last_msg_time:last_msg_time},{
    headers:{
      "authorization":token
    }
  });
  const allMsg = response.data.allMsg;
  // console.log(allMsg);
  // iterate over the allMsg array and display the messages
  if(allMsg.length>0){
  allMsg.forEach(msg => {
    // console.log(`${msg.user}: ${msg.message}`);
    if(msg.isIntro)
    {
      if(msg.username==username)
      createSplashDiv('You have joined the chat',true)
      else 
      createSplashDiv(`${msg.username} has joined the chat`,false)
    }
    else
    {
      if(msg.username==username)
      {
        createSendDiv(msg.text,msg.createdAt,false)
      }
      else {
        createRecDiv(msg.text,msg.createdAt,msg.username,false)
      }
    }
  });
  last_msg_time=allMsg[0].createdAt;
  } 
}

window.addEventListener("load",async(e)=>{
  e.preventDefault();
  // chat_messages = 
  await getMsg()
  setInterval(async()=>{
    await updateMsg()
  },5000)
})


async function chatmsg(e)
{
  e.preventDefault()
  const msg = e.target.message.value
  const response = await axios.post('http://localhost:3000/postMessage',{message:msg},{headers:{"authorization":token}})
  last_msg_time=response.data.createdAt
  // console.log(msg)
  e.target.message.value = ""
  createSendDiv(msg,last_msg_time,true)
  // window.location.reload()
}


function createSendDiv(data,time,newcheck)
{
  var new_msg = document.createElement('div');
  new_msg.classList = 'message_sent';
  new_msg.innerHTML=`<p class="meta">You <span>${getTime(time)}</span></p>
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
  // location.reload()
}

function createRecDiv(data,time,name,newcheck)
{
  var new_msg = document.createElement('div');
  new_msg.classList = 'message_rec';
  new_msg.innerHTML=`<p class="meta">${name}<span>${getTime(time)}</span></p>
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
  // location.reload()
}


function getTime(time) {
  const date = new Date(time)
  const timeString = date.toLocaleTimeString('en-US', { hour12: true})
  const timeWithoutSeconds = timeString.replace(/:\d{2}\s/, ' ')
  return timeWithoutSeconds
}

function logout(e)
{
  e.preventDefault()
  localStorage.removeItem('user')
  localStorage.removeItem('token')
  alert('Logged out successfully')
  window.location.href='login.html'
}

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

async function updateMsg()
{
  const response = await axios.post('http://localhost:3000/updateMessages',{last_msg_time:last_msg_time},{
    headers:{
      "authorization":token
    }
  });
  const updateMsg = response.data.updateMsg
  if(updateMsg.length>0)
  {  
  updateMsg.forEach(update=>{
    if(update.isIntro)
    {
      if(update.username==username)
      createSplashDiv('You have joined the chat',true)
      else 
      createSplashDiv(`${update.username} has joined the chat`,false)
    }
    else
    {
      if(update.username==username)
      {
        createSendDiv(update.text,update.createdAt,true)
      }
      else {
        createRecDiv(update.text,update.createdAt,update.username,true)
      }
    }
  });
  last_msg_time=updateMsg[0].createdAt;
  }
}

