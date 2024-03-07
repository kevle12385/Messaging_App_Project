import { useEffect } from 'react';
import axios from 'axios';
import { refreshAccessToken } from './AuthService'; // Adjust the path as necessary

const AxiosSetup = () => {
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            response => response,
            async error => {
                const originalRequest = error.config;
                // Check if the error is due to an expired token
                if (error.response.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    const newAccessToken = await refreshAccessToken();
                    if (newAccessToken) {
                        // Update the authorization header and retry the original request
                        axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`; // Update the original request as well
                        return axios(originalRequest);
                    }
                }
                return Promise.reject(error);
            }
        );

        // Cleanup function to remove interceptor
        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, []); // The empty array ensures this effect runs only once on mount

    return null; // This component does not render anything
};

export default AxiosSetup;
