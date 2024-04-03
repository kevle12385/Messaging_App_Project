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
    const [dateRendered, setDateRendered] = useState([]);
    const now = new Date();

    const handleReceiveMessage = (messageData) => {
      console.log("handleReceiveMessage triggered", messageData);
      setMessageReceived(prev => [...prev, messageData]);
    };

    const formattedTimestamp = new Intl.DateTimeFormat('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: 'numeric', minute: 'numeric', second: 'numeric',
      hour12: true // Use hour12: false for 24-hour format
    }).format(now);



    useEffect(() => {
      console.log("useEffect for setting up socket is running");

      if (!currentUserID || !selectedId) {
        console.log("Missing currentUserID or selectedId, exiting useEffect");
        return;
      }
  
      // Initialize or reuse the socket connection
      if (!socketRef.current) {
        console.log("Initializing new socket connection");
        let socketServerURL = "https://nodejs-production-49b7.up.railway.app/";
        socketRef.current = io(3001, {
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
        console.log(messageReceived);


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
              chatRoomId: selectedId,
              timeStamp: formattedTimestamp
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

   
    const renderDate = (messageObject) => {
      if (messageObject) {
        const date = messageObject.timeStamp; // Ensure `date` is declared
        if (!dateRendered.includes(date)) {
          // You should manage `dateRendered` updates elsewhere to not directly cause side-effects in render.
          return <div key={date} className={messageObject.senderId === currentUserID ? 'senderDate' : 'receiverDate'} >{date}</div>; 
          
        

        }
a
      }
      return null; // Return null if conditions aren't met
    };



    useEffect(() => {
      if (isLoggedIn) {
        displayChat();
      }
    }, [isLoggedIn]); // Depend on isLoggedIn state
    
  
    

  
    return (
      <>
        <div>
          <br/>
          <div className='message-Container'>
            {/* Content for message-Container might go here */}
          </div>    
    
          <div className="chatroom">
            {(!foundMessages || !foundMessages.length) && (!messageReceived || !messageReceived.length) ? (
              <div className="StartChatNowPrompt">Start Chatting Now!</div>
            ) : (
              <>
                {foundMessages && foundMessages.map((msg, index) => (
                  <div key={"found" + index} className={`messageContainer ${msg.senderId === currentUserID ? 'sender' : 'receiver'}`}>
                    {msg.senderId === currentUserID ? (
                      <>
                        <div>
                          {renderDate(msg)}
                        </div>
                        <div className="messageContent">
                          {msg.message}
                        </div> 
                      </>
                    ) : (
                      <>
                        <div className="messageContent">
                          {msg.message}
                        </div> 
                        <div>
                          {renderDate(msg)}
                        </div>
                      </>
                    )}
                  </div>
                ))}
    
                {messageReceived && messageReceived.map((msg, index) => (
                  <div key={"received" + index} className={`messageContainer ${msg.senderId === currentUserID ? 'sender' : 'receiver'}`}>
                    {msg.senderId === currentUserID ? (
                      <>
                        <div>
                          {renderDate(msg)}
                        </div>
                        <div className="messageContent">
                          {msg.message}
                        </div> 
                      </>
                    ) : (
                      <>
                        <div className="messageContent">
                          {msg.message}
                        </div> 
                        <div>
                          {renderDate(msg)}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
    
          <div className='textBar'>
            <input className="textInput" value={message} type="text" placeholder='Message...' onChange={(event) => setMessage(event.target.value)} />
            <button className="button3" onClick={sendMessage}>Send Message</button>
          </div>
        </div>
      </>
    );
  }
    
    export default Chatroom;