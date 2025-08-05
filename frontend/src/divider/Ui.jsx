import React, { use, useEffect, useState } from 'react'
import Left from './Left'
import Middle from './Middle'
import Right from './Right'
import axios from 'axios'

import { useSelector } from 'react-redux'
import { onChatScreen, selectUser } from '../redux/userslice';


const Ui = () => {

  const [friend, setfriend] = useState([])
  const [onchat, setonchat] = useState(false)

  const [ismobile, setismobile] = useState(window.innerWidth < 768 ? true : false);
  const url = "http://localhost:3000/api"
  const ChatScreen = useSelector((state) => state.user?.isonchatscreen);
  const selectedUser = useSelector((state) => state.user?.selectedUser);
  useEffect(() => {


    const getfriends = async () => {

      const friends = await axios.get(`${url}/friends/getfriends`, {
        withCredentials: true
      });
if(friends.data.message === "you have no friends yet") {
  setfriend([]);
      
    } else {
    
    setfriend(friends.data.friends);
    }
  }
    getfriends();
  }, [])
  useEffect(() => {
    const handlesize = () => {
      setismobile(window.innerWidth < 768);
    }

    window.addEventListener('resize', handlesize)

    return () => {
      window.removeEventListener('resize', handlesize);
    }
  }, [])
  useEffect(() => {
    setonchat(ChatScreen);
    
  }, [ChatScreen])



  if (!ismobile) {
    return (
      <div className='w-screen h-screen flex'>
        <Left />
        <Middle friend={friend} />
        <Right />
      </div>
    )
  }
  else if (ismobile && !onchat) {
    return (
      <div className='w-screen h-screen flex'>
        <Left />
        <Middle friend={friend} />
      </div>
    )

  }
  else if (ismobile && onchat) {
   
    return (
      <div className='w-screen h-screen flex' >
        <Right />
      </div>

    )
  }
}
export default Ui