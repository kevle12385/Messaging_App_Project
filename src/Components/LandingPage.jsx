import Navigation from './Navigation';
import '../CSS/LandingPage.css'
import React from 'react';
import { Link } from 'react-router-dom';
import Chatroom from './Chatroom';
function LandingPage() {
  return (
    <div className="LandingPage">
        
        <Navigation />
        <div className='landingPageContainer'>
        <div className='HomeTitle'>Have a Friend Fiesta!</div>
        <div className='paragraph'>This is a great place to connect with friends.</div>
      </div>
        <div className='bottomOfPage'>
          <Link className='bottomLinks'to="/dashboard">About Us</Link>
        </div>
      </div> 
  );
}

export default LandingPage;
