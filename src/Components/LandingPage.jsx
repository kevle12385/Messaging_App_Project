import Navigation from './Navigation';
import '../CSS/LandingPage.css'
import React from 'react';
import { Link } from 'react-router-dom';
import Chatroom from './Chatroom';
function LandingPage() {
  return (
    <div>
     
      
      <div className="content">
        <Navigation />
        <h1>Welcome to Our Site!</h1>
        <p>This is a great place to connect with friends.</p>
        <Chatroom />
      </div>
    </div>
  );
}

export default LandingPage;
