import React, { Component } from 'react';
import Navigation from './Navigation';
import { useAuth } from '../AuthContext.jsx'



const Profile = () => {
    const { setIsLoggedIn, isLoggedIn, currentUserID, currentUser } = useAuth();





return (
    <>
    <Navigation />
    <h1>Welcome {currentUser}</h1>
    <h1>Edit Name</h1>

    <form>
        <input type='text' placeholder='New name'></input>
        <button>Submit</button>
    </form>
    <h1>Change Email</h1>
    <form>
        <input type='text' placeholder='New Email'></input>
        <button>Submit</button>
    </form>
    <h1>Reset Password</h1>
    <form>
        <input type='text' placeholder='New Password'></input>
        <button>Submit</button>
    </form>
    <h1>Delete Account</h1>
    


    
    
    
    
    </>
)




}

export default Profile;