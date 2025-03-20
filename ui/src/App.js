import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import React, { useEffect, useState } from 'react';
import ResponsiveAppBar from "./components/ResponsiveAppBar.js";
import { Album } from './components/Album.js';
import axios from 'axios';
import { API_URL } from './utils.js';
import { Typography } from "@mui/material";
import { AddAlbum } from './components/AddAlbum.js';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate, useLocation} from "react-router-dom";
import { SignUp } from './components/SignupLogin/SignUpLogin.js';
import { GoogleOAuthProvider } from "@react-oauth/google";
import Pagination from '@mui/material/Pagination';

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
  const [page, setPage] = useState('signup');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8); // Number of items per page

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    const currPage = window.location.href.split('/')[3]
    localStorage.setItem('page', JSON.stringify(currPage));
    setPage(currPage)
    setLoading(false); // Set loading to false after checking for user
  }, []);

  useEffect(() => {
    if (user) {
      fetchAlbums();
      fetchList();
    }
  }, [user]);

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

  const indexOfLastAlbum = currentPage * itemsPerPage;
  const indexOfFirstAlbum = indexOfLastAlbum - itemsPerPage;
  const currentAlbums = albums.slice(indexOfFirstAlbum, indexOfLastAlbum);
  const currentList = list.slice(indexOfFirstAlbum, indexOfLastAlbum)

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
      <ThemeProvider theme={darkTheme}>
        <Router>
        <ResponsiveAppBar setUser={setUser} user={user} page2={page} />
          <CssBaseline />
          <Routes>
            {/* Public route for signup */}
            <Route path="/signup"  element={<SignUp  setUser={setUser}  user={user}/>}  />

            {/* Protected routes */}
            <Route
              path="/"
              element={
                <ProtectedRoutes user={user} setPage='/Albums List'>
                  <>
                    <Typography align="center" variant="h2" paddingTop={2} paddingBottom={2}>
                      My Album List
                    </Typography>
                    {currentAlbums.map((album) => (
                      <Album album={album} key={album.id} fetchAlbums={fetchAlbums} fetchList={fetchList} userId={user} />
                    ))}
                      <Pagination
                        count={Math.ceil(albums.length / itemsPerPage)}
                        page={currentPage}
                        onChange={(event, page) => setCurrentPage(page)}
                        color="primary"
                        style={{ padding: '20px 0', display: 'flex', justifyContent: 'center' }}
                      />
                      
                  </> 
                </ProtectedRoutes>
              }
            />

            <Route
              path="/listen"
              element={
                <ProtectedRoutes user={user} setPage='/Listen List'>
                  <>
                    <Typography align="center" variant="h2" paddingTop={2} paddingBottom={2}>
                      Album's To Listen To
                    </Typography>
                    {currentList.map((album) => (
                      <Album album={album} key={album.id} fetchAlbums={fetchAlbums} fetchList={fetchList} userId={user} />
                    ))}
                    <Pagination
                        count={Math.ceil(list.length / itemsPerPage)}
                        page={currentPage}
                        onChange={(event, page) => setCurrentPage(page)}
                        color="primary"
                        style={{ padding: '20px 0', display: 'flex', justifyContent: 'center' }}
                      />
                  </>
                </ProtectedRoutes>
              }
            />

            <Route
              path="/search"
              element={
                <ProtectedRoutes user={user} setPage='/Search'>
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