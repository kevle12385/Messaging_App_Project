import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
    console.log('AuthProvider props:', { children });

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const verifyUser = async () => {
          try {
            const response = await axios.get('/api/verify', { withCredentials: true });
            setIsLoggedIn(true);
            // Optionally, set user details in state here if returned by the API
          } catch (error) {
            console.error("Verification error:", error);
            setIsLoggedIn(false);
            // Here you can handle different types of errors differently if needed
            // For example, showing a message to the user in case of a network error
          } finally {
            setIsLoading(false); // Ensure loading state is updated in any case
          }
        };
      
        verifyUser();
      }, []);
      
    

    const login = async (email, password) => {
    try {
        const response = await axios.post('/api/login', {
            Email: email,
            Password: password
        }, { withCredentials: true });

        setIsLoggedIn(true);
        // Handle successful login here (e.g., redirecting the user or storing the login state)
    } catch (error) {
        console.error('Login failed:', error);
        // Handle error here (e.g., displaying a login error message to the user)
    }
};

    

    const logout = async () => {
        try {
            await axios.post('/api/logout', {}, { withCredentials: true });
            setIsLoggedIn(false);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>; // Or any other loading indicator
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
