import React, { useEffect, useState } from 'react';
import Left from './Left';
import Middle from './Middle';
import Right from './Right';

import {  useSelector } from 'react-redux';

const Ui = () => {
  const [onchat, setonchat] = useState(false);
  const [ismobile, setismobile] = useState(window.innerWidth < 768 ? true : false);
  const url = import.meta.env.VITE_API_URL;

  const logininfo = useSelector((state) => state.user?.userInfo);
  const ChatScreen = useSelector((state) => state.user?.isonchatscreen);
  const isringing = useSelector((state) => state.user?.isringing);

  // ❗ Redirect if not logged in


 

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

  // if (!ismobile) {
  //   return (
  //     <div className='w-screen h-screen flex'>
  //       <Left />
  //       <Middle  />
  //       <Right />
  //     </div>
  //   );
  // } else if (ismobile && !onchat) {
  //   return (
  //     <div className='w-screen h-screen flex'>
  //       <Left />
  //       <Middle  />
  //       <div className='hidden '>
  //       <Right/>

  //       </div>
  //     </div>
  //   );
  // } else if (ismobile && onchat) {
  //   return (
  //     <div className='w-screen h-screen flex'>
  //       <div className='hidden '>
  //         <Left/>
  //         <Middle />
  //       </div>
        
  //       <Right />
  //     </div>
  //   );
  // }
  if (!ismobile) {
    // Desktop: show all at once (fully visible)
    return (
      <div className="w-screen h-screen flex">
        <Left />
        <Middle />
        <Right />
      </div>
    );
  }

  // Mobile: always mount all three, but hide/show with styles

  return (
    <div className="w-screen h-screen flex">
      {/* Left and Middle shown only when NOT ringing and NOT on chat */}
      <div style={{ display: !isringing && !onchat ? 'flex' : 'none', flex: 1 }}>
        <Left />
        <Middle />
      </div>

      {/* Right shown when ringing or on chat */}
      <div style={{ display: isringing || onchat ? 'flex' : 'none', flex: 1 }}>
        <Right />
      </div>
    </div>
  );

  return null;
};

export default Ui;
