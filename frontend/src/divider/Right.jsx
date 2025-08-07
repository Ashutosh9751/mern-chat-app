import React, {useState, useEffect,useRef } from 'react'
import bg from '../assets/tbackground.jpg'

import { useDispatch, useSelector } from 'react-redux';
import { IoMdArrowRoundBack } from "react-icons/io";
import { onChatScreen } from '../redux/userslice';
import { IoSendSharp } from "react-icons/io5";
import axios from 'axios';
import { io } from 'socket.io-client';
import { setonlineuser } from '../redux/userslice';
import { incrementUnread } from '../redux/userslice';
import { toast } from 'react-toastify';


const Right = () => {
  
  const [ismobile, setismobile] = useState(window.innerWidth < 768);
  const ChatScreen = useSelector((state) => state.user?.isonchatscreen);
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const logineduser = useSelector((state) => state.user?.userInfo);
  const selectedUser = useSelector((state) => state.user?.selectedUser);
  const friendspresent = useSelector((state) => state.user?.friendspresent);
   const url = import.meta.env.VITE_API_URL;
  const socketUrl = import.meta.env.VITE_SOCKET_URL;

  function playNotificationSound() {
  const audio = new Audio('sounds/notification.mp3'); // Place this file in `public/`
  audio.play().catch(err => console.error('Audio play failed:', err));
}

const [receivedmessage, setreceivedmessage] = useState([]);
  const socket = useRef();
  // Function to handle form submission
  // This function sends the message to the server when the form is submitted
  useEffect(() => {
  if (!logineduser?.userId) return;
  if (logineduser) {
    socket.current = io(socketUrl, {
      transports: ['websocket'],
      withCredentials: true,
      query: { logineduser: logineduser.userId }
    });

    socket.current.on('online_users', (userIds) => {
      dispatch(setonlineuser(userIds));
    });

    socket.current.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      socket.current.disconnect();
    };
  }
}, [logineduser?.userId]);
useEffect(() => {
  if (!socket.current) return;

  const listener = (newMessage, sendername) => {
    

    const selectedId = selectedUser?.user?._id;
    const isCurrentChat =
      selectedId &&
      ((newMessage.sender === selectedId && newMessage.receiver === logineduser.userId) ||
        (newMessage.receiver === selectedId && newMessage.sender === logineduser.userId));

    if (isCurrentChat) {
      setreceivedmessage((prevMessages) => [...prevMessages, newMessage]);
      playNotificationSound();
    } else {

      toast.success(` New message from ${sendername || "someone"}`);
      playNotificationSound();
      dispatch(incrementUnread(newMessage.sender));
    }
  };

  socket.current.on('receive_message', listener);

  return () => {
    socket.current.off('receive_message', listener); // clean up old listener
  };
}, [selectedUser?.user?._id, logineduser?.userId]);


  const submithandler = async (e) => {
  e.preventDefault();
  if (!message.trim()) return;

  const msgData = {
    senderid: logineduser.userId,
   sendername: logineduser.username,
    receiverid: selectedUser.user._id,
    message,
  };

  // Emit message
  socket.current.emit('send_message', msgData);

  // Optimistic update: show the message instantly
  setreceivedmessage((prev) => [
    ...prev,
    {
      _id: Date.now(),
      sender: logineduser.userId,
      receiver: selectedUser.user._id,
      message,
      createdAt: new Date().toISOString(),
      temp: true, // mark as temporary
    },
  ]);

  setMessage('');

  // Wait for server confirmation
  socket.current.on('message_sent_ack', (confirmedMessage) => {
    setreceivedmessage((prev) =>
      prev.map((msg) =>
        msg.temp && msg.message === confirmedMessage.message
          ? confirmedMessage // replace dummy with real message
          : msg
      )
    );
  });
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
        <div className='w-full h-4/5 overflow-y-scroll flex flex-col  items-center'>
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

