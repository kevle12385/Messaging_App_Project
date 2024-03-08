import axios from 'axios';

export const refreshAccessToken = async () => {


const refreshAccessToken = async () => {
    try {
        const response = await axios.post('/api/token', { // response is a json file of the accesstoke
            Email: email,
            Password: password
          })

        
        // Update the stored access token with the new one
        localStorage.setItem('accessToken', response.data.accessToken);
        return response.data.accessToken;
    } catch (error) {
        console.error('Error refreshing access token:', error);
        // Handle errors, such as redirecting to the login page
        navigate('/login');
        return null;
    }
};

};
