const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Run when client connects
io.on("connection", (socket) => {
  console.log("New WS Connection...");

  // Welcome current user
  socket.emit("message", "Welcome to the chat!");

  // Broadcast when a user connects
  socket.broadcast.emit("message", "A user has joined the chat");

  // Listen for chatMessage
  socket.on("chatMessage", (message) => {
    io.emit("message", message);
  });

  // Runs when client disconnects
  socket.on("disconnect", () => {
    io.emit("message", "A user has left the chat");
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
