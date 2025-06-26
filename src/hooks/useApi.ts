import { useState, useCallback } from "react";
import api from "@/lib/api";
import type { AxiosRequestConfig } from "axios";

type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const request = useCallback(
    async <T>(
      method: HttpMethod,
      url: string,
      data?: any,
      config?: AxiosRequestConfig
    ): Promise<T> => {
      setLoading(true);
      setError(null);

      try {
        const response = await api[method](url, data, config);
        return response.data;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const get = useCallback(<T>(url: string, config?: AxiosRequestConfig) => request<T>("get", url, undefined, config), [request]);
  const post = useCallback(<T>(url: string, data?: any, config?: AxiosRequestConfig) => request<T>("post", url, data, config), [request]);
  const put = useCallback(<T>(url: string, data?: any, config?: AxiosRequestConfig) => request<T>("put", url, data, config), [request]);
  const patch = useCallback(<T>(url: string, data?: any, config?: AxiosRequestConfig) => request<T>("patch", url, data, config), [request]);
  const del = useCallback(<T>(url: string, config?: AxiosRequestConfig) => request<T>("delete", url, undefined, config), [request]);

  return {
    get,
    post,
    put,
    patch,
    delete: del,
    loading,
    error,
  };
};

export default useApi;
