import React, { useEffect } from 'react';
import io from "socket.io-client";
import { useState } from "react";
import './schat.css';
import Chat from './Chat';

const socket = io.connect("http://localhost:3001");


export const SocketChat = ({id,name,email}) => {
  const [username, setUsername] = useState(name);
  const [room, setRoom] = useState(id);
  const [showChat, setShowChat] = useState(true);

  console.log(id);
  

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
    }
  };

  useEffect(()=>{
    joinRoom();
  },[])

return (
  <div className='chatbg'>
      <div className="App">
    {!showChat ? (
      <div className="joinChatContainer">
        <h3>Join A Chat</h3>
        <input
          type="text"
          placeholder="John..."
          onChange={(event) => {
            setUsername(event.target.value);
          }}
        />
        <input
          type="text"
          placeholder="Room ID..."
          onChange={(event) => {
            setRoom(event.target.value);
          }}
        />
        <button onClick={joinRoom}>Join A Room</button>
      </div>
    ) : (
      <Chat socket={socket} username={username} room={room} email={email}/>
    )}
  </div>
  </div>
)
}
