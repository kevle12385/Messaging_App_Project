import { useEffect } from 'react';
import axios from 'axios';

// Assuming refreshAccessToken is correctly implemented to handle the refresh logic
import { refreshAccessToken } from './AuthService'; 

const AxiosSetup = () => {
  useEffect(() => {
    const setupInterceptors = () => {
      const interceptor = axios.interceptors.response.use(
        response => response, // simply return the response for successful requests
        async error => {
          // Destructure for clarity
          const { config, response: { status } } = error;

          // Check for expired access token error response
          if (status === 401 && !config._retry) {
            config._retry = true; // mark this request as retried
            try {
              const newAccessToken = await refreshAccessToken(); // attempt to refresh token
              
              if (newAccessToken) {
                // Update the authorization header and retry the original request
                axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                config.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return axios(config); // retry the original request with the new token
              }
            } catch (refreshError) {
              console.error('Error refreshing access token:', refreshError);
              // Implement further error handling, e.g., redirecting to login
              return Promise.reject(refreshError); // Reject with the new error
            }
          }

          return Promise.reject(error); // For all other errors, reject the promise
        }
      );

      return interceptor;
    };

    const interceptorId = setupInterceptors();

    // Cleanup function to remove interceptor
    return () => axios.interceptors.response.eject(interceptorId);
  }, []); // The empty dependency array ensures this effect runs only once on mount

  return null; // This component does not render anything
};

export default AxiosSetup;
