import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AddAlbum } from './components/AddAlbum.js';
import React from 'react';
import { UpdateAlbum } from './components/UpdateAlbum.js';
import { Album } from './components/Album.js';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const album = {
  id: "1",
  name: "Punisher",
  listened: true
}

export default function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AddAlbum/>
      <UpdateAlbum/>
      <Album album={album}/>
    </ThemeProvider>
  );
}

//export default App;
