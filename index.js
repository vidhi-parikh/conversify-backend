const express = require("express");
const cors = require("cors")
const app = express();
const connectDB = require("./utils/db");
const user_router = require("./routes/user_route")
const chat_router = require("./routes/chat_route")
const message_router = require("./routes/message_route")
const {notFound,errorHandler} = require('./middleware/errorMiddlewares')
const PORT = 4000;
const dotenv = require("dotenv");
dotenv.config({
  path: './.env'
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();

app.use(cors())
app.use('/api/user',user_router)
app.use('/api/chat',chat_router)
app.use('/api/message',message_router)
app.use(notFound)
app.use(errorHandler)

const server = app.listen(PORT, () => {
  console.log("Hi buudy ! Are you listening ?");
});

const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: {
    origin: 'http://localhost:5173',
  },
});

io.on('connection', (socket) => {
  console.log('connected to socket.io');

  socket.on('setup', (userData) => {
    socket.join(userData.userId);
    socket.emit('connected');
  })

  socket.on('join chat', (room) => {
    socket.join(room);
    console.log('User joined room: ' + room);
  })

  socket.on('typing',(room) => socket.in(room).emit('typing'));
  socket.on('stop typing',(room) => socket.in(room).emit('stop typing'));

  socket.on('new message', (newMessageReceived) => {
    var chat = newMessageReceived.chat;

    if(!chat.users) return console.log('chat.users not defined');

    chat.users.forEach(user => {
      if(user._id == newMessageReceived.sender._id) return;

      socket.in(user._id).emit('message received',newMessageReceived);

    })


  })

  socket.off('setup', () => {
    console.log('user disconnected');
    socket.leave(userData._id)
  })
})
