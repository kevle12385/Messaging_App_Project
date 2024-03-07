import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Adjust the import path as needed

const LoginScreen = () => {
  const { isLoggedIn, login} = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Redirect the user if already logged in
  useEffect(() => {
    // This useEffect is dedicated to handling redirection based on the isLoggedIn state
    if (isLoggedIn) {
      navigate('/'); // Adjust this as needed, e.g., to '/dashboard' or any other route
    }
  }, [isLoggedIn, navigate]);


  
  
  const onSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setEmailError('');
    setPasswordError('');

    if (!email) {
      setEmailError('Please enter your email');
      return;
    }
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setEmailError('Please enter a valid email');
      return;
    }
    if (password.length < 8) {
      setPasswordError('The password must be 8 characters or longer');
      return;
    }

    try {
  await login(email, password); // This will now wait for the login to complete
  window.location.reload(); // Refresh the page after login is successful
} catch (error) {
  console.error("Login error", error.response.data);
  // Handle login failure
}

  };

  if (isLoggedIn) {
    return null; // or a loading indicator, etc.
  }



  return (
    <div className={'mainContainer'}>
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        <div className={'inputContainer'}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className={'inputBox'}
          />
          <div className="errorLabel">{emailError}</div>
        </div>
        <div className={'inputContainer'}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className={'inputBox'}
          />
          <div className="errorLabel">{passwordError}</div>
        </div>
        <div className={'inputContainer'}>
          <button type="submit" className={'inputButton'}>Log in</button>
        </div>
      </form>
      <button onClick={() => navigate('/signup')} className={'inputButton'}>Sign up</button>
    </div>
  );
};

export default LoginScreen;
