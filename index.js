const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors')
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"]
  }
});
const port = 3000
// const PORT =  4000;

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


server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})