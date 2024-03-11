import { useEffect } from 'react';
import axios from 'axios';

import { refreshAccessToken } from './AuthService';

const AxiosSetup = () => {
  useEffect(() => {
    const setupInterceptors = () => {
      console.log('Set up complete')

      const interceptor = axios.interceptors.response.use(
        response => response, // simply return the response for successful requests
        async error => {
          const { config, response: { status } } = error;

          if (status === 401 && !config._retry) {
            config._retry = true; // mark this request as retried
            try {
              // Attempt to refresh token
              await refreshAccessToken();
              // After refreshing, extract the new access token from the cookie
              const updatedAccessToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('accessToken='))
                ?.split('=')[1];
              console.log('token created sucessfulty')
              if (updatedAccessToken) {
                // Update the authorization header with the new token from the cookie
                config.headers['Authorization'] = `Bearer ${updatedAccessToken}`;
                return axios(config); // retry the original request with the new token
              }
            } catch (refreshError) {
              console.error('Error refreshing access token:', refreshError);
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
