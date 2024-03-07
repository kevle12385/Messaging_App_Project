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
        const verifyUser = () => {
            const name = 'accessToken'; // Specify the cookie name
            let cookieValue = document.cookie
              .split('; ')
              .find(row => row.startsWith(name + '='))
              ?.split('=')[1];
            
            if (cookieValue) {
                // If the cookie exists, assume the user is logged in
                setIsLoggedIn(true);
            } else {
                // If no cookie, assume the user is not logged in
                setIsLoggedIn(false);
            }
            setIsLoading(false); // Mark loading as complete regardless of login status
        };
        
        verifyUser();
    }, []);


    

      const login =(email, password) => {
  axios.post('/api/login', {
    Email: email,
    Password: password
  }, {
    withCredentials: true // Important: This is needed to include cookies in requests
  })
  .then(response => {
    // Assuming the response includes accessToken and refreshToken
    const { accessToken } = response.data;

    // Set accessToken in a cookie
    document.cookie = `accessToken=${accessToken};path=/;secure;SameSite=Strict;max-age=${15 * 60}`; // 15 minutes expiration

    console.log(response.data.message); // "Login successful"
  })
  .catch(error => {
    console.error("Login error", error.response.data);
  });
}


    

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
