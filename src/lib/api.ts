import axios, { AxiosError, type InternalAxiosRequestConfig, type AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
});

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    if (config.method !== 'get' && config.method !== 'GET') {
        await ensureCsrfToken();
    }
    return config;
});

api.interceptors.response.use(
    response => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            console.error('Authentication required');
            // ToDo: Add auth redirect logic
        }

        if (error.response?.status === 419) {
            console.warn('CSRF token expired, refreshing...');
            return resetCsrfToken().then(() => api(error.config!));
        }

        return Promise.reject(error);
    }
)


let csrfTokenRequest: Promise<void> | null = null;

const fetchCsrfToken = async (): Promise<void> => {
  await axios.get(`${import.meta.env.VITE_API_BASE_URL}/sanctum/csrf-cookie`, {
    withCredentials: true
  });
};

export const ensureCsrfToken = (): Promise<void> => {
  if (!csrfTokenRequest) {
    csrfTokenRequest = fetchCsrfToken().finally(() => {
      csrfTokenRequest = null;
    });
  }
  return csrfTokenRequest;
};

export const resetCsrfToken = (): Promise<void> => {
  return ensureCsrfToken();
};

export default api;