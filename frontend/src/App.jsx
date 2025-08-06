import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Ui from './divider/Ui';
import Login from './user/Login';
import Register from './user/Register';
import Addfriend from './user/Addfriend';
import { useDispatch, useSelector } from 'react-redux';
import { login, setonlineuser } from './redux/userslice';
import { ToastContainer } from 'react-toastify';
import { io } from 'socket.io-client';
import ProtectedRoute from './ProtectedRoute';


const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userInfo);
  const url = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(true);

  // Load localStorage data into Redux before app renders
  useEffect(() => {
    const userId = localStorage.getItem('userid');
    const username = localStorage.getItem('username');
    const dp = localStorage.getItem('dp');

    if (userId && username && dp) {
      dispatch(login({ userId, username, dp }));
    }

    // ✅ done loading user info
    setLoading(false);
  }, []);

  // Connect to socket only after user is logged in
  useEffect(() => {
    if (!user) return;

    const socket = io(url, {
      transports: ['websocket'],
      withCredentials: true,
      query: {
        logineduser: user.userId,
      },
    });

    socket.on('hello', (message) => {
      console.log(message);
    });

    socket.on('online_users', (onlineUserIds) => {
      dispatch(setonlineuser(onlineUserIds));
    });

    socket.on('disconnect', () => {
      console.log('disconnected from server');
    });

    return () => socket.disconnect();
  }, [user]);

  // ✅ Wait until user info is loaded from localStorage
  if (loading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <h1 className="text-xl font-semibold">Loading...</h1>
      </div>
    );
  }
  if (loading) {
  return (
    <div className="h-screen w-screen flex justify-center items-center bg-gray-100">
      <span className="loading loading-spinner loading-lg text-indigo-600"></span>
    </div>
  );
}

  return (
    <BrowserRouter>
    
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/addfriend" element={<Addfriend />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Ui/>
            </ProtectedRoute>
          
          }
        />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
};

export default App;
