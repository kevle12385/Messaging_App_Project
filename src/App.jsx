import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './Pages/Dashboard';
import LoginScreen from './Pages/LoginScreen';
import SignUpScreen from './Pages/SignUpScreen';
import axios from 'axios';
import { AuthProvider } from './AuthContext';
import Navigation from './Navigation'; // Adjust path as needed
import PrivateRoute from './PrivateRoute';

function App() {
  const URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios.defaults.baseURL = URL;
  }, [URL]);
  axios.defaults.withCredentials = true;


  return (
    <>
    <BrowserRouter>
    <AuthProvider>
     
        <Navigation />
        <Routes>
          {/* Apply the PrivateRoute component */}
          <Route path="/" element={
          
              <Dashboard />
          
          } />
          <Route path="/signup" element={<SignUpScreen URL={URL} />} />
          <Route path="/login" element={<LoginScreen URL={URL} />} />
        </Routes>
        </AuthProvider>
      </BrowserRouter>
      <div>{URL}</div>
    </>
  );
}

export default App;
