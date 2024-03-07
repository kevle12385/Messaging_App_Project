import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import '../CSS/SignUpScreen.css'; // Adjust the path if your CSS file is located elsewhere
import Navigation from './Navigation';


function SignUpScreen({URL}) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [nameError, setNameError] = useState('')
    const navigate = useNavigate()

    const handleInputChange = (e) => {
        setName(e.target.value);
      };

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (name.length === 0 || email.length === 0 || password.length === 0 ) {
          return;
        }
        try {
            const response = await axios.post('/api/create-account', { name: name, Email: email, Password: password }) ;
            console.log('Account created successfully:', response.data);
            navigate('/login');

        } catch (error) {
            console.error('Error creating account:', error);
          }
    }


    const onButtonClick = (e) => {
        
        // Set initial error values to empty
        setEmailError('')
        setPasswordError('')
        setNameError('')
        if ('' === name) {
            setNameError('Please enter your Name')
            return
          }        // Check if the user has entered both fields correctly
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
  
<>
<Navigation />
  <div className="signUpContainer">
    <div className="signUpHeader">Sign Up</div>
    <form onSubmit={handleSubmit}>  
      <div className="inputContainer">
        <input type='text' onChange={handleInputChange} placeholder="Full Name"/>
        <div className="errorLabel">{nameError}</div>
      </div>
      <div className="inputContainer">
        <input type='email' onChange={(ev) => setEmail(ev.target.value)} placeholder="Email"/> 
        <div className="errorLabel">{emailError}</div>
      </div>
      <div className="inputContainer">
        <input type='password' onChange={(ev2) => setPassword(ev2.target.value)} placeholder="Password"/> 
        <div className="errorLabel">{passwordError}</div>
      </div>
      <button type="submit" className="createAccountButton">Create Account</button>
    </form>
  </div>
</>  )
}

export default SignUpScreen