import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

// Get base URL from environment or default to localhost
const getBaseUrl = (): string => {
  // Vite environment
  if (
    typeof import.meta !== "undefined" &&
    (import.meta as any).env?.VITE_API_BASE_URL
  ) {
    return (import.meta as any).env.VITE_API_BASE_URL;
  }
  // Create React App environment
  if (typeof process !== "undefined" && process.env?.REACT_APP_API_BASE_URL) {
    return process.env.REACT_APP_API_BASE_URL;
  }
  // Default
  return "http://localhost:8080";
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Flag to prevent multiple redirects
let isRedirecting = false;

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("access_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle network errors
    if (!error.response) {
      console.error("Network Error: Unable to connect to API server");
      error.message =
        "Unable to connect to server. Please check your connection.";
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      const isLoginPage = window.location.pathname.includes("/login");
      const isAuthEndpoint = error.config?.url?.includes("/auth/login");

      // Don't redirect if:
      // 1. Already on login page
      // 2. This is a login request (let the login form handle the error)
      // 3. Already redirecting
      if (!isLoginPage && !isAuthEndpoint && !isRedirecting) {
        isRedirecting = true;

        // Clear session
        localStorage.removeItem("user");
        localStorage.removeItem("access_token");

        // Redirect to login with callback
        const callbackUrl = encodeURIComponent(
          window.location.pathname + window.location.search
        );
        window.location.href = `/login?callback_url=${callbackUrl}`;

        // Reset flag after a delay (in case redirect fails)
        setTimeout(() => {
          isRedirecting = false;
        }, 3000);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
