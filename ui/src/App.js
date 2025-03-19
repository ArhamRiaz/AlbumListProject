import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import React, { useEffect, useState } from 'react';
import ResponsiveAppBar from "./components/ResponsiveAppBar.js";
import { Album } from './components/Album.js';
import axios from 'axios';
import { API_URL } from './utils.js';
import { Typography } from "@mui/material";
import { AddAlbum } from './components/AddAlbum.js';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { SignUp } from './components/SignupLogin/SignUpLogin.js';
import { GoogleOAuthProvider } from "@react-oauth/google";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

// ProtectedRoutes component to handle redirection logic
const ProtectedRoutes = ({ user, children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/signup'); // Redirect to signup if no user is found
    }
  }, [user, navigate]);

  if (!user) {
    return null; // Return nothing while redirecting
  }

  return children; // Render the children if the user is logged in
};

export default function App() {
  const [albums, setAlbums] = useState([]);
  const [list, setList] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add a loading state
  const [page, setPage] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
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
      const { data } = await axios.get(API_URL + "album/" + user.userId);
      setAlbums(data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchList = async () => {
    try {
      const { data } = await axios.get(API_URL + "listen/" + user.userId);
      setList(data);
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
      <ThemeProvider theme={darkTheme}>
        <Router>
          <ResponsiveAppBar />
          <CssBaseline />
          <Routes>
            {/* Public route for signup */}
            <Route path="/signup" element={<SignUp setUser={setUser} />} />

            {/* Protected routes */}
            <Route
              path="/"
              element={
                <ProtectedRoutes user={user}>
                  <>
                    <Typography align="center" variant="h2" paddingTop={2} paddingBottom={2}>
                      My Album List
                    </Typography>
                    {albums.map((album) => (
                      <Album album={album} key={album.id} fetchAlbums={fetchAlbums} fetchList={fetchList} userId={user} />
                    ))}
                  </>
                </ProtectedRoutes>
              }
            />

            <Route
              path="/listen"
              element={
                <ProtectedRoutes user={user}>
                  <>
                    <Typography align="center" variant="h2" paddingTop={2} paddingBottom={2}>
                      Album's To Listen To
                    </Typography>
                    {list.map((album) => (
                      <Album album={album} key={album.id} fetchAlbums={fetchAlbums} fetchList={fetchList} userId={user} />
                    ))}
                  </>
                </ProtectedRoutes>
              }
            />

            <Route
              path="/search"
              element={
                <ProtectedRoutes user={user}>
                  <AddAlbum fetchAlbums={fetchAlbums} fetchList={fetchList} userId={user} />
                </ProtectedRoutes>
              }
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}