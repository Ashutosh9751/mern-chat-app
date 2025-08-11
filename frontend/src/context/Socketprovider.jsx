import { io } from "socket.io-client";
import socketcontext from "./contextstate";
import { useEffect, useState} from "react";
import { useSelector } from "react-redux";


const Socketprovider = ({children}) => {
      const url = import.meta.env.VITE_SOCKET_URL;
  const user = useSelector((state) => state.user.userInfo);
  const [socket, setsocket] = useState(null);

  useEffect(() => {
       if (!user?.userId) {
      if (socket) {
        socket.disconnect();
        setsocket(null);
      }
      return;
    }
    
    const s = io(url, {
      transports: ["websocket"],
      withCredentials: true,
      query: { logineduser: user.userId },
    });

    s.on('connect', () => {
      console.log('Connected to socket server');
    });
    setsocket(s);

  }, [user?.userId,url]);

 if (user?.userId && !socket) {
    return <div className="h-screen w-screen flex justify-center items-center bg-gray-100">
      <span className="loading loading-spinner loading-lg text-indigo-600"></span>
    </div>;
  }

  return (
    <socketcontext.Provider value={socket}>
      {children}
    </socketcontext.Provider>
  );


}

export default Socketprovider