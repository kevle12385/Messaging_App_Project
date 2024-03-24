import io from 'socket.io-client';
import ReactDOM from "react-dom";
import React, { useEffect, useState, useRef } from "react";
import('../CSS/ChatApplication.css')
import axios from 'axios';
import { useAuth } from '../AuthContext.jsx'




  
function Chatroom({selectedId, foundMessages}) {
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState("");
    const [messageId, setMessageId] = useState("");

    const [messageRecieved, setMessageRecieved] = useState([]);
    const { setIsLoggedIn, isLoggedIn, currentUserID, currentUser } = useAuth();
    const [chatRoomFound, setChatRoomFound] = useState([]);
    const socketRef = useRef(null); // Use ref to store the socket instance
     
    useEffect(() => {
      if (!currentUserID || !selectedId) return;
  
      socketRef.current = io("http://localhost:3001", {
          transports: ["websocket", "polling"],
          query: { chatId: selectedId, userId: currentUserID },
      });
  
      socketRef.current.on("receive_message", (newMessage, newMessageId) => {
          setMessageRecieved((prev) => [...prev, newMessage]);

      });
  
      return () => {
          if (socketRef.current) {
              socketRef.current.disconnect();
          }
      };
  }, [currentUserID, selectedId]); // Include selectedId in dependencies

    // Define sendMessage using socketRef to access the current socket instance
    const sendMessage = () => {
      if (message.trim() && socketRef.current) {
          // Constructing the messageData object
          const messageData = {
              message: message,
              senderId: currentUserID, // Assuming you have access to the currentUserID
              // You can add more data here if needed
          };
  
          // Emitting the messageData object to the server
          socketRef.current.emit('send_message', messageData);
          setMessage("");
      }
  };
  


  
    const displayChat = async () => {
      try {
        const response = await axios.post('/api/findChatRoom', {userId: currentUserID, friendID: selectedId})
        setChatRoomFound(response.data)
        console.log(chatRoomFound);
      } catch (error) {
        
      }
    }

    

    useEffect(() => {
      if (isLoggedIn) {
        displayChat();
      }
    }, [isLoggedIn]); // Depend on isLoggedIn state
    







  return (
   
    <>
    <div></div>
    <div>
      <br/>
    <div className='message-Container'>
      <h1>Messages:</h1>
    </div>    
    {/* <div>{currentUserID}</div> */}
    <div>{foundMessages}</div>    
    <div className='textBar'>
  <input className="textInput" value={message} type="text" 
 placeholder='Message...' onChange={(event) =>{
      setMessage(event.target.value); }} />
  <button className="button3" onClick={sendMessage}>Send message</button>
  </div>
  <div>Merssages after database found: </div>
  <div className="chatroom">
      {messageRecieved.map((msg, index) => (
              <>
                <div 
                     key={`${msg.senderId}-${index}`}
                     className={msg.senderId === currentUserID ? 'sender' : 'receiver'}
                >
                    {msg.message}
                </div>
                <br/>
              </>
            ))}
</div>

</div>
    </>
  )
}

export default Chatroom;