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
import { SignUp } from './components/SignupLogin/SignUpLogin.js';
import {GoogleOAuthProvider} from "@react-oauth/google"



const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function App() {
  const [albums, setAlbums] = useState([])
  const [list, setList] = useState([])
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add a loading state
  const [page, setPage] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    console.log("checking: ")
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false); // Set loading to false after checking for user
  }, []);

  useEffect(() => {
    if (user) {
      fetchAlbums();
      fetchList();
    }
  }, [user, page]);

  const fetchAlbums = async () => {
    try {
      console.log(user)
      const {data} = await axios.get(API_URL+"album/" + user.userId)
      setAlbums(data)
    } catch (err) {
      console.log(err)
    }
  }

  const fetchList = async () => {
    try {
      const {data} = await axios.get(API_URL+"listen")
      setList(data)
    } catch (err) {
      console.log(err)
    }
  }

  // useEffect(() => {
  //   fetchAlbums()
  //   fetchList()
  // }, [])

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while checking for user
  }
  
  return (
    
    <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
    <ThemeProvider theme={darkTheme}>
      <Router>
        <ResponsiveAppBar/> 
        <CssBaseline />
        <Routes>

        <Route
            path="/listen" element={
              <>
              <Typography align="center" variant="h2" paddingTop={2} paddingBottom={2}>
              Album's To Listen To
              </Typography>
              {list.map((album) => (
                <Album album={album} key={album.id} fetchAlbums={fetchAlbums} fetchList={fetchList} />
              ))}
              </>
            }
            />

        <Route
            path="/" element={
              <>
              <Typography align="center" variant="h2" paddingTop={2} paddingBottom={2}>
                My Album List
              </Typography>
              {albums.map((album) => (
                <Album album={album} key={album.id} fetchAlbums={fetchAlbums} fetchList={fetchList} />
              ))}
              </>
            }
            />

          
          <Route path="/search" element={<AddAlbum fetchAlbums={fetchAlbums} fetchList={fetchList}/>} />

          <Route path="/signup" element={<SignUp/>} />
        
        </Routes>
      </Router>
    </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

//export default App;
