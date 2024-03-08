import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './Components/Dashboard';
import LoginScreen from './Components/LoginScreen';
import SignUpScreen from './Components/SignUpScreen';
import axios from 'axios';
import { AuthProvider } from './AuthContext';
import LandingPage from './Components/LandingPage';
import ProtectedRoute from './ProtectedRoute.jsx'; // Import your protected route component




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
     
        <Routes>
          {/* Apply the PrivateRoute component */}
          {/* <Route path="/" element={
             <PrivateRoute><Dashboard /></PrivateRoute> 
          } /> */}
              <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
        <Route path='/' element={<LandingPage/>}  />
          <Route path="/signup" element={<SignUpScreen URL={URL} />} />
          <Route path="/login" element={<LoginScreen URL={URL} />} />
          <Route path="/dashboard" element={<Dashboard URL={URL} />} />

        </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
