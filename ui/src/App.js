import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import React, { useEffect, useState } from "react";
import ResponsiveAppBar from "./components/ResponsiveAppBar.js";
import { Album } from "./components/Album.js";
import axios from "axios";
import { API_URL } from "./utils.js";
import { AddAlbum } from "./components/AddAlbum.js";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { SignUp } from "./components/SignupLogin/SignUpLogin.js";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Pagination from "@mui/material/Pagination";
import CircularProgress from "@mui/material/CircularProgress";
import HeadphonesIcon from "@mui/icons-material/Headphones";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import SearchIcon from "@mui/icons-material/Search";

const darkTheme = createTheme({
  palette: { mode: "dark" },
  typography: { fontFamily: "'DM Sans', sans-serif" },
});

const ProtectedRoutes = ({ user, children }) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) navigate("/signup");
  }, [user, navigate]);
  if (!user) return null;
  return children;
};

// Sidebar nav item component
const SidebarItem = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: "flex",
      alignItems: "center",
      gap: "12px",
      // width: "100%",
      padding: "12px 16px",
      background: active ? "rgba(200, 169, 110, 0.15)" : "transparent",
      border: "none",
      borderLeft: active ? "3px solid #c8a96e" : "3px solid transparent",
      borderRadius: "0 8px 8px 0",
      color: active ? "#c8a96e" : "#888",
      cursor: "pointer",
      fontSize: "14px",
      fontFamily: "'DM Sans', sans-serif",
      fontWeight: active ? "600" : "400",
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      transition: "all 0.2s ease",
    }}
    onMouseEnter={(e) => {
      if (!active) {
        e.currentTarget.style.color = "#ccc";
        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
      }
    }}
    onMouseLeave={(e) => {
      if (!active) {
        e.currentTarget.style.color = "#888";
        e.currentTarget.style.background = "transparent";
      }
    }}
  >
    {icon}
    {label}
  </button>
);

// Main layout with sidebar
const MainLayout = ({
  user,
  albums,
  list,
  fetchAlbums,
  fetchList,
  isDataLoading,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 40;

  const isAlbumsRoute = location.pathname === "/";
  const isListenRoute = location.pathname === "/listen";
  const isSearchRoute = location.pathname === "/search";

  const activeData = isAlbumsRoute ? albums : list;
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = activeData.slice(indexOfFirst, indexOfLast);

  const pageTitle = isAlbumsRoute
    ? "My Album List"
    : isListenRoute
      ? "Albums To Listen To"
      : "Search Albums";

  return (
    <div
      style={{
        display: "flex",
        minHeight: "calc(100vh - 64px)",
        width: "100vw",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: "220px",
          flexShrink: 0,
          background: "#111",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          padding: "32px 0",
          position: "sticky",
          top: "64px",
          height: "calc(100vh - 64px)",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        <p
          style={{
            color: "#555",
            fontSize: "11px",
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            padding: "0 20px 12px",
          }}
        >
          Library
        </p>

        <SidebarItem
          icon={<HeadphonesIcon sx={{ fontSize: 18 }} />}
          label="Listened"
          active={isAlbumsRoute}
          onClick={() => {
            setCurrentPage(1);
            navigate("/");
          }}
        />
        <SidebarItem
          icon={<QueueMusicIcon sx={{ fontSize: 18 }} />}
          label="Listen List"
          active={isListenRoute}
          onClick={() => {
            setCurrentPage(1);
            navigate("/listen");
          }}
        />

        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            margin: "16px 0",
          }}
        />

        <SidebarItem
          icon={<SearchIcon sx={{ fontSize: 18 }} />}
          label="Search"
          active={isSearchRoute}
          onClick={() => navigate("/search")}
        />

        {/* Counts */}
        {!isSearchRoute && (
          <div
            style={{
              marginTop: "auto",
              padding: "20px",
              borderTop: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <span
                style={{
                  color: "#555",
                  fontSize: "12px",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Listened
              </span>
              <span
                style={{
                  color: "#c8a96e",
                  fontSize: "12px",
                  fontWeight: "600",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {albums.length}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span
                style={{
                  color: "#555",
                  fontSize: "12px",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Listen List
              </span>
              <span
                style={{
                  color: "#c8a96e",
                  fontSize: "12px",
                  fontWeight: "600",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {list.length}
              </span>
            </div>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main
        style={{
          flex: 1,
          padding: "40px 48px",
          overflowY: "auto",
          minHeight: "calc(100vh - 64px)",
          // width: "100%",
        }}
      >
        {isSearchRoute ? (
          <AddAlbum
            fetchAlbums={fetchAlbums}
            fetchList={fetchList}
            userId={user}
          />
        ) : (
          <>
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "2.2rem",
                fontWeight: "700",
                color: "#f0ece2",
                marginBottom: "8px",
                letterSpacing: "-0.02em",
              }}
            >
              {pageTitle}
            </h1>
            <p
              style={{
                color: "#555",
                fontSize: "13px",
                marginBottom: "32px",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {activeData.length} {activeData.length === 1 ? "album" : "albums"}
            </p>

            {isDataLoading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "80px",
                }}
              >
                <CircularProgress sx={{ color: "#c8a96e" }} />
              </div>
            ) : activeData.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "80px 20px",
                  color: "#444",
                }}
              >
                <QueueMusicIcon
                  sx={{ fontSize: 48, marginBottom: 2, color: "#333" }}
                />
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "15px",
                  }}
                >
                  No albums yet — head to Search to add some.
                </p>
              </div>
            ) : (
              <>
                {/* Album grid */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(8, 1fr)",
                    gap: "24px",
                    marginBottom: "40px",
                  }}
                >
                  {currentItems.map((album) => (
                    <Album
                      album={album}
                      key={album.id}
                      fetchAlbums={fetchAlbums}
                      fetchList={fetchList}
                      userId={user}
                    />
                  ))}
                </div>

                {activeData.length > itemsPerPage && (
                  <Pagination
                    count={Math.ceil(activeData.length / itemsPerPage)}
                    page={currentPage}
                    onChange={(_, p) => setCurrentPage(p)}
                    color="primary"
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      "& .MuiPaginationItem-root": {
                        color: "#888",
                        fontFamily: "'DM Sans', sans-serif",
                      },
                      "& .Mui-selected": {
                        background: "rgba(200,169,110,0.2) !important",
                        color: "#c8a96e",
                      },
                    }}
                  />
                )}
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default function App() {
  const [albums, setAlbums] = useState([]);
  const [list, setList] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      fetchAlbums();
      fetchList();
    }
  }, [user]);

  const fetchAlbums = async () => {
    setIsDataLoading(true);
    try {
      const { data } = await axios.get(API_URL + "album/" + user.userId);
      setAlbums(data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsDataLoading(false);
    }
  };

  const fetchList = async () => {
    setIsDataLoading(true);
    try {
      const { data } = await axios.get(API_URL + "listen/" + user.userId);
      setList(data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsDataLoading(false);
    }
  };

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#0a0a0a",
        }}
      >
        <CircularProgress sx={{ color: "#c8a96e" }} />
      </div>
    );

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <Router>
          <ResponsiveAppBar setUser={setUser} user={user} />
          <Routes>
            <Route
              path="/signup"
              element={<SignUp setUser={setUser} user={user} />}
            />
            <Route
              path="/*"
              element={
                <ProtectedRoutes user={user}>
                  <MainLayout
                    user={user}
                    albums={albums}
                    list={list}
                    fetchAlbums={fetchAlbums}
                    fetchList={fetchList}
                    isDataLoading={isDataLoading}
                  />
                </ProtectedRoutes>
              }
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}
