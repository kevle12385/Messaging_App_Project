// Navigation.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import Dashboard from './Dashboard';
import '../CSS/Navigation.css'
import LogoutButton from './Logout';
function Navigation() {
  const { isLoggedIn, logout } = useAuth();

  return (
    <nav>
      
     <div className="navbar">
        <h2 className="Website_Name">FriendFiesta</h2>
        <Link to="/" className="nav-item">Home</Link> {/* Assuming you want a Home link */}
        {isLoggedIn && (
          <Link to="/dashboard" className="nav-item">Dashboard</Link>
        )}
        
        {
  isLoggedIn ? (
    <LogoutButton className="nav-item"/>
  ) : ([
    <Link key="login" to="/login" className="nav-item">Login</Link>,
    <Link key="signup" to="/signup" className="nav-item">Get Started</Link>
  ])
}

      <div>{isLoggedIn}</div>
      </div>
    </nav>
  );
}

export default Navigation;
