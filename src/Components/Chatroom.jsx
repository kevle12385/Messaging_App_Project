import io from 'socket.io-client';
import ReactDOM from "react-dom";
import { useEffect, useState } from "react";
import('../CSS/ChatApplication.css')


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
      });
    
      // Cleanup function to unsubscribe from the event when the component unmounts
      return () => {
        socket.off("recieve_message");
      };
    }, [socket]); // Passing `socket` in the dependency array
    
     
  return (
   
    <>
    <div></div>
    <div>
      <br/>
     
      <h1>Message:</h1>
      {messagRecieved}
    </div>    
    
    <div className='textBar'>
  <input className="textInput" placeholder='Message...' onChange={(event) =>{
      setMessage(event.target.value); }} />
  <button className="button3" onClick={sendMessage}>Send message</button>
</div>

    </>
  )
}

export default Chatroom