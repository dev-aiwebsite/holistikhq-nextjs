"use client";

import { io, Socket } from "socket.io-client";
import { useAppStateContext } from "./context/AppStatusContext";
import { useEffect, useState } from "react";

// Custom Hook to create and manage the socket
export function useSocket() {
  const { appState } = useAppStateContext();
  const [socket, setSocket] = useState<Socket | null>(null);
const currentUser = appState.currentUser
  useEffect(() => {
    if (currentUser) {
      // Initialize the socket with query parameters
      const newSocket:Socket = io({
        query: {
          userName: currentUser.firstName || "Guest",
          userId: currentUser.id || "unknown"
        }
      });
      setSocket(newSocket);

      // Cleanup on unmount
      return () => {
        newSocket.close();
      };
    }
  }, [appState]);

  return socket;
}
