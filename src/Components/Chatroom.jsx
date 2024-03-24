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

    const [messageReceived, setMessageRecieved] = useState([]);
    const { setIsLoggedIn, isLoggedIn, currentUserID, currentUser } = useAuth();
    const [chatRoomFound, setChatRoomFound] = useState([]);
    const socketRef = useRef(null); // Use ref to store the socket instance
    const [sendMessageClicked, setSendMessageClicked] = useState(false);

    const handleReceiveMessage = (messageData) => {
      console.log("handleReceiveMessage triggered", messageData);
      setMessageReceived(prev => [...prev, messageData]);
    };


    useEffect(() => {
      console.log("useEffect for setting up socket is running");

      if (!currentUserID || !selectedId) {
        console.log("Missing currentUserID or selectedId, exiting useEffect");
        return;
      }
  
      // Initialize or reuse the socket connection
      if (!socketRef.current) {
        console.log("Initializing new socket connection");
        socketRef.current = io("http://localhost:3001", {
          transports: ["websocket", "polling"],
          query: { chatId: selectedId, userId: currentUserID },
        });
      } else {
        console.log("Reusing existing socket connection, updating query parameters");
        socketRef.current.io.opts.query = { chatId: selectedId, userId: currentUserID };
      }
      
    
  
      console.log("Setting up 'receive_message' event listener");
      socketRef.current.on("receive_message", (newMessage,) => {
        setMessageRecieved((prev) => [...prev, newMessage]);

    });

      
      // Clean up: Remove event listener and disconnect if dependencies change
      return () => {
        console.log("Cleaning up: removing event listener and disconnecting socket");

          if (socketRef.current) {
              socketRef.current.disconnect();
              socketRef.current = null;
              
          }
      };
  }, [currentUserID, selectedId, sendMessageClicked]); // Include selectedId in dependencies
  

  








    // Define sendMessage using socketRef to access the current socket instance
    const sendMessage = () => {
      if (message.trim() && socketRef.current) {
          // Constructing the messageData object
          const messageData = {
              message: message,
              senderId: currentUserID,
              chatRoomId: selectedId
               // Assuming you have access to the currentUserID
              // You can add more data here if needed
          };
  
          // Emitting the messageData object to the server
          socketRef.current.emit('send_message', messageData);
          setMessage("");
          setSendMessageClicked(true);
          setSendMessageClicked(false);

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
  <div className="chatroom">
  <button onClick={() => {console.log(messageReceived)}}>Test</button>
 
  {!foundMessages ? (
      <div>Loading...</div>
    ) : (
      foundMessages.map((msg, index) => (
        <div key={index} className={msg.senderId === currentUserID ? 'sender' : 'receiver'}>
          {msg.message}
        </div>
      ))
    )}
</div>

    <div className='textBar'>
  <input className="textInput" value={message} type="text" 
 placeholder='Message...' onChange={(event) =>{
      setMessage(event.target.value); }} />
  <button className="button3" onClick={sendMessage}>Send message</button>
  </div>

  <div>Messages after database found: </div>

  <div className="chatroom">
    {messageReceived.map((msg, index) => (
    <div key={index} className={msg.senderId === currentUserID ? 'sender' : 'receiver'}>
      {msg.message} {/* Assuming 'message' is the property containing the message text */}
    </div>
  ))}


</div>

</div>
    </>
  )
}

export default Chatroom;