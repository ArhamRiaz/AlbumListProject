import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AddAlbum } from './components/AddAlbum.js';
import React, { useEffect, useState } from 'react';
import { UpdateAlbum } from './components/UpdateAlbum.js';
import { Album } from './components/Album.js';
import axios from 'axios';
import { API_URL } from './utils.js';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});


export default function App() {
  const [albums, setAlbums] = useState([])

  const fetchAlbums = async () => {
    try {
      const {data} = await axios.get(API_URL)
      setAlbums(data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchAlbums()
  }, [])
  
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AddAlbum fetchAlbums={fetchAlbums}/>
      {albums.map((album) => (
        <Album album={album} key={album.id} fetchAlbums={fetchAlbums} />
      ))}
      
    </ThemeProvider>
  );
}

//export default App;
