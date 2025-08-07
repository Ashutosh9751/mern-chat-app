import React, { useEffect, useState } from 'react';
import Left from './Left';
import Middle from './Middle';
import Right from './Right';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

const Ui = () => {
  const [friend, setfriend] = useState([]);
  const [onchat, setonchat] = useState(false);
  const [ismobile, setismobile] = useState(window.innerWidth < 768 ? true : false);
  const url = import.meta.env.VITE_API_URL;

  const logininfo = useSelector((state) => state.user?.userInfo);
  const ChatScreen = useSelector((state) => state.user?.isonchatscreen);
  

  // ❗ Redirect if not logged in


  useEffect(() => {
    const getfriends = async () => {
      try {
        const friends = await axios.get(`${url}/friends/getfriends`, {
          withCredentials: true
        });
        if (friends.data) {
          if (friends.data.message === "you have no friends yet") {
            setfriend([]);
          } else {
            setfriend(friends.data.friends);
       
          }
}
      } catch (err) {
        console.error("Failed to fetch friends:", err);
      }
    };
    getfriends();
  }, [friend, url, logininfo]);

  useEffect(() => {
    const handlesize = () => {
      setismobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handlesize);
    return () => {
      window.removeEventListener('resize', handlesize);
    };
  }, []);

  useEffect(() => {
    setonchat(ChatScreen);
  }, [ChatScreen]);

  // ✅ Only show UI if user is logged in
  if (!logininfo || !logininfo.userId || !logininfo.username || !logininfo.dp) {
    return null; // or loading screen if preferred
  }

  if (!ismobile) {
    return (
      <div className='w-screen h-screen flex'>
        <Left />
        <Middle friend={friend} />
        <Right />
      </div>
    );
  } else if (ismobile && !onchat) {
    return (
      <div className='w-screen h-screen flex'>
        <Left />
        <Middle friend={friend} />
      </div>
    );
  } else if (ismobile && onchat) {
    return (
      <div className='w-screen h-screen flex'>
        <Right />
      </div>
    );
  }

  return null;
};

export default Ui;
