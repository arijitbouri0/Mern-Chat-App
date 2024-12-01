import { createContext, useContext, useEffect, useMemo } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

const getSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {
    // Create socket instance and memoize it
    const socket = useMemo(() => io("https://mern-chat-app-backend-vudf.onrender.com", {
        withCredentials: true,
    }), []);  // Empty array ensures it's only created once


    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}

export {
    SocketProvider,
    getSocket
};
