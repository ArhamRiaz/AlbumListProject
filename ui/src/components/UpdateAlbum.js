import { Button, Dialog, DialogTitle, TextField } from '@mui/material'
import React , {useState} from 'react'
import CheckIcon from "@mui/icons-material/Check";
import axios from 'axios';
import { API_URL } from '../utils';

export const UpdateAlbum = ({fetchAlbums, isDialogOpen, setIsDialogOpen, album}) => {
  const {id, listened} = album
  const [albumName, setAlbumName] = useState("")

  const handleUpdateAlbum = async () => {
    try {
      await axios.put(API_URL+"album", {
        id, name: albumName, listened
      })

      await fetchAlbums();
    } catch (err) {
      
    }
  }

  return (
    <Dialog open={isDialogOpen}>
      <DialogTitle>Edit Album</DialogTitle>
      <div className='dialog'>
        <TextField size='small' label='Album' variant='outlined' onChange={(e) => setAlbumName(e.target.value)}></TextField>
        <Button variant='contained' onClick={ async () => {
          await handleUpdateAlbum();
          setIsDialogOpen(false);}}>
          <CheckIcon></CheckIcon>
          </Button>
      </div>
    </Dialog>
  )
}
