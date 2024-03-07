import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'



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
   <div>Sign Up</div>
   <br/>
    <form onSubmit={handleSubmit}>  
    <div><input type='text' onChange={handleInputChange} placeholder="Full Name"/> </div>
    <label className="errorLabel">{nameError}</label>
    <br/>
    <div><input type='text' onChange={(ev) => setEmail(ev.target.value)} placeholder="Email"/> </div>
    <label className="errorLabel">{emailError}</label>
    <br/>
    <div>{URL}</div>
    <input type='text' onChange={(ev2) => setPassword(ev2.target.value)} placeholder="Password"/> 
    <label className="errorLabel">{passwordError}</label>
    <br/>
    <button onClick={onButtonClick}>Create Account</button>
  </form>
  </>
  )
}

export default SignUpScreen