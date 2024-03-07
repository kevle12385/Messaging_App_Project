import React from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext.jsx'; // Adjust the path as necessary

function LogoutButton() {
    const { setIsLoggedIn } = useAuth();

    const handleLogout = async () => {
        try {
            await axios.post('/api/logout');
            setIsLoggedIn(false); // Update the authentication state
         
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return <button onClick={handleLogout}>Logout</button>;
}

export default LogoutButton;
