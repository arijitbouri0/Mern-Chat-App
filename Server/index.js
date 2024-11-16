import express from 'express'
import { connectDB } from './utils/connectDB.js';
import dotenv from 'dotenv';
import { errorMiddleware } from './middlewares/error.js';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io'
import { createServer } from 'http'
import { v4 as uuid } from 'uuid'
import cors from 'cors'
import { v2 as cloudinary } from 'cloudinary'

dotenv.config();

import UserRouter from './routes/user.routes.js'
import ChatRouter from './routes/chat.routes.js'
import { CHAT_JOINED, CHAT_LEAVED, NEW_MESSAGE, NEW_MESSAGE_ALERT, ONLINE_USER, TYPING_START, TYPING_STOP } from './constants/event.js';
import { getSockets } from './lib/helper.js';
import { Message } from './model/message.model.js';
import { corsOptions } from './constants/config.js';
import { socketAuthenticater } from './middlewares/auth.js';

const PORT = process.env.PORT || 3000
const uri = process.env.MONGODB_URI
const app = express()
const server = createServer(app);
const io = new Server(server, {
  cors: corsOptions
});

app.set("io", io)

const userSocketIDs = new Map();
const onlineUsers = new Set();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use(
  cors(corsOptions)
);


connectDB(uri).then(() =>
  console.log("MongoDb connected")
);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,  // Replace with your cloud name
  api_key: process.env.API_KEY,        // Replace with your API key
  api_secret: process.env.API_SECRET   // Replace with your API secret
});


//routes
app.use('/api/user', UserRouter);
app.use('/api/chat', ChatRouter);

io.use((socket, next) => {
  cookieParser()(
    socket.request,
    socket.request.resume,
    async (err) => await socketAuthenticater(err, socket, next)
  )
})

io.on("connection", (socket) => {
  const user = socket.user;
  userSocketIDs.set(user._id.toString(), socket.id)
  socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {
    try {
      const messageForRealTime = {
        content: message,
        _id: uuid(),
        sender: { _id: user._id },
        chat: chatId,
        createdAt: new Date().toISOString(),
      };

      const messageForDB = {
        content: message,
        sender: user._id,
        chat: chatId,
      };

      const membersSockets = getSockets(members);

      io.to(membersSockets).emit(NEW_MESSAGE, {
        chatId,
        message: messageForRealTime
      })
      io.to(membersSockets).emit(NEW_MESSAGE_ALERT, {
        chatId,
      })

      await Message.create(messageForDB);
    } catch (error) {
      console.error("Error in NEW_MESSAGE event:", error);
    }
  });

  socket.on(TYPING_START, ({ chatId, members }) => {
    const membersSockets = getSockets(members);
    socket.to(membersSockets).emit(TYPING_START, {
      chatId,
    })
  });

  socket.on(TYPING_STOP, ({ chatId, members }) => {
    const membersSockets = getSockets(members);
    socket.to(membersSockets).emit(TYPING_STOP, {
      chatId,
    })
  });

  socket.on(CHAT_JOINED, ({ userId, members }) => {
    onlineUsers.add(userId.toString());
    const membersSocket = getSockets(members);
    io.to(membersSocket).emit(ONLINE_USER, Array.from(onlineUsers))
  })

  socket.on(CHAT_LEAVED, ({ userId, members }) => {
    onlineUsers.delete(userId.toString());
    const membersSocket = getSockets(members);
    io.to(membersSocket).emit(ONLINE_USER, Array.from(onlineUsers))
  })


  socket.on("disconnect", () => {
    console.log("user disconnected");
    userSocketIDs.delete(user._id.toString());
    onlineUsers.delete(user._id.toString());
    socket.broadcast.emit(ONLINE_USER,Array.from(onlineUsers))
  });
});




app.use(errorMiddleware)

server.listen(PORT, () => {
  console.log(`server is running at port ${PORT}`)
});

export { userSocketIDs }