import React from 'react'
import TextField from '@mui/material/TextField';

export const SignUp = () => {
  return (
    <div>
        <TextField id="Username" label="Username" variant="standard" />
        <TextField id="Password" label="Password" variant="standard" />
    </div>
  )
}
