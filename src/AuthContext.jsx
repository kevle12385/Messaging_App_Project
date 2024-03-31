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
    const [currentUser, setCurrentUser] = useState(null);
    const [currentUserID, setCurrentUserID] = useState(null);

    const fetchCookieEmail = () => {
      if (!document.cookie) return null; // Early return if `document.cookie` is undefined or empty
    
      const cookies = document.cookie.split('; ');
      const emailCookie = cookies.find(cookie => cookie.startsWith('Email='));
      return emailCookie ? decodeURIComponent(emailCookie.split('=')[1]) : null;
    };

    const fetchUserInfo = async () => {
      const Email = await fetchCookieEmail();
      try {
        const response = await axios.post('/api/findUserByEmail', {Email})
        console.log(response.data)
        setCurrentUserID(response.data._id)
        setCurrentUser(response.data.name)
      } catch (error) {
        console.log('Error finding User Info',  error)
      }
    }



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
              window.location.reload();

            } else {
              setIsLoggedIn(false);
              console.log('Token not refreshed')

            }
          }
          setIsLoading(false); // Mark loading as complete regardless of login status
        };
    
        verifyUser();
        fetchUserInfo();
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
          document.cookie = `accessToken=${accessToken};path=/;secure;SameSite=Strict;max-age=${15 * 60}`; // 15 minutes expiration
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
        <AuthContext.Provider value={{ isLoggedIn, login, logout, currentUserID, currentUser, fetchUserInfo  }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
