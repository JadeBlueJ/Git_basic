const socket = io();
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");
const messagesList = document.getElementById("messages-list");

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value.trim();
  if (message !== "") {
    socket.emit("chatMessage", message);
  }
  messageInput.value = "";
});

socket.on("message", (message) => {
  const li = document.createElement("li");
  li.innerText = message;
  messagesList.appendChild(li);
});
