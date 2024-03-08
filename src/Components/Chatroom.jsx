import io from 'socket.io-client';
import ReactDOM from "react-dom";
import { useEffect, useState } from "react";


const socket = io("http://localhost:3001", {
  transports: ["websocket", "polling"]
  });

function Chatroom() {
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState("");
    const [messagRecieved, setMessageRecieved] = useState('');

        const sendMessage = () => {
          socket.emit('send_message',  {message})
     }
 
     useEffect(() => {
      socket.on("recieve_message", (data) => {
        setMessageRecieved(data.message);
      })
     }, {socket})

     
  return (
   
    <>
  
    <div>
      <input placeholder='Message...' onChange={(event) =>{
        setMessage(event.target.value);
      }}></input>
      <button onClick={sendMessage}>Send message</button>
      <h1>Message:</h1>
      {messagRecieved}
    </div>    
    
    </>
  )
}

export default Chatroom