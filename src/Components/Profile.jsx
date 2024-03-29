import React, { useState } from 'react';
import Navigation from './Navigation';
import { useAuth } from '../AuthContext.jsx';
import axios from 'axios';
import '../CSS/Profile.css'
const Profile = () => {
    const { currentUser } = useAuth();
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const fetchCookieEmail = () => {
        if (!document.cookie) return null;

        const cookies = document.cookie.split('; ');
        const emailCookie = cookies.find(cookie => cookie.startsWith('Email='));
        return emailCookie ? decodeURIComponent(emailCookie.split('=')[1]) : null;
    };

    const fetchUserIdFromEmail = async () => {
        try {
            const Email = fetchCookieEmail();
            const response = await axios.post('/api/UserID/get', { Email });
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error('There was an error fetching the user ID:', error);
        }
    };

    const onChange = (e) => {
        setMessage(e.target.value);
    };

    const onChange1 = (e) => {
        setEmail(e.target.value);
    };

    const onChange2 = (e) => {
        setPassword(e.target.value);
    };

    const changeName = async (e) => {
        e.preventDefault();
        if (message.trim() === "") {
            // Here you can set an error state and display it in your UI, or simply log an error
            console.error('Error: The new name cannot be empty.');
            return; // Stop execution of the function here
        }
        try {
            const userId = await fetchUserIdFromEmail();
            const response = await axios.post('/api/changeName', { userId, newName: message });
            // Assuming you want to do something with the response here,
            // like displaying a success message
        } catch (error) {
            console.error('Error Setting name', error);
            // Here, too, you could update your UI to reflect the error
        }
    };

    const changeEmail = async (e) => {
        e.preventDefault();
        if (email.trim() === "") {
            console.error('Error: The new email cannot be empty.');
            return;
        }
        // Email validation regex
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!emailRegex.test(email.trim())) {
            console.error('Error: Invalid email format.');
            return;
        }
        try {
            const userId = await fetchUserIdFromEmail();
            const response = await axios.post('/api/changeEmail', { userId, newEmail: email.trim() });
            // Handle success
        } catch (error) {
            console.error('Error changing email', error);
        }
    };
    
    const changePassword = async (e) => {
        e.preventDefault();
        // Assuming `password` is the correct variable holding the new password
        if (/\s/.test(password.trim())) {
            console.error('Error: The password cannot contain spaces.');
            return;
        }
        if (password.trim().length < 8) {
            console.error('Error: The password must be at least 8 characters long.');
            return;
        }
        try {
            const userId = await fetchUserIdFromEmail();
            // It's important to trim the password before sending it in the request
            const trimmedPassword = password.trim();
            const response = await axios.post('/api/changePassword', { userId, newPassword: trimmedPassword });
            // Assuming you want to handle success, e.g., notifying the user
            console.log('Password changed successfully');
        } catch (error) {
            console.error('Error setting password', error);
        }
    };
    
    



    
    return (
        <>
            <Navigation />
            <div className="profile-container">
                <h1>Welcome {currentUser}</h1>
                <div className="section">
                    <h2>Edit Name</h2>
                    <form onSubmit={changeName}>
                        <input onInput={onChange} type='text' placeholder='New name' />
                        <br/>
                        <button type="submit">Submit</button>
                    </form>
                </div>
                <div className="section">
                    <h2>Change Email</h2>
                    <form>
                        <input type='text' placeholder='New Email' />
                        <br/>
                        <button type="submit">Submit</button>
                    </form>
                </div>
                <div className="section">
                    <h2>Reset Password</h2>
                    <form>
                        <input type='text' placeholder='New Password' />
                        <br/>
                        <button type="submit">Submit</button>
                    </form>
                </div>
                <div className="section">
                    <h2>Delete Account</h2>
                    <form>
                        {/* Presumably some action here */}
                        <button type="button">Delete</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Profile;
