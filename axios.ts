import axios, {
  AxiosHeaderValue,
  AxiosInstance,
  AxiosRequestHeaders,
} from "axios";

const API_BASE =
  (import.meta as any).env.VITE_API_BASE_URL || "http://localhost:4000/api";
const GEMINI_KEY = (import.meta as any).env.VITE_GEMINI_API_KEY || "";

const api: AxiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach auth token and optional API keys
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers = config.headers ?? ({} as AxiosRequestHeaders);
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (GEMINI_KEY) {
    config.headers = config.headers ?? ({} as AxiosRequestHeaders);
    config.headers["X-GEMINI-KEY"] = GEMINI_KEY;
  }
  return config;
});

// Basic response interceptor with 401 handling placeholder
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error?.response?.status === 401) {
      // Optional: dispatch logout, refresh token flow, or redirect to login
      console.warn("Unauthorized - clearing token");
      localStorage.removeItem("auth_token");
      // window.location.reload(); // or navigate to login
    }
    return Promise.reject(error);
  }
);

export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem("auth_token", token);
  } else {
    localStorage.removeItem("auth_token");
  }
}

export default api;
