const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors')
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "https://chat-app-ntjl.onrender.com",
    methods: ["GET", "POST"]
  }
});
const PORT = process.env.PORT || 4000;

// app.get('/', (req, res) => {
//     res.write(`<h1>Socket IO Start on Port : ${PORT}</h1>`);
//     res.end();
// });
const users = {}

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('new-user-joined', name => {
    console.log('user', name)
    users[socket.id] = name
    socket.broadcast.emit('user-joined', name)
  });

  socket.on('send', message => {
    socket.broadcast.emit('recieve', { message: message, name: users[socket.id] })
  });
  socket.on('typing', (data) => socket.broadcast.emit('typingResponse', data));

});


server.listen(PORT);