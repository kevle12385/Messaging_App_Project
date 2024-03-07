import Navigation from './Navigation';
import '../CSS/LandingPage.css'
import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div>
     
      
      <div className="content">
        <Navigation />
        <h1>Welcome to Our Site!</h1>
        <p>This is a great place to connect with friends.</p>
      </div>
    </div>
  );
}

export default LandingPage;
