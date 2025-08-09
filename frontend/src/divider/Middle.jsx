import axios from 'axios';
import React, { useState } from 'react'
import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { onChatScreen, selectUser } from '../redux/userslice';
import { clearUnread } from '../redux/userslice';
import {logout} from '../redux/userslice';
const Middle = () => {
  const dispatch = useDispatch();
  const url = import.meta.env.VITE_API_URL;


  const [friend, setfriend] = useState([]);
  const [filterfriend, setfilterfriend] = useState(friend);
  const [loading, setloading] = useState(false);

  const onlineuser = useSelector((state) => state.user.onlineuser);
  const unreadMessages = useSelector((state) => state.user.unreadMessages) || {};
  const logininfo = useSelector((state) => state.user?.userInfo);
const isLoggedIn=useSelector((state) => state.user.isLoggedIn);
  
  // ✅ Only show UI if user is logged in
  if (!logininfo || !logininfo.userId || !logininfo.username || !logininfo.dp) {
    return null; // or loading screen if preferred
  }

  // ✅ Fetch friends list on component mount
 useEffect(() => {
  setloading(true);
    const getfriends = async () => {
      try {
        const friends = await axios.get(`${url}/friends/getfriends`, {
          withCredentials: true
        });
        if (friends.data) {
          if (friends.data.friends.length === 0) {
            setfriend([]);
          } else if (friends.data.friends.length > 0) {
            setfriend(friends.data.friends);
       
          }
}
      } catch (err) {
        if(err.status==401){
          console.error("Unauthorized access:", err);
       dispatch(logout());
        } else {
          console.error("Failed to fetch friends:", err);
        }
      }
      finally {
        setloading(false);
      }
    };
    getfriends();
  }, [ url, logininfo]);
  useEffect(() => {
    setfilterfriend(friend || []);
  }, [friend]);

  const searchuser = (e) => {
    const searchterm = (friend || []).filter((item) =>
      item.customname.toLowerCase().startsWith(e.target.value.toLowerCase())
    );
    setfilterfriend(searchterm);
  };

  const onclickhandler = (user) => {
    dispatch(selectUser(user));
    dispatch(onChatScreen(true));
     dispatch(clearUnread(user.user._id)); 
  };

  // ✅ Prevent crash on first render
if(loading){
    return (
        <div className='w-10/10 overflow-auto md:w-3/10 justify-center items-center h-screen flex'>
    
      <span className="loading loading-spinner loading-lg text-indigo-600"></span>
      
    
    </div>
  );
}


else  {
  return (
    <div className='w-10/10 overflow-auto md:w-3/10'>
      <div className='p-4 w-10/10'>
        <div className='h-min mb-2 '>
          <label className="input rounded-4xl w-full">
            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </g>
            </svg>
            <input type="search" required placeholder="Search" onChange={searchuser} />
          </label>
        </div>
        <div>
          <div>
            {friend.length === 0 ? (
              <div>
                <h1 className='text-2xl font-bold text-center'>You have no friends yet</h1>
                <p className='text-center'>Please add friends to chat with them</p>
              </div>
            ) : (
              filterfriend.map((item) => (
                <div key={item._id} onClick={() => { onclickhandler(item) }}>
                  <div className='flex hover:bg-gray-200'>
                    <div className={`avatar ${onlineuser.includes(item.user._id) ? 'avatar-online' : 'avatar-offline'}`}>
                      <div className="w-12 rounded-full">
                        {item.user.dp && <img src={item.user.dp} alt="dp" />}
                      </div>
                    </div>
                <div className="ml-2 flex justify-between items-center w-full pr-4">
  <h2 className="text-lg font-bold">
    {item.customname === "" ? item.user.username : item.customname}
  </h2>
  
  {unreadMessages[item.user._id] > 0 && (
    <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full min-w-[20px] text-center">
      {unreadMessages[item.user._id]}
    </span>
  )}
</div>

                  </div>
                  <br />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
  
};

export default Middle;


