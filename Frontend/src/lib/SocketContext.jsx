import { createContext, useContext, useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import { setOnlineUsers, addOnlineUser, removeOnlineUser } from "../redux/chatSlice";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null); // Use a ref to hold the single socket instance
  const { user: currentUser } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const userId = currentUser?._id;

  useEffect(() => {
    if (userId) {
      // Only create a socket if one doesn't already exist in our ref
      if (!socketRef.current) {
        const newSocket = io('https://chat-app-m37n.onrender.com', {
          query: { userId: userId },
          transports: ['websocket'],
        });

        socketRef.current = newSocket; // Store it in the ref
        setSocket(newSocket); // And in state for consumers

        newSocket.on('initialOnlineFriends', (ids) => dispatch(setOnlineUsers(ids)));
        newSocket.on('statusUpdate', (update) => {
          if (update.status === 'online') dispatch(addOnlineUser(update.userId));
          else dispatch(removeOnlineUser(update.userId));
        });
      }
    } else {
      // User logged out
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
      }
    }

    // The main cleanup function, called when the component unmounts
    return () => {
      // This ensures disconnection when the app is closed
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
      }
    };
  }, [userId, dispatch]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};