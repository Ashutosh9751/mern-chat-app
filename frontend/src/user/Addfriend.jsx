import React, { use, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
const Addfriend = () => {

    const [customname, setcustomname] = useState("")
    const [phone, setphone] = useState("")
    
    const navigate=useNavigate();
      const url = "http://localhost:3000/api"
  const submithandler = async (e) => {
    e.preventDefault();

    const response = await axios.post(`${url}/user/adduser`, {
      customname,
      phone
    },
      {
        headers: {
          'Content-Type': 'application/json'
          
        },
        withCredentials: true
      }
    );
    if (response) {
      setcustomname("");
      setphone("");
       console.log(response.data.message);
      if(response.data.message === "User not found") {
     
 toast.info(response.data.message);
      
    }
    if(response.data.message === "User added as friend successfully") {
      toast.success(response.data.message);
      navigate(`/home`);
    }
  }
  }
 return (
      <div className=' h-screen w-screen flex justify-center items-center ' style={{ backgroundColor: "rgba(242,244,247,1)" }}>

        <div className='flex flex-col items-center  p-4 w-2xl m-4 ' style={{ backgroundColor: "rgba(254,254,255,255)" }}>
          <h1 className='text-xl font-bold'>friend</h1>
          <form  className='flex flex-col gap-y-2 ' onSubmit={submithandler}>

            
              <div>
              <p className='text-sm font-semibold'> user name</p>
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
             value={customname}
             onChange={(e)=>setcustomname(e.target.value)}
                />
              </label>

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
                onChange={(e)=>setphone(e.target.value)}
                />
              </label>
              <p className="validator-hint">Must be 10 digits</p>
            </div>

            <button type='submit' className='text-white w-52 rounded-sm py-1 text-sm font-semibold' style={{ backgroundColor: "rgba(79,70,229,255)" }}>
              add
            </button>
         
          </form>

        </div>


      </div>
    )
}

export default Addfriend