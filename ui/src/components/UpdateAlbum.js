import { Button, Dialog, DialogTitle, TextField } from '@mui/material'
import React , {useState} from 'react'
import CheckIcon from "@mui/icons-material/Check";

export const UpdateAlbum = ({isDialogOpen, setIsDialogOpen, album}) => {
  /*const {id, listened} = album*/
  const [albumName, setAlbumName] = useState("")

  return (
    <Dialog open={isDialogOpen}>
      <DialogTitle>Edit Album</DialogTitle>
      <div className='dialog'>
        <TextField size='small' label='Album' variant='outlined' onChange={(e) => setAlbumName(e.target.value)}></TextField>
        <Button variant='contained' onClick={(() => {setIsDialogOpen(false)})}>
          <CheckIcon></CheckIcon>
          </Button>
      </div>
    </Dialog>
  )
}
