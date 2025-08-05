import express from  'express'
import { createServer } from 'node:http';
import  userrouter  from './routes/usermodel.js'
import friendrouter from './routes/friends.js'
import doteenv from 'dotenv'
import mongoose from 'mongoose';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import messagerouter from './routes/message.js'
import Messagemodel from './models/message.js';
const app = express();
const server = createServer(app);

app.use(cors({
    origin:["http://localhost:5173",
      "https://mern-chat-f1ln0420o-ashutosh9751s-projects.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
doteenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api', userrouter);
app.use('/api',friendrouter)
app.use('/api',messagerouter)
app.get('/', (req, res) => {
    res.send('Hello, World!');
})
const dbconnect=async()=>{
await mongoose.connect(process.env.mongodb_url);
console.log('Database connected successfully');
}
// Socket.io setup
const io = new Server(server,
    cors({
        origin: ["http://localhost:5173","https://mern-chat-app-ashy-eight.vercel.app/"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    })
);
let usersocketmap={};
const getonlineuser=()=> Object.keys(usersocketmap);
io.on('connection', (socket) => {
  const logineduser = socket.handshake.query.logineduser;
  
  usersocketmap[logineduser] = socket.id;

 io.emit('online_users',getonlineuser());

  // Handle send_message event
  socket.on('send_message', async ({ senderid, receiverid, message }) => {
    try {
      const newMessage = await Messagemodel.create({
        sender: senderid,
        receiver: receiverid,
        message: message
      });

      // Emit to receiver if online
      const receiverSocketId = usersocketmap[receiverid];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receive_message', newMessage);
      }

      // Optionally, emit back to sender too
      socket.emit('message_sent_ack', newMessage);
    } catch (error) {
      console.error('Error in send_message:', error);
    }
  });

  socket.on('disconnect', () => {

    delete usersocketmap[logineduser];
    //notify all again after someone leaves
    io.emit('online_users',getonlineuser());
  });
});

const port=process.env.port || 3000;
server.listen(port, () => {
    dbconnect();
    console.log(`Server is running on port ${port}`);
});