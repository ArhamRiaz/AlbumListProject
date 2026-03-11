import "./SignUpLogin.css";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { GoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "block",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

export const SignUp = ({ setUser, user }) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + "auth/google",
        {
          token: credentialResponse.credential,
        },
      );

      const { userId, email, name } = response.data.user;

      // Check if the user exists in the database
      const isUser = await axios.post(process.env.REACT_APP_API_URL + "user", {
        id: userId,
      });

      if (isUser.data === undefined || isUser.data.length === 0) {
        // Create a new user if they don't exist
        await axios.post(process.env.REACT_APP_API_URL + "makeuser", {
          clientId: userId,
          email: email,
          name: name,
        });
      }

      // Store user data in state and localStorage
      const userData = { userId, email, name };
      setUser(userData); // Update user state in App component
      localStorage.setItem("user", JSON.stringify(userData));
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const handleGoogleLoginError = () => {
    console.log("Login failed");
  };

  const handleLogout = () => {
    // Clear user data from state and localStorage
    setUser(null); // Update user state in App component
    localStorage.removeItem("user");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        position: "relative",
        overflow: "hidden",
        background: "#0a0a0a",
      }}
    >
      {/* Background image layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(/album_tracker_example.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          opacity: 0.25,
          filter: "blur(2px) saturate(0.8)",
        }}
      />

      {/* Gradient fade-out at bottom */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, transparent 30%, #0a0a0a 85%)",
        }}
      />

      {/* Card content */}
      <Card variant="outlined" style={{ position: "relative", zIndex: 1 }}>
        <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
          <div>
            {user ? (
              // Show user info and logout button if signed in
              <div>
                <h2>Welcome, {user.name}!</h2>
                <button onClick={handleLogout}>Logout</button>
              </div>
            ) : (
              // Show Google Login button if not signed in
              <div style={{ textAlign: "center" }}>
                <Typography
                  component="h1"
                  variant="h4"
                  sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
                >
                  Sign in / Sign Up
                </Typography>
                <GoogleLogin
                  onSuccess={handleGoogleLoginSuccess}
                  onError={handleGoogleLoginError}
                />
                <Typography
                  align="center"
                  variant="h5"
                  paddingTop={2}
                  paddingBottom={2}
                >
                  Welcome to album-tracker.com! Please sign in with a Google
                  account to begin!
                </Typography>
              </div>
            )}
            <Typography
              align="center"
              variant="h5"
              paddingTop={2}
              paddingBottom={2}
            >
              This website makes use of the Discogs API to search for albums.
              Feel free to add as many albums to either your Listen List (albums
              you want to listen to) or Albums List (albums you have already
              listened to)!
            </Typography>
          </div>
        </GoogleOAuthProvider>
      </Card>
    </div>
  );
};
