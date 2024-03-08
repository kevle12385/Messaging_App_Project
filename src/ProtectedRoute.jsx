import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Adjust the import path as necessary

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    // User not logged in, redirect to login page
    return <Navigate to="/login" />;
  }

  // User is logged in, allow access to children
  return children;
};

export default ProtectedRoute