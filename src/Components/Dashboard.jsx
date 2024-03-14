import React, {useState, useEffect} from 'react'
import LogoutButton from './Logout'
import Navigation from './Navigation';
import { refreshAccessToken } from '../AuthService'; 
import axios from 'axios';
import Chatroom from './Chatroom';
import('../CSS/ChatApplication.css')
function Dashboard() {

  const [names, setNames] =  useState([]);

  const fetchCookieEmail = () => {
    const cookies = document.cookie.split('; ');
    const emailCookie = cookies.find(cookie => cookie.startsWith('Email='));
    return emailCookie ? decodeURIComponent(emailCookie.split('=')[1]) : null;
    
  }

  const showFriendstoChat = () => {

  }
  const fetchNames = () => {
    axios.get('/api/people')
      .then(response => {
        setNames(response.data); // Set the fetched names into state
        console.log(names)
      })
      .catch(error => {
        console.error('There was an error fetching the names:', error);
      });
  };

  


  return (
    <div>
      <Navigation /> 
      <div className="container">
        <div className="content">
          <div className='dashboard_title'>         
             <h1>Chats</h1>
             <button className='newChatButton'>Create New Chat</button>
          </div>
          <h2>Friends:</h2>
          <button><h3>Create New Chat:</h3></button>
        
          <h1>Messages:</h1>

        </div>
        <div className="chatroom">
          <Chatroom/>
        </div>
      </div>
    </div>
  );
  
}

export default Dashboard