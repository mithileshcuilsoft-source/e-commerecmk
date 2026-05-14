import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getToken, isUserLoggedIn } from "./auth";
import { toast } from "react-hot-toast";

const API_BASE_URL = "http://localhost:5000";

// Create proxy instance
const proxy = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// REQUEST INTERCEPTOR - Add token to all requests
proxy.interceptors.request.use(
  (config) => {
    const token = getToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR - Handle errors
proxy.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // Clear auth data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      // Show message and redirect
      toast.error("Session expired. Please login again.");
      
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
    }
    
    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      toast.error("You don't have permission to access this resource.");
    }
    
    return Promise.reject(error);
  }
);

// Protected API GET request
export const apiGet = async <T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  if (!isUserLoggedIn()) {
    toast.error("Please login first to access this resource.");
    return Promise.reject(new Error("User not authenticated"));
  }
  
  const response = await proxy.get<T>(url, config);
  return response.data;
};

// Protected API POST request
export const apiPost = async <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  if (!isUserLoggedIn()) {
    toast.error("Please login first to continue.");
    return Promise.reject(new Error("User not authenticated"));
  }
  
  const response = await proxy.post<T>(url, data, config);
  return response.data;
};

// Protected API PUT request
export const apiPut = async <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  if (!isUserLoggedIn()) {
    toast.error("Please login first to make changes.");
    return Promise.reject(new Error("User not authenticated"));
  }
  
  const response = await proxy.put<T>(url, data, config);
  return response.data;
};

// Protected API DELETE request
export const apiDelete = async <T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  if (!isUserLoggedIn()) {
    toast.error("Please login first to delete items.");
    return Promise.reject(new Error("User not authenticated"));
  }
  
  const response = await proxy.delete<T>(url, config);
  return response.data;
};

// Public API calls (no auth required)
export const publicApiGet = async <T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await proxy.get<T>(url, config);
  return response.data;
};

// Public API POST (like login/signup)
export const publicApiPost = async <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await proxy.post<T>(url, data, config);
  return response.data;
};

export default proxy;
