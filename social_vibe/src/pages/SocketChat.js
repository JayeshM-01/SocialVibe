import React, { useEffect, useRef } from 'react';
import io from "socket.io-client";
import { useState } from "react";
import './schat.css';
import Chat from './Chat';
const PORT = "http://localhost:3001"
const socket = io.connect(PORT);

export const SocketChat = ({ id, name, email, closeCommentModal }) => {
  const [username, setUsername] = useState(name);
  const [room, setRoom] = useState(id);
  const chatRef = useRef(null); // Ref to the chat container

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
    }
  };

  useEffect(() => {
    joinRoom();

    // Function to handle clicks outside the chat container
    const handleClickOutside = (event) => {
      if (chatRef.current && !chatRef.current.contains(event.target)) {
        closeCommentModal(); // Call close function if clicked outside
      }
    };

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);

    // Clean up event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeCommentModal]);

  return (
    <div className="chat-container" ref={chatRef}>
      <div className="chat-header">
        <h2>Chat</h2>
        <button onClick={closeCommentModal} className="close-button">Close</button> {/* Close button */}
      </div>
      <div className="chat">
        {/* Chat component rendering */}
        <Chat socket={socket} username={username} room={room} email={email}/>
      </div>
    </div>
  );
};

export default SocketChat;
