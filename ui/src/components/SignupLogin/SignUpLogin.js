import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import './SignUpLogin.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PasswordIcon from '@mui/icons-material/Password';
import Typography from '@mui/material/Typography';
import { GoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';

export const SignUp = ({ setUser }) => {
  const [localUser, setLocalUser] = useState(null); 

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setLocalUser(JSON.parse(storedUser));
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
      setLocalUser(userData); // Update local state
      setUser(userData); // Update user state in App component
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
    setLocalUser(null);
    setUser(null); // Update user state in App component
    localStorage.removeItem('user');
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
      <div className='container'>
        {localUser ? (
          // Show user info and logout button if signed in
          <div>
            <h2>Welcome, {localUser.name}!</h2>
            <p>Email: {localUser.email}</p>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          // Show Google Login button if not signed in
          <div style={{ textAlign: 'center' }}>
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginError}
            />
            <Typography align="center" variant="h5" paddingTop={2} paddingBottom={2}>
              Welcome to album-tracker! Please sign in with a Google account to begin!
            </Typography>
          </div>
        )}
      </div>
    </GoogleOAuthProvider>
  );
};