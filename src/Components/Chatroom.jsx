import io from 'socket.io-client';
import ReactDOM from "react-dom";
import { useEffect, useState } from "react";
import('../CSS/ChatApplication.css')
import axios from 'axios';
import { useAuth } from '../AuthContext.jsx'


const socket = io("http://localhost:3001", {
  transports: ["websocket", "polling"]
  });

function Chatroom({selectedId, foundMessages}) {
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState("");
    const [messagRecieved, setMessageRecieved] = useState('');
    const { setIsLoggedIn, isLoggedIn, currentUserID, currentUser } = useAuth();
    const [chatRoomFound, setChatRoomFound] = useState([]);

        const sendMessage = () => {
          socket.emit('send_message',  {message})
     }
     useEffect(() => {
      socket.on("recieve_message", (data) => {
        setMessageRecieved(data.message);
      });
    
      // Cleanup function to unsubscribe from the event when the component unmounts
      return () => {
        socket.off("recieve_message");
      };
    }, [socket]); // Passing `socket` in the dependency array
    
     
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
      <h1>Message:</h1>
      {messagRecieved}
    </div>    
    <div>{currentUserID}</div>
    <div>{selectedId}</div>
    <div>{foundMessages}</div>    
    <div className='textBar'>
  <input className="textInput" placeholder='Message...' onChange={(event) =>{
      setMessage(event.target.value); }} />
  <button className="button3" onClick={sendMessage}>Send message</button>
  </div>
</div>
    </>
  )
}

export default Chatroom;