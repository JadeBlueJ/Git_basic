
let messages=[]
let chat_messages

const username = localStorage.getItem('user')
const token = localStorage.getItem('token')
if(!username)
{
  alert('Logged out')
  window.location.href='/login'
}


window.addEventListener("DOMContentLoaded",async(e)=>{
  e.preventDefault();
  chat_messages = document.getElementById('chat-messages')
  getMsg()
})

async function getMsg() {
  const response = await axios.get('http://localhost:3000/getMessages',{headers:{"authorization":token}});
  const allMsg = response.data.allMsg;
  console.log(allMsg);
  // iterate over the allMsg array and display the messages
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
      createSendDiv(msg.text,msg.createdAt)
      else createRecDiv(msg.text,msg.createdAt,msg.username)
    }
  });
}


async function chatmsg(e)
{
  e.preventDefault()
  const msg = e.target.message.value
  const response = await axios.post('http://localhost:3000/postMessage',{message:msg},{headers:{"authorization":token}})
  // console.log(msg)
  e.target.message.value = ""
  window.location.reload()
}


function createSendDiv(data,time)
{
  var new_msg = document.createElement('div');
  new_msg.classList = 'message_sent';
  

  new_msg.innerHTML=`<p class="meta">You <span>${getTime(time)}</span></p>
  <p class="text">${data}</p>`;
  chat_messages.appendChild(new_msg) 
  chat_messages.scrollTop = chat_messages.scrollHeight;
}

function createRecDiv(data,time,name)
{
  var new_msg = document.createElement('div');
  new_msg.classList = 'message_rec';
  new_msg.innerHTML=`<p class="meta">${name}<span>${getTime(time)}</span></p>
  <p class="text">${data}</p>`;
  chat_messages.appendChild(new_msg) 
  chat_messages.scrollTop = chat_messages.scrollHeight;
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