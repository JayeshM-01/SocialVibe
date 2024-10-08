import axios from "axios";
import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

function Chat({ socket, username, room , email }) {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
  
    useEffect(() => {
      fetchComments();
    }, []);
  
    // Function to fetch comments for the image
    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/messages/${room}`);
        setMessageList(response.data);
        
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };
  
    const sendMessage = async () => {
      if (currentMessage !== "") {
        const currentDate = new Date();  // Get the current date
        const messageData = {
          room: room,
          author: username,
          email: email,
          message: currentMessage,
          time:
            new Date(Date.now()).getHours() +
            ":" +
            new Date(Date.now()).getMinutes(),
          date: 
            currentDate.getDate() +
            "/" +
            (currentDate.getMonth() + 1) +  // Months are zero-indexed, so add 1
            "/" +
            currentDate.getFullYear()
        };
  
        await socket.emit("send_message", messageData);
        setMessageList((list) => [...list, messageData]);
        setCurrentMessage("");
      }
    };
  
    useEffect(() => {
      const receiveMessageListener = (data) => {
        setMessageList((list) => [...list, data]);
      };
  
      socket.on("receive_message", receiveMessageListener);
  
      // Cleanup function to avoid adding multiple listeners
      return () => {
        socket.off("receive_message", receiveMessageListener);
      };
    }, []);
  
    return (
      <div className="chat-window">
        <div className="chat-header">
          <p>Live Chat</p>
        </div>
        <div className="chat-body">
          <ScrollToBottom className="message-container">
            {messageList.map((messageContent, index) => {
                {console.log(username)}
                {console.log(messageContent.author)}
              return (
                <div
                  key={index} // Add a unique key to avoid rendering issues
                  className="message"
                  id={(username === messageContent.author || messageContent.username===username) ? "you" : "other"}
                  
                >
                  <div>
                      <p id="author">{messageContent.author || messageContent.username}</p>
                    <div className="message-content">
                      <p>{messageContent.message}</p>
                    </div>
                    <div className="message-meta">
                      <p id="time">{messageContent.time}</p>
                      <p id="time">{messageContent.date}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </ScrollToBottom>
        </div>
        <div className="chat-footer">
          <input
            type="text"
            value={currentMessage}
            placeholder="Hey..."
            onChange={(event) => {
              setCurrentMessage(event.target.value);
            }}
            onKeyPress={(event) => {
              event.key === "Enter" && sendMessage();
            }}
          />
          <button onClick={sendMessage}>&#9658;</button>
        </div>
      </div>
    );
}

export default Chat;
