// Navigation.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

function Navigation() {
  const { isLoggedIn, logout } = useAuth();

  return (
    <nav>
      {/* <Link to="/">Dashboard</Link> */}
      {isLoggedIn ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/signup">SignUp</Link>
        </>
      )}
    </nav>
  );
}

export default Navigation;
