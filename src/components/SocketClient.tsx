"use client"
import { useSocket } from "@app/socket";
import { FormEvent, useEffect, useState } from "react";

export default function SocketClient() {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [messages, setMessages] = useState([]);
  const [socketId, setSocketId] = useState("");
  const socket = useSocket()
  useEffect(() => {
    if(!socket) return
    const onConnect = ()=> {
        setIsConnected(true);
        setTransport(socket.io.engine.transport.name);
        setSocketId(socketId);
  
        socket.io.engine.on("upgrade", (transport) => {
          setTransport(transport.name);
        });
      }

    if (socket.connected) {
      onConnect();
    }

   

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    // Listen for incoming messages from the server
    socket.on('message', (newMessage) => {
        console.log(newMessage,'newMessage')
    //   if (senderId !== socketId) { // Check if the sender is not the current client
        console.log('New message received:', newMessage);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
    //   }
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off('message');
    };
  }, [socket]); // Add `socketId` as a dependency

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    let fd = new FormData(e.target as HTMLFormElement);
    const message = fd.get('message');
    console.log('Message sent:', message);
    setMessages((prevMessages) => [...prevMessages, message]);
    // Emit the message to the server
    socket.emit('message', message);
  }

  return (
    <div>
      <p>Status: {isConnected ? "connected" : "disconnected"}</p>
      <p>Transport: {transport}</p>
      <form onSubmit={handleSubmit}>
        <input type="text" name="message" placeholder="Write some text..." />
        <button type="submit">Send</button>
      </form>

      <div>
        {messages.length ? (
          messages.map((m, index) => <span className="block" key={index}>{m}</span>)
        ) : (
          <span>No message at this time</span>
        )}
      </div>
    </div>
  );
}
