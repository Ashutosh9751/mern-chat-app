import React, { useState } from 'react'
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { MdEdit } from "react-icons/md";
const Profile =() => {
    const [userprofile, setuserprofile] = useState({});
    const url = import.meta.env.VITE_API_URL;
    const logineduser=useSelector((state => state.user.userInfo));
    const [isdisabled, setisdisabled] = useState(true)
    const navigate=useNavigate();
    useEffect(() => {

 const getprofile=async()=>{
     try {
        const response =await axios.post(`${url}/user/profile`, {
    user:logineduser.userId
},
{
    headers: {
          'Content-Type': 'application/json'
 
    },
     withCredentials: true
});
if(response.data.success){
   setuserprofile({
    name:response.data.message.username,
    email:response.data.message.email,
    dp:response.data.message.dp,
    phone:response.data.message.phone
   })
}
else{
    response.data.message;
}

    } catch (error) {
        console.error("Error fetching profile:", error);
    }
        }
  getprofile();

//   return()=>{
//     getprofile();
//   }
        
    
     
    }, [])
const editprofile=()=>{
  navigate('/');
}
    
   

 return (
  <div className="h-screen flex justify-center items-center bg-gray-100">
    <div className="bg-white shadow-lg rounded-2xl p-6 w-full h-full max-w-sm text-center">
      
      {/* Profile Image */}
      <div className="flex justify-center">
        <img 
          src={userprofile.dp} 
          alt="Profile" 
          className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-md object-cover"
        />
        <MdEdit className="inline-block ml-2 cursor-pointer" onClick={editprofile} />
      </div>

      {/* Name */}
      <h2 className="mt-4 text-2xl font-semibold text-gray-800">
        {/* <input type="text" value={userprofile.name}   disabled={isdisabled} /> */}
        {/* <MdEdit className="inline-block ml-2 cursor-pointer" onClick={() => setisdisabled(false)} /> */}
        {userprofile.name}
      </h2>

      {/* Email */}
      <p className="text-gray-500 text-sm mt-1">
        {/* <input type="text" value={userprofile.email}   disabled={isdisabled} />
        <MdEdit className="inline-block ml-2 cursor-pointer" onClick={() => setisdisabled(false)} /> */}
{userprofile.email}
      </p>

      {/* Phone */}
      <p className="mt-2 text-gray-600 font-medium">
        📞 {userprofile.phone}
        {/* <MdEdit className="inline-block ml-2 cursor-pointer" onClick={editprofile} /> */}
      </p>

      {/* Buttons */}
      <div className="mt-6 flex justify-center space-x-4">
        {/* <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg shadow" onClick={editprofile} style={{ display: isdisabled ? 'none' : 'block' }}>
          Edit Profile
        </button> */}
        <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg shadow" onClick={editprofile} >
          Exit
        </button>
      
      </div>
    </div>
  </div>
);

}

export default Profile