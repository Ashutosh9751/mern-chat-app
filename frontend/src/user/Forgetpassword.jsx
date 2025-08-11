import React from 'react'
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router';
  import { toast } from 'react-toastify';
  import { FaArrowLeft } from "react-icons/fa";
const Forgetpassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const url = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const generateOtp = async () => {
    try {
      const res = await axios.post(`${url}/password/generateotpforforgetpassword`, { email });
      if (!res.data.success) {
        toast.error(res.data.message);
        setStep(1);
        return;
      }
      else if (res.data.success) {
      toast.success(res.data.message);
      setStep(2);}
    } catch (error) {
      toast.error(error.response?.data?.message || "Error generating OTP");
      setStep(1);
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await axios.post(`${url}/password/verifyotpforforgetpassword`, { email, otp });
      if (!res.data.success ) {
        toast.error(res.data.message);
        setStep(2);
      }
      else if (res.data.success) {
      toast.success(res.data.message);
      setStep(3);}
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid or expired OTP");
      setStep(2);
    }
  };

  const updatePassword = async () => {
    try {
      const res = await axios.post(`${url}/password/newpassword`, { email, newpassword: newPassword });
      if (!res.data.success) {
        toast.error(res.data.message);
        setStep(3);
        return;
      }
      else if (res.data.success) {
      toast.success(res.data.message);
      navigate('/login');
      // Optionally reset the form or redirect to login
      setStep(1);
      setEmail("");
      setOtp("");
      setNewPassword("");
      navigate('/login');}
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating password");
      setStep(3);
    }
  };
  if (step === 1) {
    return (
      <div className='outer flex h-screen w-screen justify-center items-center flex-col'>
        <div className='outertwo flex flex-col  items-center w-full h-full border border-gray-300 rounded-2xl relative'>
          <div className='bg-violet-500  top-0 w-full h-28 flex flex-col justify-between rounded-t-2xl mb-10'>
            <div className='flex justify-start mt-6 gap-x-2'>
              <div className='flex justify-center items-center'>
             <FaArrowLeft  className='text-white text-3xl' onClick={() => navigate('/login')}/>

              </div>
            <h1 className='text-white text-lg font-semibold p-2'>Forgetpassword</h1>
            </div>
          
            <svg className="wave w-full h-12" viewBox="0 0 500 50" preserveAspectRatio="none"  >
              <path d="M0,30 C120,70 350,-20 500,30 L500,50 L0,50 Z" fill="rgba(255,255,255,0.06)" />
            </svg>
          </div>

          <div className=' body flex flex-col justify-center items-center gap-y-3 '>


            <div>
              <h2> Enter your email</h2>

            </div>
            <div className='w-full px-4'>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className='border border-gray-300 rounded-xl p-2 w-full '
              />
            </div>
            <div className='w-full px-4'>
              <button className='btn bg-violet-500 border rounded-xl text-white w-full ' onClick={generateOtp}>Generate OTP</button>

            </div>
            <div className='w-full flex justify-center px-7'>
              <p className='text-sm text-gray-500'>
                we will send a verification code to your email address.

              </p>
            </div>


          </div>

        </div>
      </div>
    )
  }


  if (step === 2) {
    return (
      <div className='outer flex h-screen w-screen justify-center items-center flex-col'>
        <div className='outertwo flex flex-col  items-center w-full h-full border border-gray-300 rounded-2xl relative'>
           <div  className='bg-violet-500  top-0 w-full h-28 flex flex-col justify-between rounded-t-2xl mb-10'>
            <div className='flex justify-start mt-6 gap-x-2'>
              <div className='flex justify-center items-center'>
             <FaArrowLeft  className='text-white text-3xl' onClick={() =>setStep(1)}/>

              </div>
            <h1 className='text-white text-lg font-semibold p-2'>Forgetpassword</h1>
            </div>
          
            <svg className="wave w-full h-12" viewBox="0 0 500 50" preserveAspectRatio="none"  >
              <path d="M0,30 C120,70 350,-20 500,30 L500,50 L0,50 Z" fill="rgba(255,255,255,0.06)" />
            </svg>
          </div>
          <div className=' body flex flex-col justify-center items-center gap-y-3 '>
            <div>
              <h2>Verify OTP</h2>

            </div>
            <div className='w-full px-4'>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className='border border-gray-300 rounded-xl p-2 w-full'
              />
            </div>
            <div className='w-full px-4'>
              <button className='btn bg-violet-500 border rounded-xl text-white w-full' onClick={verifyOtp}>Verify OTP</button>

            </div>
             <div className='w-full flex justify-center px-7'>
              <p className='text-sm text-gray-500'>
                enter the verification code enter to your email address.

              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }


  if (step === 3) {
    return (
          
      <div className='outer flex h-screen w-screen justify-center items-center flex-col'>
        <div className='outertwo flex flex-col  items-center w-screen h-screen border border-gray-300 rounded-2xl relative'>
           <div className='bg-violet-500  top-0 w-full h-28 flex flex-col justify-between rounded-t-2xl mb-10'>
            <div className='flex justify-start mt-6 gap-x-2'>
              <div className='flex justify-center items-center'>
             <FaArrowLeft  className='text-white text-3xl' onClick={() => setStep(2)}/>

              </div>
            <h1 className='text-white text-lg font-semibold p-2'>Forgetpassword</h1>
            </div>
          
            <svg className="wave w-full h-12" viewBox="0 0 500 50" preserveAspectRatio="none"  >
              <path d="M0,30 C120,70 350,-20 500,30 L500,50 L0,50 Z" fill="rgba(255,255,255,0.06)" />
            </svg>
          </div>
 <div className=' body flex flex-col justify-center items-center gap-y-3 '>
  <div>
        <h2> Reset Password</h2>

  </div>
  <div className='w-full px-4'>
     <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
           className='border border-gray-300 rounded-xl p-2 w-full '
        />
  </div>
  <div className='w-full flex justify-center px-7'>
   <button onClick={updatePassword} className='btn bg-violet-500 border rounded-xl text-white w-full'>Update Password</button>
  </div>
 <div className='w-full flex justify-center px-7'>
              <p className='text-sm text-gray-500'>
                enter the verification code enter to your email address.

              </p>
            </div>
     
      </div>
        </div>
      </div>
     
    )
  }

}

export default Forgetpassword