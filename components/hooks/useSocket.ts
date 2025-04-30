"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket;

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      setIsConnected(true);
      console.log("Connected to socket server");
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      console.log("Disconnected from socket");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = (data: any) => {
    socket.emit("send_message", data);
  };

  const listenMessage = (callback: (data: any) => void) => {
    socket.on("receive_message", callback);
  };

  return { isConnected, sendMessage, listenMessage };
}
