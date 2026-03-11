import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import AlbumIcon from "@mui/icons-material/Album";

function ResponsiveAppBar({ setUser, user }) {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();

  const handleOpenUserMenu = (e) => setAnchorElUser(e.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    handleCloseUserMenu();
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "rgba(10,10,10,0.95)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <Toolbar
        sx={{
          maxWidth: "100%",
          px: 3,
          minHeight: "64px !important",
          justifyContent: "space-between",
        }}
      >
        {/* Logo / Brand */}
        <Box
          onClick={() => navigate("/")}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.2,
            cursor: "pointer",
            textDecoration: "none",
            userSelect: "none",
          }}
        >
          <AlbumIcon sx={{ color: "#c8a96e", fontSize: 22 }} />
          <Typography
            variant="h6"
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              fontSize: "1.1rem",
              color: "#f0ece2",
              letterSpacing: "0.02em",
            }}
          >
            Album Tracker
          </Typography>
        </Box>

        {/* Right side: avatar */}
        {user && (
          <Box>
            <Tooltip title="Account settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  alt={user.name}
                  src={user.picture || ""}
                  sx={{
                    width: 34,
                    height: 34,
                    border: "2px solid rgba(200,169,110,0.4)",
                    fontSize: "14px",
                    background: "#2a2a2a",
                    color: "#c8a96e",
                  }}
                >
                  {user.name ? user.name[0].toUpperCase() : "U"}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "48px" }}
              anchorEl={anchorElUser}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              PaperProps={{
                sx: {
                  background: "#1a1a1a",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "10px",
                  minWidth: "160px",
                },
              }}
            >
              {user.name && (
                <MenuItem
                  disabled
                  sx={{
                    opacity: "1 !important",
                    borderBottom: "1px solid rgba(255,255,255,0.07)",
                    pb: 1.5,
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        color: "#f0ece2",
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 600,
                      }}
                    >
                      {user.name}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "11px",
                        color: "#555",
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      {user.email || ""}
                    </Typography>
                  </Box>
                </MenuItem>
              )}
              <MenuItem
                onClick={handleLogout}
                sx={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "13px",
                  color: "#cc5555",
                  mt: 0.5,
                  "&:hover": { background: "rgba(204,85,85,0.1)" },
                }}
              >
                Log out
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default ResponsiveAppBar;
