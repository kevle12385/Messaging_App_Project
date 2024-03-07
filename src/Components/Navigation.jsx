// Navigation.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import Dashboard from './Dashboard';
import '../CSS/LoginScreen.css'
function Navigation() {
  const { isLoggedIn, logout } = useAuth();

  return (
    <nav>
      
     <div className="navbar">
        <h2 className="Website_Name">FriendFiesta</h2>
        <Link to="/" className="nav-item">Home</Link> {/* Assuming you want a Home link */}
        <Link to="/dashboard" className="nav-item">Dashboard</Link>

       <Link to="/login" className="nav-item">Login</Link>

        <Link to="/signup" className="nav-item">Get Started</Link>
      </div>
    </nav>
  );
}

export default Navigation;
