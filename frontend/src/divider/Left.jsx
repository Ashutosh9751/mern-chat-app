import React from 'react'
import { PiChatsCircleDuotone } from "react-icons/pi";
import { MdMenu } from "react-icons/md";
import { IoMdContact } from "react-icons/io";
import { FaUserGroup } from "react-icons/fa6";
import { CiLogout } from "react-icons/ci";
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { IoPersonAdd } from "react-icons/io5";
import { logout, onChatScreen, selectUser } from '../redux/userslice';
import axios from 'axios';
import { toast } from 'react-toastify';
const Left = () => {
  const url = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${url}/user/logout`, {
        withCredentials: true
      });
      if (response.status === 200) {
        toast.success(response.data.message);
        dispatch(onChatScreen(false));
        dispatch(selectUser(null));
        dispatch(logout());
        localStorage.removeItem('userid');
        localStorage.removeItem('username');
        localStorage.removeItem('dp');
        navigate('/login');

      }
    } catch (error) {
      console.error("Logout failed", error);
    }
    
  };
  const addfriend=async ()=>{
   
    navigate('/addfriend');
    dispatch(onChatScreen(false));
    dispatch(selectUser(null));
  }
  const getprofile=async ()=>{
   
    navigate('/profile');
    dispatch(onChatScreen(false));
    dispatch(selectUser(null));
  }
  return (
    <div className='md:w-1/10 md:h-screen bg-gray-800 flex items-center flex-col'>
      <div className='flex flex-col items-center gap-y-2 mt-4'>
        <div className='flex flex-col items-center'>

          <div className='flex flex-col items-center' onClick={addfriend}>
           <IoPersonAdd  className='text-4xl text-gray-400' />
            <p className='text-sm text-gray-400'>add</p>
          </div>
          </div>
        <div className='flex flex-col items-center'>
          <PiChatsCircleDuotone className='text-4xl text-gray-400' />
          <p className='text-sm text-gray-400'>All chats</p>
        </div>
        <div className='flex flex-col items-center' onClick={getprofile}>
          <IoMdContact className='text-4xl text-gray-400' />
          <p className='text-sm text-gray-400'>profile</p>

        </div>
        <div className='flex flex-col items-center'>
          <FaUserGroup className='text-4xl text-gray-400' />
          <p className='text-sm text-gray-400'>group</p>

        </div>
        <div className='flex flex-col items-center' onClick={handleLogout}>
          <CiLogout className='text-4xl text-gray-400' />
          <p className='text-sm text-gray-400'>Logout</p>

        </div>

      </div>



    </div>
  )
}

export default Left