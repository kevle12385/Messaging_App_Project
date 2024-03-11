import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { refreshAccessToken } from './AuthService'; 

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
          const name = 'accessToken'; // Specify the cookie name
          let cookieValue = document.cookie
            .split('; ')
            .find(row => row.startsWith(name + '='))
            ?.split('=')[1];
    
          if (cookieValue) {
            // If the cookie exists, assume the user is logged in
            setIsLoggedIn(true);
          } else {
            // If no cookie, try to refresh the access token
            const refreshed = await refreshAccessToken();
            if (refreshed) {
              setIsLoggedIn(true);
              console.log('Token refreshed')
            } else {
              setIsLoggedIn(false);
              console.log('Token not refreshed')

            }
          }
          setIsLoading(false); // Mark loading as complete regardless of login status
        };
    
        verifyUser();
      }, []);
    

    const login = (email, password) => {
        return axios.post('/api/login', {
          Email: email,
          Password: password
        }, {
          withCredentials: true // Important: This is needed to include cookies in requests
        })
        .then(response => {
          // Assuming the response includes accessToken and Email
          const { accessToken , Email} = response.data;
      
          // Set accessToken in a cookie
          document.cookie = `accessToken=${accessToken};path=/;secure;SameSite=Strict;max-age=${1 * 60}`; // 15 minutes expiration
          document.cookie = `Email=${Email};path=/;secure;SameSite=Strict;max-age=604800`; // 7 days expiration

          console.log(response.data.message); // "Login successful"
          return response; // Return response for further chaining if needed
        });
      }
      


const clearCookie = (name, path = '/', domain = '') => {
    // Construct the base expiration string
    let expiration = "Thu, 01 Jan 1970 00:00:00 GMT";
    let cookieStr = `${name}=;expires=${expiration};path=${path}`;

    // If a domain is provided, add it to the cookie string
    if (domain) {
        cookieStr += `;domain=${domain}`;
    }

    // Set the cookie to clear it
    document.cookie = cookieStr;
};


    const logout = async () => {
        clearCookie('accessToken');
        clearCookie('Email');

        window.location.reload();
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
