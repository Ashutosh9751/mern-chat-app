import React, {useState, useEffect,useRef } from 'react'
import bg from '../assets/tbackground.jpg'

import { useDispatch, useSelector } from 'react-redux';
import { IoMdArrowRoundBack } from "react-icons/io";
import { onChatScreen } from '../redux/userslice';
import { IoSendSharp } from "react-icons/io5";
import axios from 'axios';
import { io } from 'socket.io-client';



const Right = () => {
  
  const [ismobile, setismobile] = useState(window.innerWidth < 768);
  const ChatScreen = useSelector((state) => state.user?.isonchatscreen);
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const logineduser = useSelector((state) => state.user?.userInfo);
  const selectedUser = useSelector((state) => state.user?.selectedUser);
   const url = import.meta.env.VITE_API_URL;
const [receivedmessage, setreceivedmessage] = useState([]);
  const socket = useRef();
  // Function to handle form submission
  // This function sends the message to the server when the form is submitted
   useEffect(() => {
     if (logineduser) {
       socket.current = io(url, {
         transports: ['websocket'],
         withCredentials: true,
         query: { logineduser: logineduser.userId }
       });
 
       socket.current.on('receive_message', (newMessage) => {
         if (
           (newMessage.sender === selectedUser.user._id && newMessage.receiver === logineduser.userId) ||
           (newMessage.receiver === selectedUser.user._id && newMessage.sender === logineduser.userId)
         ) {
           setreceivedmessage((prevMessages) => [...prevMessages, newMessage]);
         }
       });
 
       socket.current.on('disconnect', () => {
         console.log('Socket disconnected');
       });
 
       return () => {
         socket.current.disconnect();
       };
     }
   }, [logineduser, selectedUser]);
 
  const submithandler = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    const msgData = {
      senderid: logineduser.userId,
      receiverid: selectedUser.user._id,
      message
    };
    socket.current.emit('send_message', msgData);
    setreceivedmessage((prev)=>[...prev,{
      _id:Date.now(),
      sender:logineduser.userId,
      receiver:selectedUser.user._id,
      message,
      createdAt:new Date().toISOString()
    }])
setMessage('')
  };

  //get messages from the server
  // This function retrieves messages between the logged-in user and the selected user from the server
  useEffect(() => {
    const getMessages = async () => {
      await axios.post(`${url}/message/getmessages/`, {
        senderid: selectedUser.user._id,
        receiverid: logineduser.userId
      }, {
        withCredentials: true

      })
        .then((response) => {
         setreceivedmessage(response.data);
        })
        .catch((error) => {
          console.error('Error retrieving messages:', error);
        });
    }
    if (logineduser && selectedUser) {
      getMessages();
    }
  }, [selectedUser, logineduser]);


  //for responive design
  useEffect(() => {
    const handlesize = () => {
      setismobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handlesize);
    return () => window.removeEventListener('resize', handlesize);
  }, []);




  // Render the chat screen or a message to select a user
  // If ChatScreen is true, it renders the chat interface; otherwise, it prompts the user to select a user to chat with.
  // The chat interface includes a back button, the selected user's avatar and name, and a message input field with a send button.
  // The message input field allows the user to type a message, and the send button sends
  if ((!ismobile && ChatScreen) || (ismobile && ChatScreen)) {
    return (
      <div
        className={`${!ismobile ? 'md:w-6/10' : 'w-screen'} h-screen overflow-hidden flex flex-col justify-between items-center`}
        style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >

        <div className='flex w-full bg-black p-1'>

          <IoMdArrowRoundBack
            className='text-white text-4xl mr-2'
            onClick={() => dispatch(onChatScreen(false))}
          />
          <div className="avatar flex items-center">
            <div className="w-12 rounded-full">
              <img src={selectedUser?.user.dp} />
            </div>
            <div className='ml-2'>
              <h2 className='text-lg font-bold text-white'>{selectedUser?.customname==""?selectedUser?.user.username:selectedUser?.customname}</h2>
            </div>
          </div>
        </div>
        <div className='w-full h-4/5 overflow-y-scroll flex flex-col justify-end items-center'>
   {receivedmessage.map((msg)=>{
        return (
          <div key={msg._id} className={`${msg.sender === logineduser.userId ? 'chat chat-end text-green-100' : 'chat chat-start'} w-full`}>
   <div className="chat chat-start ">
  <div className="chat-image avatar">
    <div className="w-10 rounded-full">
  
    
    </div>
  </div>
  <div className="chat-header ">
    <h1>
    {msg.sender === logineduser.userId ? logineduser?.username : selectedUser?.customname=="" ? selectedUser?.user.username : selectedUser?.customname}

    </h1>
    <time className="text-xs opacity-50">
  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
</time>

  </div>
  <div className="chat-bubble">{msg.message}</div>
  <div className="chat-footer opacity-50">Delivered</div>
</div>
</div>

        )
       })}
        </div>

        {/* Message input field and send button */}
        {/* This section allows the user to type a message and send it */}
        <form className='w-full flex justify-evenly items-center rounded-2xl p-2' onSubmit={submithandler}>
          <input type="text" placeholder="Type here" className="input w-9/10 rounded-2xl focus:outline-none border-none" onChange={(e) => setMessage(e.target.value)} value={message} />
          <div className='bg-green-400 rounded-full p-2 flex justify-center items-center cursor-pointer  ml-1'>
            <button type='submit'>
              <IoSendSharp className='text-white text-3xl' type='submit' />

            </button>
          </div>
        </form>
      </div>
    );
  }
  // If ChatScreen is false and the screen is not mobile, it displays a message prompting the user to select a user to start chatting.
  // If ChatScreen is false and the screen is mobile, it displays a similar message but with a different layout.
  // The background image is set to a predefined image, and the message is centered on the screen.
  else if (!ChatScreen) {
    return (
      <div
        className={`${!ismobile ? 'md:w-6/10' : 'w-screen'} h-screen overflow-hidden flex flex-col justify-center items-center`}
        style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className='text-white'>Select a user to start chatting</div>
      </div>
    )
  }
};

export default Right;

