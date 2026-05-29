import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { BACKEND_URL } from "@/lib/api";

interface SocketContextType {
  socket: Socket | null;
  onlineUsers: string[];
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  onlineUsers: [],
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const { user, loading } = useAuth();

  useEffect(() => {
    if (user && !loading) {
      const newSocket = io(BACKEND_URL, {
        query: {
          userId: user._id,
        },
      });

      setSocket(newSocket);

      newSocket.on("getOnlineUsers", (users: string[]) => {
        setOnlineUsers(users);
      });

      return () => {
        newSocket.close();
        setSocket(null);
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
