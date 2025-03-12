import React from 'react'
import TextField from '@mui/material/TextField';
import './SignUpLogin.css'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PasswordIcon from '@mui/icons-material/Password';
import { GoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';

export const SignUp = () => {

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      console.log("ATTEMPTING TO MAKE THIS WORK: ");
      const response = await axios.post(process.env.REACT_APP_API_URL + 'auth/google', {
        token: credentialResponse.credential,
      });

      console.log('Login successful:', response.data.user);
      // Store user data in context or local storage
      //localStorage.setItem('user', JSON.stringify(response.data.user));
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const handleGoogleLoginError = () => {
    console.log('Login failed');
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
      <div className='container'>
        <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={handleGoogleLoginError}
        />
       </div>
        </GoogleOAuthProvider>

        /* <div className='container'>
        <div className='header'>
          <div className='text'>Sign Up</div>
          <div className='underline'></div>
        </div>

        <div className='inputs'>
          <div className='input'>
            <div className='logo'><AccountCircleIcon color='primary' fontSize='large' /></div>
            <input type="text" placeholder='Name' />
          </div>
        </div>

        <div className='inputs'>
          <div className='input'>
            <div className='logo'><PasswordIcon color='primary' fontSize='large' /></div>
            <input type="password" placeholder='Password' />
          </div>
        </div>

        <div className='submit-container'>
          <div className='submit'>Sign Up</div>
          <div className='submit'>Login</div>
        </div>
      </div>
      </div> */
    
  );
};
