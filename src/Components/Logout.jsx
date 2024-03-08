import React from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext.jsx'; // Adjust the path as necessary
import '../CSS/Navigation.css'

function LogoutButton() {
    const { setIsLoggedIn, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            setIsLoggedIn(false); // Update the authentication state
         
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
    <>
    <div className=''>
    <button className='inputButton' onClick={handleLogout}>Logout</button>
    </div>
   
    </>
    )
}

export default LogoutButton;
