let connectedUsers=[]
let messages=[]
let chat_messages

const username = localStorage.getItem('user')
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
  const response = await axios.get('http://localhost:3000/getMessages');
  const allMsg = response.data.allMsg;
  console.log(allMsg);
  // iterate over the allMsg array and display the messages
  allMsg.forEach(msg => {
    // console.log(`${msg.user}: ${msg.message}`);
    if(msg.isIntro)
    {
      if(msg.user==username)
      createSendDiv('You have joined the chat')
      else 
      createRecDiv(`${msg.user} has joined the chat`)
    }
    else
    {
      if(msg.user==username)
      createSendDiv(`${msg.message}`)
      else createRecDiv(`${msg.message}`)
    }
  });
}


async function chatmsg(e)
{
  e.preventDefault()
  const msg = e.target.message.value
  console.log(msg)
  createSendDiv(msg)
  e.target.message.value = ""
  const response = await axios.post('http://localhost:3000/postMessage',{user:username,message:msg})
}


function createSendDiv(data)
{
  var new_msg = document.createElement('div');
  new_msg.classList = 'message_sent';
  
  new_msg.innerHTML=`<p class="meta">You <span>${getCurrentTime()}</span></p>
  <p class="text">${data}</p>`;
  chat_messages.appendChild(new_msg) 
  chat_messages.scrollTop = chat_messages.scrollHeight;
}

function createRecDiv(data)
{
  var new_msg = document.createElement('div');
  new_msg.classList = 'message_rec';
  new_msg.innerHTML=`<p class="meta">USER <span>${getCurrentTime()}</span></p>
  <p class="text">${data}</p>`;
  chat_messages.appendChild(new_msg) 
  chat_messages.scrollTop = chat_messages.scrollHeight;
}


function getCurrentTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

function logout(e)
{
  e.preventDefault()
  localStorage.removeItem('user')
  alert('Logged out successfully')
  window.location.href='login.html'
}

