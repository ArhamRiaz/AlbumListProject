import axios from "axios";

//export const API_URL = "http://localhost:3001/"
export const API_URL = "https://hdwq4lyanhkzu5bkbf3sdngd6a0pbvvo.lambda-url.us-east-2.on.aws/"
export const API_TOKEN = "ILBEIrnilOVpmgfMlNRoBKdLiiBoTIUqdqtXGYoh"

export const clearSession = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};

// Every request to our API goes through this instance so the Google ID token is
// attached in one place rather than at each call site.
export const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Google ID tokens expire after about an hour. When that happens the API answers 401,
// so drop the stale session and send the user back to sign in.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      clearSession();
      if (window.location.pathname !== "/signup") {
        window.location.assign("/signup");
      }
    }
    return Promise.reject(error);
  },
);
