import axios from 'axios';

export const refreshAccessToken = async () => {

    const getCookieValue = (name) => (
        document.cookie.split('; ')
          .find(row => row.startsWith(name + '='))
          ?.split('=')[1]
      );
      
const refreshAccessToken = async () => {
    try {
        // Extract Email from cookies
        const email = getCookieValue('Email'); // Assuming you have Email stored in a cookie
        
        if (!email) {
          console.error('Email cookie is not found');
          // Handle case where email is not found, e.g., navigate to login
          return null;
        }
        const response = await axios.post('/api/token', { Email: email }, { withCredentials: true });
        document.cookie = `accessToken=${response.data.accessToken};path=/;secure;SameSite=Strict;max-age=${15 * 60}`; // 15 minutes expiration
        return response.data.accessToken;
        } catch (error) {
            console.error('Error refreshing access token:', error);
           
            return null;
          }

        }
}
