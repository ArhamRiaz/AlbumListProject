import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import React, { useEffect, useState } from 'react';
import ResponsiveAppBar from "./components/ResponsiveAppBar.js";
import { Album } from './components/Album.js';
import axios from 'axios';
import { API_URL } from './utils.js';
import {  Typography } from "@mui/material";
import { AddAlbum } from './components/AddAlbum.js';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});
//<AddAlbum fetchAlbums={fetchAlbums}/>

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
      <Router>
        <ResponsiveAppBar/> 
        <CssBaseline />
        <Routes>

        <Route
            path="/" element={
              <>
              <Typography align="center" variant="h2" paddingTop={2} paddingBottom={2}>
                My Album List
              </Typography>
              {albums.map((album) => (
                <Album album={album} key={album.id} fetchAlbums={fetchAlbums} />
              ))}
              </>
            }
            />

          
          <Route path="/search" element={<AddAlbum fetchAlbums={fetchAlbums} />} />
        
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

//export default App;
