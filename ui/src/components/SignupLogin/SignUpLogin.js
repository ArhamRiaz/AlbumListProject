import React from 'react'
import TextField from '@mui/material/TextField';
import './SignUpLogin.css'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PasswordIcon from '@mui/icons-material/Password';

export const SignUp = () => {
  return (
    <div className='container'>
      <div className='header'>
        <div className='text'>Sign Up</div>
        <div className='underline'></div>
      </div>

      <div className='inputs'>
        <div className='input'>
          <div className='logo'><AccountCircleIcon color='primary' fontSize='large'/></div>
          <input type="text" placeholder='Name'/>
        </div>
      </div>

      <div className='inputs'>
        <div className='input'>
          <div className='logo'><PasswordIcon color='primary' fontSize='large'/></div>
          <input type="password" placeholder='Password'/>
        </div>
      </div>

      <div className='submit-container'>
        <div className='submit'>Sign Up</div>
        <div className='submit'>Login</div>
      </div>

    </div>
  )
}
