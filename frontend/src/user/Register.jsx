import React, { useState } from 'react'
import { useNavigate } from 'react-router';
import axios from 'axios';
import Login from './Login';
import {toast } from 'react-toastify';
const Register = () => {
  const [loading, setloading] = useState(false);
  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [phone, setphone] = useState("");
  const [dp, setdp] = useState("");
  const [previewdp, setpreviewdp] = useState("");
  const navigate = useNavigate();

  const url = import.meta.env.VITE_API_URL;
  const handleDpChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setdp(file); // keep file for FormData
    setpreviewdp(URL.createObjectURL(file)); // instant preview in <img>
  }
};

  const submithandler = async (e) => {
  e.preventDefault();
setloading(true);
  const formData = new FormData();
  formData.append('username', username);
  formData.append('email', email);
  formData.append('password', password);
  formData.append('phone', phone);
  formData.append('dp', dp); // append file

  try {
    const response = await axios.post(`${url}/user/register`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      withCredentials: true
    });

    if (response.data.success) {
      toast.success(response.data.message);
      navigate('/login');
    }
    else if (response.data.success === false) {
      toast.info(response.data.message);
    }
    
  } catch (error) {
    console.error("Registration failed:", error);
  }
  finally{
    setloading(false);
  }
}
if (loading) {
  return (
    <div className="h-screen w-screen flex justify-center items-center bg-gray-100">
      <span className="loading loading-spinner loading-lg text-indigo-600"></span>
    </div>
  );
}


  return (
    <div className=' h-screen w-screen flex justify-center items-center ' style={{ backgroundColor: "rgba(242,244,247,1)" }}>

      <div className='flex flex-col items-center  p-4 w-2xl m-4 ' style={{ backgroundColor: "rgba(254,254,255,255)" }}>
        <h1 className='text-xl font-bold'>Sign up</h1>
        <form onSubmit={submithandler} className='flex flex-col gap-y-2 '>
    <div className="flex flex-col items-center justify-center w-full">
  <div className="relative h-20 w-20 rounded-full border-2 border-gray-800 bg-gray-200 mb-2 overflow-hidden cursor-pointer">
    {previewdp ? (
      // Show image preview
      <img
        src={previewdp}
        alt="Preview"
        className="object-cover w-full h-full"
      />
    ) : (
      // Show placeholder SVG
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="gray"
          viewBox="0 0 24 24"
          className="w-10 h-10"
        >
          <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
        </svg>
      </div>
    )}

    {/* File input */}
    <input
    
      type="file"
      accept="image/*"
      onChange={handleDpChange}
      required
      className="absolute inset-0 opacity-0 cursor-pointer"
     
    />
  </div>
</div>



          <div>
            <p className='text-sm font-semibold'>Username</p>
            <label className="input validator">
              <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </g>
              </svg>
              <input
                type="text"
                required
                placeholder="Username"
                pattern="[A-Za-z][A-Za-z0-9\-]*"
                minLength="3"
                maxLength="30"
                title="Only letters, numbers or dash"
                value={username}
                onChange={(e) => setusername(e.target.value)}
              />
            </label>

          </div>
          <div>
            <p className='text-sm font-semibold'>Email</p>
            <label className="input validator">
              <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </g>
              </svg>
              <input type="email"
                placeholder="mail@site.com"
                required
                value={email}
                onChange={(e) => setemail(e.target.value)} />
            </label>
            <div className="validator-hint hidden">Enter valid email address</div>
          </div>
          <div>
            <p className='text-sm font-semibold'>Password</p>
            <label className="input validator">
              <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
                  ></path>
                  <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                </g>
              </svg>
              <input
                type="password"
                required
                placeholder="Password"
                minLength="8"
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
              />
            </label>
            <p className="validator-hint hidden">
              Must be more than 8 characters, including
              <br />At least one number <br />At least one lowercase letter <br />At least one uppercase letter
            </p>
          </div>

          <div>
            <p className='text-sm font-semibold'>Phone</p>
            <label className="input validator">
              <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                <g fill="none">
                  <path
                    d="M7.25 11.5C6.83579 11.5 6.5 11.8358 6.5 12.25C6.5 12.6642 6.83579 13 7.25 13H8.75C9.16421 13 9.5 12.6642 9.5 12.25C9.5 11.8358 9.16421 11.5 8.75 11.5H7.25Z"
                    fill="currentColor"
                  ></path>
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6 1C4.61929 1 3.5 2.11929 3.5 3.5V12.5C3.5 13.8807 4.61929 15 6 15H10C11.3807 15 12.5 13.8807 12.5 12.5V3.5C12.5 2.11929 11.3807 1 10 1H6ZM10 2.5H9.5V3C9.5 3.27614 9.27614 3.5 9 3.5H7C6.72386 3.5 6.5 3.27614 6.5 3V2.5H6C5.44771 2.5 5 2.94772 5 3.5V12.5C5 13.0523 5.44772 13.5 6 13.5H10C10.5523 13.5 11 13.0523 11 12.5V3.5C11 2.94772 10.5523 2.5 10 2.5Z"
                    fill="currentColor"
                  ></path>
                </g>
              </svg>
              <input
                type="tel"
                className="tabular-nums"
                required
                placeholder="Phone"
                pattern="[0-9]*"
                minLength="10"
                maxLength="10"
                title="Must be 10 digits"
                value={phone}
                onChange={(e) => setphone(e.target.value)}
              />
            </label>
            <p className="validator-hint">Must be 10 digits</p>
          </div>
          


          <button type='submit' className='text-white w-52 rounded-sm py-1 text-sm font-semibold' style={{ backgroundColor: "rgba(79,70,229,255)" }}>
            Sign up
          </button>
          <div className='flex justify-between w-full text-sm font-semibold my-2'>
            <p className='text-gray-600 text-sm'>don't have an account</p>
            <p className='text-blue-600 cursor-pointer' onClick={() => { navigate('/login') }}>Login</p>
          </div>
        </form>

      </div>


    </div>
  )
}

export default Register