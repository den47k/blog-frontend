import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
  type AxiosInstance,
} from "axios";
import echo from "./echo";

// API instance initialization
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// CSRF Token Handling
let csrfTokenRequest: Promise<void> | null = null;

const fetchCsrfToken = async (): Promise<void> => {
  await axios.get("/sanctum/csrf-cookie", {
    withCredentials: true,
  });
};

export const ensureCsrfToken = (): Promise<void> => {
  if (hasCsrfToken()) return Promise.resolve();
  if (!csrfTokenRequest) {
    csrfTokenRequest = fetchCsrfToken().finally(() => {
      csrfTokenRequest = null;
    });
  }
  return csrfTokenRequest;
};

const hasCsrfToken = (): boolean => {
  return !!document.cookie.match(/XSRF-TOKEN=[^;]+/);
};

export const resetCsrfToken = (): Promise<void> => {
  return ensureCsrfToken();
};

// Request interceptor
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const method = config.method?.toUpperCase();

  if (method && ["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    await ensureCsrfToken();
  }

  if (echo.socketId()) {
    config.headers['X-Socket-ID'] = echo.socketId();
  }

  if (config.data instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data';
  }

  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 419) {
      await fetchCsrfToken();
      return api(error.config!);
    }

    if (error.response?.status === 401) {
      console.error("Authentication required");
    }

    return Promise.reject(error);
  }
);

export default api;
