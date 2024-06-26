import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './Components/Dashboard';
import LoginScreen from './Components/LoginScreen';
import SignUpScreen from './Components/SignUpScreen';
import axios from 'axios';
import { AuthProvider } from './AuthContext';
import LandingPage from './Components/LandingPage';
import ProtectedRoute from './ProtectedRoute.jsx'; // Import your protected route component
import Friends from './Components/Friends.jsx';
import Profile from './Components/Profile.jsx';
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
              <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
                <Friends/>
                <Profile />
              </ProtectedRoute>
            } />
          <Route path='/' element={<LandingPage/>}  />
            <Route path="/signup" element={<SignUpScreen URL={URL} />} />
            <Route path="/login" element={<LoginScreen URL={URL} />} />
            <Route path="/dashboard" element={<Dashboard URL={URL} />} />
            <Route path="/friends" element={<Friends URL={URL} />} />
            <Route path="/profile" element={<Profile URL={URL} />} />

        </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
