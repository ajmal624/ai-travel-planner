import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: `${BASE_URL}/api/`,
});

// --------------------------------------------------
// REQUEST INTERCEPTOR
// Attach the current access token to every API request.
// --------------------------------------------------
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// --------------------------------------------------
// TOKEN REFRESH STATE
// --------------------------------------------------
let isRefreshing = false;
let refreshSubscribers = [];

// Add a request to the waiting queue.
function subscribeTokenRefresh(callback) {
  refreshSubscribers.push(callback);
}

// Give the new token to all waiting requests.
function onRefreshed(newAccessToken) {
  refreshSubscribers.forEach((callback) => {
    callback(newAccessToken);
  });

  refreshSubscribers = [];
}

// --------------------------------------------------
// LOGOUT
// --------------------------------------------------
function logoutUser() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");

  window.location.href = "/login";
}

// --------------------------------------------------
// RESPONSE INTERCEPTOR
// Automatically refresh an expired access token.
// --------------------------------------------------
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // If there is no request config, just return the error.
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Only handle unauthorized requests once.
    if (
      error.response?.status !== 401 ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem("refresh_token");

    // No refresh token available.
    if (!refreshToken) {
      logoutUser();
      return Promise.reject(error);
    }

    // Prevent an infinite refresh loop.
    originalRequest._retry = true;

    // ------------------------------------------------
    // ANOTHER REQUEST IS ALREADY REFRESHING THE TOKEN
    // ------------------------------------------------
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        subscribeTokenRefresh((newAccessToken) => {
          if (!newAccessToken) {
            reject(error);
            return;
          }

          originalRequest.headers.Authorization =
            `Bearer ${newAccessToken}`;

          resolve(api(originalRequest));
        });
      });
    }

    // ------------------------------------------------
    // REFRESH THE ACCESS TOKEN
    // ------------------------------------------------
    isRefreshing = true;

    try {
      const response = await axios.post(
        `${BASE_URL}/api/auth/token/refresh/`,
        {
          refresh: refreshToken,
        }
      );

      const newAccessToken = response.data.access;

      // Save the new access token.
      localStorage.setItem(
        "access_token",
        newAccessToken
      );

      // If SimpleJWT returns a rotated refresh token,
      // save that one too.
      if (response.data.refresh) {
        localStorage.setItem(
          "refresh_token",
          response.data.refresh
        );
      }

      // Tell waiting requests about the new token.
      onRefreshed(newAccessToken);

      // Retry the original request.
      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      // Refresh token is invalid or expired.
      refreshSubscribers = [];

      logoutUser();

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;