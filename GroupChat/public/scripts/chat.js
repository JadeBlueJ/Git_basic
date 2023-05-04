let connectedUsers=[]
let messages=[]
const username = localStorage.getItem('user')
const container = document.querySelector('.container')

window.addEventListener("DOMContentLoaded",async(e)=>{
  e.preventDefault();
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
      createSendDiv(`${msg.user}: ${msg.message}`)
      else createRecDiv(`${msg.user}: ${msg.message}`)
    }
  });
}


async function displayWelcomeMessages()
{
  const response = await axios.get('http://localhost:3000/connectedUsers')
  // connectedUsers.push(...response.data.connectedUsers)
}


// async function displayWelcomeMessages() {
//   await getUsers();
//   connectedUsers.forEach((user,index) => {
//     if (user != username && index>connectedUsers.indexOf(username)) {
//         createRecDiv(`${user} has entered the chat`)
//         createSendDiv(`You have entered the chat`)
//     }

//     else {
//       createSendDiv(`You have entered the chat`)
//     }
//   });
// }

async function chatmsg(e)
{
  e.preventDefault()
  const msg = e.target.message.value
  createSendDiv(`${username}: ${msg}`)
 
  e.target.message.value = ""
  const response = await axios.post('http://localhost:3000/postMessage',{user:username,message:msg})
}


function createSendDiv(data)
{
  var msg_ele = document.createElement('div');
  msg_ele.classList = 'message sent';
  msg_ele.innerText=data

  var msg_box = document.createElement('div');
  msg_box.classList = 'message-box';
  msg_box.appendChild(msg_ele)
  container.appendChild(msg_box) 
}

function createRecDiv(data)
{
  var msg_ele = document.createElement('div');
  msg_ele.classList = 'message received';
  msg_ele.innerText=data

  var msg_box = document.createElement('div');
  msg_box.classList = 'message-box';
  msg_box.appendChild(msg_ele)
  container.appendChild(msg_box) 
}
