import io from 'socket.io-client';
import React from 'react';
import { ReactDOM } from 'react';
import React from "react";
import ReactDOM from "react-dom";
import { useEffect, useState } from "react";


function Chatroom() {
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
  

    const socket = io("http://localhost:3000", {
        transports: ["websocket", "polling"]
        });
    
     

  return (
    <div>Chatroom</div>
  )
}

export default Chatroom