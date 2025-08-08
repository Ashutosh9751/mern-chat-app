import React, { useState } from 'react'
import { useNavigate } from 'react-router';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../redux/userslice';
import { toast } from 'react-toastify';
const Login = () => {
  const navigate = useNavigate();
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const dispatch = useDispatch();
  const url = import.meta.env.VITE_API_URL;
  const submithandler =async(e) => {
    e.preventDefault();

    try {
      const response=await axios.post(`${url}/user/login`, {
      
      email,
      password
    },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      }
    );

    if (response.status==200) {
      if(response.data.message=="Invalid credential"  || response.data.message=="User not found please signup"){
        toast.error(response.data.message);
      } else {
       
        const userId = response.data.user._id;
        const username = response.data.user.username;
        const dp= response.data.user.dp;

        localStorage.setItem('userid', userId);
        localStorage.setItem('username', username);
        localStorage.setItem('dp', dp);
        dispatch(login({ userId, username, dp }));
        toast.success(response.data.message);
        navigate(`/`);
      }
    }
  } catch (error) {
    console.error(error);
  }
}

  return (
    <div className=' h-screen w-screen flex justify-center items-center ' style={{ backgroundColor: "rgba(242,244,247,1)" }}>

      <div className='flex flex-col items-center gap-y-4 p-4 w-2xl m-4 ' style={{ backgroundColor: "rgba(254,254,255,255)" }}>
        <h1 className='text-xl font-bold'>Sign in</h1>
        <form method="get" onSubmit={submithandler} className='flex flex-col gap-4' >


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

          <button type='submit' className='text-white w-52 rounded-sm py-1 text-sm font-semibold' style={{ backgroundColor: "rgba(79,70,229,255)" }}>
            Sign in
          </button>
          <div className='flex justify-between w-full text-sm font-semibold my-2' >
            <p className='text-gray-600 text-sm'>Have an account</p>
            <p className='text-blue-600 cursor-pointer' onClick={() => { navigate('/register') }}>Sign up</p>
          </div>
        </form>
      </div>


    </div>
  )
}

export default Login