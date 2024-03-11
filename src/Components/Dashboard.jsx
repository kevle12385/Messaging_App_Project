import React from 'react'
import LogoutButton from './Logout'
import Navigation from './Navigation';
import { refreshAccessToken } from '../AuthService'; 
import axios from 'axios';
function Dashboard() {


  const test = () => {
    axios.get('https://nodejs-production-49b7.up.railway.app/api/verify')
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error('There was an error fetching the posts:', error.message);
  });

  }
  
  return (
    <>
      <Navigation /> 
      <h1>DashBoard</h1>
      <button onClick={() => test()}>test</button>

     
    </>

    )
}

export default Dashboard