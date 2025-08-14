import { createContext, useContext, useEffect, useState } from "react"; // React hooks & context API
import { useRecoilValue } from "recoil"; // Read global state values from Recoil
import io from "socket.io-client"; // Client-side Socket.IO for real-time communication
import userAtom from "../atoms/userAtom"; // Global state for the currently logged-in user

// -----------------------------
// Create Socket Context
// -----------------------------
const SocketContext = createContext(); // Holds the socket instance & online user data

/**
 * Custom hook: useSocket
 * Allows components to easily access socket and online users from context.
 */
export const useSocket = () => {
  return useContext(SocketContext);
};

// -----------------------------
// Socket Context Provider Component
// -----------------------------
export const SocketContextProvider = ({ children }) => {
  // socket → Socket.IO connection instance
  const [socket, setSocket] = useState(null);

  // onlineUsers → array of user IDs currently online
  const [onlineUsers, setOnlineUsers] = useState([]);

  // Get the current logged-in user from global state
  const user = useRecoilValue(userAtom);

  /**
   * useEffect:
   * Establish a socket connection when the user's ID is available.
   * Also, listen for updates about online users.
   */
  useEffect(() => {
    // Create a socket connection to the backend server
    const socket = io("http://localhost:7500", {
      query: {
        // Pass user ID in query so server can identify the user
        userId: user?._id,
      },
    });

    // Save socket instance to state
    setSocket(socket);

    // Listen for "getOnlineUsers" event from the server
    socket.on("getOnlineUsers", (users) => {
      setOnlineUsers(users); // Update online users list
    });

    // Cleanup: Close socket connection when component unmounts or user changes
    return () => socket && socket.close();
  }, [user?._id]); // Reconnect when logged-in user changes

  // Debug log: Show currently online users in console
  console.log(onlineUsers, "Online users");

  /**
   * Provide socket instance & online users to child components.
   */
  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
