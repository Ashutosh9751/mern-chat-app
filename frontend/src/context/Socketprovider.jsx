import { io } from "socket.io-client";
import socketcontext from "./contextstate";
import { useRef,useEffect} from "react";
import { useSelector } from "react-redux";
import React from 'react'

const Socketprovider = ({children}) => {
      const url = import.meta.env.VITE_SOCKET_URL;
  const user = useSelector((state) => state.user.userInfo);
  const socketRef = useRef(null);

  useEffect(() => {
     if (!user?.userId) return;
    
    socketRef.current = io(url, {
      transports: ["websocket"],
      withCredentials: true,
      query: { logineduser: user.userId },
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to socket server');
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [user,url, socketRef]);

  return (
    <socketcontext.Provider value={socketRef.current}>
      {children}
    </socketcontext.Provider>
  )
}

export default Socketprovider