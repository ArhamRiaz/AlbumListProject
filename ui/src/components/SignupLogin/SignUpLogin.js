import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import './SignUpLogin.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PasswordIcon from '@mui/icons-material/Password';
import { GoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';

export const SignUp = () => {
  const [user, setUser] = useState(null); 
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      console.log('ATTEMPTING TO MAKE THIS WORK: ');
      const response = await axios.post(process.env.REACT_APP_API_URL + 'auth/google', {
        token: credentialResponse.credential,
      });

      console.log('Login successful:', response.data.user);

      const { userId, email, name } = response.data.user;

      // Check if the user exists in your database
      const isUser = await axios.post(process.env.REACT_APP_API_URL + 'user', { id: userId });
      console.log(isUser.data);

      if (isUser.data === undefined || isUser.data.length === 0) {
        // Create a new user if they don't exist
        await axios.post(process.env.REACT_APP_API_URL + 'makeuser', {
          clientId: userId,
          email: email,
          name: name,
        });
      }

      // Store user data in state and localStorage
      const userData = { userId, email, name };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const handleGoogleLoginError = () => {
    console.log('Login failed');
  };

  const handleLogout = () => {
    // Clear user data from state and localStorage
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
      <div className='container'>
        {user ? (
          // Show user info and logout button if signed in
          <div>
            <h2>Welcome, {user.name}!</h2>
            <p>Email: {user.email}</p>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          // Show Google Login button if not signed in
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginError}
          />
        )}
      </div>
    </GoogleOAuthProvider>
  );
};