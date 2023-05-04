const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const token = localStorage.getItem('token');
const username = JSON.parse(localStorage.getItem('userName'));
  // use the values as needed



const socket =io();

socket.on('message',message=>{
    console.log(message)
    outputMessage(message)

    //scroll every new msg 
    chatMessages.scrollTop=chatMessages.scrollHeight
})


//msg submit
chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const msg = e.target.elements.msg.value
    // console.log(msg)
    //emit to server
    socket.emit('chatMessage',msg)
    //clear form
    e.target.elements.msg.value=''
    e.target.elements.msg.focus()
})

function outputMessage(message) {
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML=`<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`

    document.querySelector('.chat-messages').appendChild(div)
}