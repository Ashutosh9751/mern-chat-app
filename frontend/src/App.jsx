import React from 'react'

import Right from './divider/Right'
import Login from './user/Login'
import Register from './user/Register'
import { BrowserRouter, Route, Routes } from 'react-router'
import Ui from './divider/Ui'
import Addfriend from './user/Addfriend'
import { ToastContainer } from 'react-toastify';
import { io } from 'socket.io-client'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login,setonlineuser } from './redux/userslice'
const App = () => {
  const dispatch = useDispatch();
  const logineduser = useSelector((state) => state.user.userInfo);
  const url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if(!logineduser) {
      return;
    }
    const socket = io(url, {
      transports: ['websocket'],
      withCredentials: true,
      query: {
       logineduser: logineduser ? logineduser.userId : null
      }
    });

    socket.on('hello', (message) => {
      console.log(message);
    });
    
 socket.on('online_users', (onlineUserIds) => {
      dispatch(setonlineuser(onlineUserIds))

  });
   
    socket.on('disconnect', () => {
      console.log('disconnected from server');
    });
    return () => {
      socket.disconnect();
    }
  }, [logineduser])
   useEffect(() => {
    const userId = localStorage.getItem('userid');
    const username = localStorage.getItem('username');
    const dp = localStorage.getItem('dp');
    if (!userId || !username) {
      return;
    }
 
if (userId) {
  dispatch(login({ userId, username, dp }));
}

    
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>

          <Route path='/login' element={<Login />} />
          <Route path='/home' element={<Ui />} />
          <Route path='/' element={<Register />} />
          <Route path='/addfriend' element={<Addfriend />} />

        </Routes>
        <ToastContainer />

      </BrowserRouter>

    </>








  )
}

export default App