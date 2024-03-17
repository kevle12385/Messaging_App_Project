// Navigation.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import Dashboard from './Dashboard';
import '../CSS/Navigation.css'
import LogoutButton from './Logout';
import Friends from './Friends';
function Navigation() {
  const { isLoggedIn, logout } = useAuth();
 
 
  let navigate = useNavigate();

  function link() {
    navigate('/');
  }


  return (

    <nav>
      
      <div className="navbar">
      <h2 onClick={link} className="Website_Name">FriendFiesta</h2>

      {isLoggedIn && (
        <>
          <Link to="/dashboard" className="nav-item">Messages</Link>
          <Link to="/friends" className="nav-item">Friends</Link>

          <Link className="nav-item">Profile</Link>
          <LogoutButton className="nav-item logout-button" />
        </>
      )}

      {!isLoggedIn && (
        <>
          <Link to="/login" className="nav-item">Login</Link>
          <Link to="/signup" className="nav-item">Get Started</Link>
        </>
      )}
    </div>
    </nav>
  );
}

export default Navigation;
