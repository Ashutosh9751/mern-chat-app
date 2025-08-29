import React, { useState, useEffect, useRef, useContext } from 'react'
import bg from '../assets/tbackground.jpg'

import { useDispatch, useSelector } from 'react-redux';
import { IoMdArrowRoundBack } from "react-icons/io";
import { onChatScreen } from '../redux/userslice';
import { IoSendSharp } from "react-icons/io5";
import { IoMdCall } from "react-icons/io";
import { MdOutlineVideoCall } from "react-icons/md";
import axios from 'axios';
import socketcontext from '../context/contextstate';
import { setonlineuser,setIsRinging } from '../redux/userslice';
import { incrementUnread } from '../redux/userslice';
import { toast } from 'react-toastify';


const Right = () => {

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const localvideoref = useRef(null);
  const remotevideoref = useRef(null)
  const candidateQueue = useRef([]);
  const [isvideoscreen, setisvideoscreen] = useState(false);
  const [isaudioscreen, setisaudioscreen] = useState(false);
  
  const remoteAudioRef = useRef(null);

  const [incomingCall, setIncomingCall] = useState(null); // { from, offer }
  // const [isRinging, setIsRinging] = useState(false);
  const isringing=useSelector((state) => state.user?. isringing);

  const ringtoneRef = useRef(null);

  const pcRef = useRef(null)
  const [ismobile, setismobile] = useState(window.innerWidth < 768);
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const ChatScreen = useSelector((state) => state.user?.isonchatscreen);

  const logineduser = useSelector((state) => state.user?.userInfo);
  const selectedUser = useSelector((state) => state.user?.selectedUser);

  const url = import.meta.env.VITE_API_URL;

  function playNotificationSound() {
    const audio = new Audio('sounds/notification.mp3'); // Place this file in `public/`
    audio.play().catch(err => console.error('Audio play failed:', err));
  }

  const chatScreenRef = useRef(ChatScreen);

  useEffect(() => {
    chatScreenRef.current = ChatScreen;
  }, [ChatScreen]);

  const [receivedmessage, setreceivedmessage] = useState([]);
  useEffect(() => {
    scrollToBottom();
  }, [receivedmessage]);
  // Function to handle form submission
  // This function sends the message to the server when the form is submitted
  const socket = useContext(socketcontext);

  useEffect(() => {
    if (!socket) return;

    socket.on('online_users', (userIds) => {
      dispatch(setonlineuser(userIds));
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      socket.off('online_users');
      socket.off('disconnect');
    };

  }, [logineduser?.userId]);
  useEffect(() => {
    if (!socket) return;

    const listener = (newMessage, customname) => {
      const isChatScreen = chatScreenRef.current;
      const selectedId = selectedUser?.user?._id;
      const isCurrentChat = ((newMessage.sender === selectedId && newMessage.receiver === logineduser.userId) ||
        (newMessage.receiver === selectedId && newMessage.sender === logineduser.userId));

      if (isCurrentChat && isChatScreen) {
        setreceivedmessage((prevMessages) => [...prevMessages, newMessage]);
        playNotificationSound();

      } else if (!isChatScreen) {

        toast.success(`New message from ${customname || "someone"}`);
        playNotificationSound();
        dispatch(incrementUnread(newMessage.sender));
      }
      else if (!isCurrentChat) {
        toast.success(`New message from ${customname || "someone"}`);
        playNotificationSound();
        dispatch(incrementUnread(newMessage.sender));
      }
    };

    socket.on('receive_message', listener);

    return () => {
      socket.off('receive_message', listener); // clean up old listener
    };
  }, [selectedUser?.user?._id, logineduser?.userId, receivedmessage]);


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
    socket.emit('send_message', msgData);

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
    socket.on('message_sent_ack', (confirmedMessage) => {
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

  //for video call



  async function getConnectedDevices(type) {
    const devices = await navigator.mediaDevices.enumerateDevices();

    return devices.filter(device => device.kind === type)
  }
  async function openCamera(cameraId) {
    const constraints = {
      'audio': { 'echoCancellation': true,
         noiseSuppression: true,
    autoGainControl: true
      },
      'video': {
        'deviceId': cameraId,

      }
    }

    return await navigator.mediaDevices.getUserMedia(constraints);
  }

  const handleVideoCall = async () => {
    setisvideoscreen(true);
    const configuration = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    };
    pcRef.current = new RTCPeerConnection(configuration);

    // Remote stream handler
    pcRef.current.ontrack = (event) => {

      if (remotevideoref.current) {
        remotevideoref.current.srcObject = event.streams[0];
        remotevideoref.current.play().catch(err => console.error("Play error:", err));
      }
    };

    const cameras = await getConnectedDevices("videoinput");

    if (cameras && cameras.length > 0) {
      const stream = await openCamera(cameras[0].deviceId);

      if (localvideoref.current) {
        localvideoref.current.srcObject = stream;
      }
      stream.getTracks().forEach((track) => {

        pcRef.current.addTrack(track, stream);
      });





      const offer = await pcRef.current.createOffer();

      await pcRef.current.setLocalDescription(offer);

      socket.emit("call-user", {
        offer,
        to: selectedUser.user._id,
        selectedusername: selectedUser?.customname == "" ? selectedUser?.user.username : selectedUser?.customname,
        calltype: "video"
      });

      pcRef.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("send-ice-candidate", {
            candidate: event.candidate,
            to: selectedUser.user._id,
          });
        }
      };
    }
  };
const handleaudiocall = async () => {
  setisaudioscreen(true);
  setisvideoscreen(false);
  const configuration = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };
  pcRef.current = new RTCPeerConnection(configuration);

  pcRef.current.ontrack = (event) => {
    // You can play audio using an <audio ref> element
    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = event.streams[0];
     
    }
  };

  // Get only audio input
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });

  stream.getTracks().forEach((track) => {
    pcRef.current.addTrack(track, stream);
  });
    const offer = await pcRef.current.createOffer();

      await pcRef.current.setLocalDescription(offer);

      socket.emit("call-user", {
        offer,
        to: selectedUser.user._id,
        selectedusername: selectedUser?.customname == "" ? selectedUser?.user.username : selectedUser?.customname,
        calltype: "audio"
      });

      pcRef.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("send-ice-candidate", {
            candidate: event.candidate,
            to: selectedUser.user._id,
          });
        }
      };

  // The rest of your signaling logic—createOffer, setLocalDescription, socket.emit, etc.—remains unchanged
};



  useEffect(() => {

    if (!socket) return;

    const handleCallMade = async ({ offer, from, selectedusername, calltype }) => {

      setIncomingCall({ from, offer, selectedusername, calltype });

      // setIsRinging(true);
dispatch(setIsRinging(true));
      // Play ringtone
      ringtoneRef.current = new Audio("/sounds/ringtone.mp3");
      ringtoneRef.current.loop = true;
      ringtoneRef.current.play().catch(console.error);
    };
    const handleAnswerMade = async ({ answer }) => {
      
      if (answer && pcRef.current) {
        try {
          await pcRef.current.setRemoteDescription(new RTCSessionDescription(answer));
          // Immediately drain ICE candidate queue after setting remoteDescription
          if (candidateQueue.current.length > 0) {
            for (const candidate of candidateQueue.current) {
              try {
                await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
              } catch (e) {
                console.error("❌ Error adding queued ICE candidate:", e);
              }
            }
            candidateQueue.current = [];
          }
        } catch (err) {
          console.error("Error setting remote description:", err);
        }
      }
    };
    const handleIceCandidate = async ({ candidate }) => {
      if (pcRef.current) {
        if (pcRef.current.remoteDescription) {
          try {
            await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));

          } catch (err) {
            console.error("❌ Error adding ICE candidate", err);
          }
        } else {
          console.warn("⚠️ Queued ICE candidate (no remoteDescription yet)");
          candidateQueue.current.push(candidate);
        }
      }

     
    }
const handleCallRejected = () => {
    toast.error(`call rejected by ${selectedUser.customname}`);
    setIncomingCall(null);
    // setIsRinging(false);
    dispatch(setIsRinging(false));
    ringtoneRef.current?.pause();
    dispatch(onChatScreen(true));
  };
  const handleEndCallbyuser=async () => {
      if (pcRef.current) {
    pcRef.current.close();
    pcRef.current = null;
  }
    if (localvideoref.current?.srcObject) {
    const tracks = localvideoref.current.srcObject.getTracks();
    tracks.forEach(track => track.stop()); // stop camera + mic
    localvideoref.current.srcObject = null;
  }
  // Clear remote video stream
  if (remotevideoref.current?.srcObject) {
    const tracks = remotevideoref.current.srcObject.getTracks();
    tracks.forEach(track => track.stop());
    remotevideoref.current.srcObject = null;
  }
   if (remoteAudioRef.current?.srcObject) {
    const tracks = remoteAudioRef.current.srcObject.getTracks();
    tracks.forEach(track => track.stop());
    remoteAudioRef.current.srcObject = null;
  }
  setisvideoscreen(false);
  setisaudioscreen(false);
  setIncomingCall(null);
  // setIsRinging(false);
  dispatch(setIsRinging(false));
  ringtoneRef.current?.pause();
   
  dispatch(onChatScreen(true));
  }
    socket.on("call-made", handleCallMade);
    socket.on("answer-made", handleAnswerMade);
    socket.on("received-ice-candidate", handleIceCandidate);
    socket.on("call-rejected", handleCallRejected);
    socket.on('call-ended', handleEndCallbyuser);

    return () => {
      socket.off("call-made", handleCallMade);
      socket.off("answer-made", handleAnswerMade);
      socket.off("received-ice-candidate", handleIceCandidate);
      socket.off("call-rejected", handleCallRejected);
    };
  }, [socket])

  const handleAcceptCall = async () => {
    
    if (!incomingCall) return;
    // setIsRinging(false);
    dispatch(setIsRinging(false));
    ringtoneRef.current?.pause();
    if(incomingCall.calltype === "audio") {
      setisvideoscreen(false);
      setisaudioscreen(true);
      dispatch(onChatScreen(true));
    }
    else if(incomingCall.calltype === "video"){
      setisvideoscreen(true);
      setisaudioscreen(false);
      dispatch(onChatScreen(true));
    }
    const configuration = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    };

    pcRef.current = new RTCPeerConnection(configuration);
    pcRef.current.ontrack = (event) => {
  if (incomingCall.calltype === "video") {
    if (remotevideoref.current) {
      remotevideoref.current.srcObject = event.streams[0];
    }
  } else {
    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = event.streams[0];
    }
  }
};


    await pcRef.current.setRemoteDescription(new RTCSessionDescription(incomingCall.offer)); // or answer
    // Immediately after:
    if (candidateQueue.current.length > 0) {
      for (const candidate of candidateQueue.current) {
        try {
          await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) {
          console.error("❌ Error adding queued ICE candidate:", e);
        }
      }
      candidateQueue.current = [];
    }

//
 




   // For video: { video: true, audio: true }
const constraints = incomingCall.calltype === "video"
  ? { video: true, audio: true }
  : { video: false, audio: true };

const stream = await navigator.mediaDevices.getUserMedia(constraints);
// ...rest of stream setup

     

      stream.getTracks().forEach((track) => {
        pcRef.current.addTrack(track, stream);
      });
if(incomingCall.calltype === "video"){
  if (localvideoref.current) {
    localvideoref.current.srcObject = stream;
  }
}
      const answer = await pcRef.current.createAnswer();
      await pcRef.current.setLocalDescription(answer);

      pcRef.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("send-ice-candidate", {
            candidate: event.candidate,
            to: incomingCall.from,
          });
        }
      };
      socket.emit("make-answer", {
        answer,
        to: incomingCall.from,
      });
 
   
  }
  const handleRejectCall = () => {
    if (!incomingCall) return; 
    ringtoneRef.current?.pause();
    // setIsRinging(false);
    dispatch(setIsRinging(false));

    socket.emit("reject-call", { to: incomingCall.from });
    setIncomingCall(null);
  };
const handleEndCall = () => {
  if (pcRef.current) {
    pcRef.current.close();
    pcRef.current = null;
  }
    if (localvideoref.current?.srcObject) {
    const tracks = localvideoref.current.srcObject.getTracks();
    tracks.forEach(track => track.stop()); // stop camera + mic
    localvideoref.current.srcObject = null;
  }
  // Clear remote video stream
  if (remotevideoref.current?.srcObject) {
    const tracks = remotevideoref.current.srcObject.getTracks();
    tracks.forEach(track => track.stop());
    remotevideoref.current.srcObject = null;
  }
   if (remoteAudioRef.current?.srcObject) {
    const tracks = remoteAudioRef.current.srcObject.getTracks();
    tracks.forEach(track => track.stop());
    remoteAudioRef.current.srcObject = null;
  }
  setisvideoscreen(false);
  setisaudioscreen(false);
  setIncomingCall(null);
  // setIsRinging(false);
  dispatch(setIsRinging(false));
  ringtoneRef.current?.pause();
    socket.emit('end-call', { to: selectedUser.user._id });
  dispatch(onChatScreen(true));
};


  if (isringing) {
    
    return (


      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-50">
        <h2 className="text-white text-2xl mb-4">Incoming Video Call from {incomingCall?.selectedusername}</h2>
        <div className="flex gap-6">
          <button
            className="bg-green-500 text-white px-6 py-3 rounded-full"
            onClick={handleAcceptCall}
          >
            Accept
          </button>
          <button
            className="bg-red-500 text-white px-6 py-3 rounded-full"
            onClick={handleRejectCall}
          >
            Reject
          </button>
        </div>
      </div>


    )
  }
  if (isaudioscreen) {
  return (
    <div className="w-screen h-screen bg-black flex flex-col items-center justify-center">
      <audio
        ref={remoteAudioRef}
        autoPlay
        controls={false}
        playsInline
    
      />
      <div>
        <button onClick={handleEndCall} className='absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded'>
          end call
        </button>
      </div>
    </div>
  );
}

 if (isvideoscreen) {
    return (
      <div className="w-screen h-screen bg-black flex flex-col items-center justify-center">
        <video
          ref={remotevideoref}
          autoPlay
          playsInline
          controls={false}
       className='w-full h-full'
        />

        <video
          ref={localvideoref}

          autoPlay
          playsInline
          muted
          className="w-1/4 h-1/4 absolute bottom-4 right-4 border-2 border-white rounded-lg"
        />
        <div>
          <button onClick={handleEndCall} className='absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded'>
            end call
          </button>
        </div>
      </div>
    );
  }

  else if ((!ismobile && ChatScreen && !isvideoscreen) || (ismobile && ChatScreen && !isvideoscreen)) {
    return (
      <div
        className={`${!ismobile ? 'md:w-6/10' : 'w-screen'} h-screen overflow-hidden flex flex-col justify-between items-center`}
        style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >

        <div className='flex w-full bg-black p-1 relative h-16 items-center justify-between'>

          <IoMdArrowRoundBack
            className='text-white text-4xl mr-2'
            onClick={() => dispatch(onChatScreen(false))}
          />
          <div className=" flex items-center justify-between w-full h-full">
            <div className='flex items-center '>
              <div className="w-12 h-12 rounded-full">
                <img src={selectedUser?.user.dp} className='w-full h-full object-cover rounded-full' />
              </div>
              <div className='ml-2 h-full'>
                <h2 className='text-lg font-bold text-white'>{selectedUser?.customname == "" ? selectedUser?.user.username : selectedUser?.customname}</h2>
              </div>
            </div>

            <div className='flex items-center justify-center h-full pr-4 gap-x-5'>
              <div className='cursor-pointer  rounded-full bg-green-400 hover:bg-green-500 transition duration-200'>
                <IoMdCall className='text-white text-4xl' onClick={handleaudiocall}/>

              </div>
              <div className='cursor-pointer  rounded-full bg-green-400 hover:bg-green-500 transition duration-200'>
                <MdOutlineVideoCall className='text-white text-4xl ml-2' onClick={handleVideoCall} />

              </div>
            </div>
          </div>
        </div>
        <div className='w-full h-4/5 overflow-y-scroll flex flex-col  items-center'>
          {receivedmessage.map((msg) => {
            return (
              <div key={msg._id} className={`${msg.sender === logineduser.userId ? 'chat chat-end text-green-100' : 'chat chat-start'} w-full`}>
                <div className="chat chat-start ">
                  <div className="chat-image avatar">
                    <div className="w-10 rounded-full">


                    </div>
                  </div>
                  <div className="chat-header ">
                    <h1>
                      {msg.sender === logineduser.userId ? logineduser?.username : selectedUser?.customname == "" ? selectedUser?.user.username : selectedUser?.customname}

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
          <div ref={messagesEndRef} />
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
