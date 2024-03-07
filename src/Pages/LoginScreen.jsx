import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../AuthContext.jsx'; // Adjust the import path as needed

const LoginScreen = (props, URL) => {

  const { isLoggedIn, login, logout } = useAuth();




  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const navigate = useNavigate()


  const onButtonClick2 = () => {
    navigate('/signup');
  }

  const onSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
  
    // Reset errors
    setEmailError('');
    setPasswordError('');
  
    // Validate email and password
    if (email === '') {
      setEmailError('Please enter your email');
      return;
    }
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setEmailError('Please enter a valid email');
      return;
    }
    if (password === '') {
      setPasswordError('Please enter a password');
      return;
    }
    if (password.length < 8) {
      setPasswordError('The password must be 8 characters or longer');
      return;
    }
  
    // Attempt login
    try {
      // Directly using login function from context
      await login(email, password); // Assuming login takes email and password as arguments
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      if (error.response && error.response.status === 401) {
        // Handle authentication-specific errors (e.g., wrong credentials)
        setEmailError('Incorrect email or password');
      } else {
        // Handle other kinds of errors (network error, server error, etc.)
        setEmailError('An error occurred. Please try again later.');
      }
    }
  
  };
  
  

  


  const onButtonClick = (e) => {
    // Set initial error values to empty
    setEmailError('')
    setPasswordError('')
  
    // Check if the user has entered both fields correctly
    if ('' === email) {
      setEmailError('Please enter your email')
      return
    }
  
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setEmailError('Please enter a valid email')
      return
    }
  
    if ('' === password) {
      setPasswordError('Please enter a password')
      return
    }
  
    if (password.length < 7) {
      setPasswordError('The password must be 8 characters or longer')
      return
    }
  
    // Authentication calls will be made here...
    
  }

 
  

  
  return (
    <div className={'mainContainer'}>
      <div className={'titleContainer'}>
        <div>Login</div>
      </div>
      <br />
      <form onSubmit={onSubmit}>
      <div className={'inputContainer'}>
        <input
          value={email}
          placeholder="Enter your email here"
          onChange={(ev) => setEmail(ev.target.value)}
          className={'inputBox'}
        />
        <label className="errorLabel">{emailError}</label>
      </div>
      <br />
      <div className={'inputContainer'}>
        <input
          value={password}
          placeholder="Enter your password here"
          onChange={(ev) => setPassword(ev.target.value)}
          className={'inputBox'}
        />
        <label className="errorLabel">{passwordError}</label>
      </div>
      <br />
      <div className={'inputContainer'}>
        <input className={'inputButton'} type="submit" onClick={onButtonClick} value={'Log in'} />
      </div>
      </form> 
      <br/>
      <input className={'inputButton'} type="button" onClick={onButtonClick2} value={'Sign up'}/>

    </div>
  )
}

export default LoginScreen
