import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

class ApiClient {
  private client: AxiosInstance;
  private authToken: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL:
        process.env.NEXT_PUBLIC_API_URL
          ? `${process.env.NEXT_PUBLIC_API_URL}/api`
          : "http://localhost:3001/api",
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        if (this.authToken) {
          config.headers.Authorization = `Bearer ${this.authToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          this.setAuthToken(null);
          if (typeof window !== "undefined") {
            Cookies.remove("authToken");
            window.location.href = "/login";
          }
        }
        return Promise.reject(error);
      }
    );
  }

  setAuthToken(token: string | null) {
    this.authToken = token;
  }

  async get(url: string, config?: AxiosRequestConfig) {
    return this.client.get(url, config);
  }

  async post(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.client.post(url, data, config);
  }

  async put(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.client.put(url, data, config);
  }

  async delete(url: string, config?: AxiosRequestConfig) {
    return this.client.delete(url, config);
  }

  async patch(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.client.patch(url, data, config);
  }
}

export const api = new ApiClient();

// API service methods
export const authService = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),

  register: (data: any) => api.post("/auth/register", data),

  getProfile: () => api.get("/auth/profile"),

  refreshToken: () => api.post("/auth/refresh"),
};

export const tenantService = {
  getCurrent: () => api.get("/api/tenants/current"),

  updateShopifyConfig: (data: any) =>
    api.put("/api/tenants/shopify-config", data),

  testShopifyConnection: () => api.post("/api/tenants/test-shopify"),

  updateSettings: (data: any) => api.put("/api/tenants/settings", data),

  getUsers: () => api.get("/api/tenants/users"),

  createUser: (data: any) => api.post("/api/tenants/users", data),

  updateUser: (userId: string, data: any) =>
    api.put(`/api/tenants/users/${userId}`, data),
};

export const dashboardService = {
  getOverview: () => api.get("/dashboard/overview"),

  getOrdersByDate: (params?: any) =>
    api.get("/dashboard/orders-by-date", { params }),

  getTopCustomers: (params?: any) =>
    api.get("/dashboard/top-customers", { params }),

  getProductPerformance: (params?: any) =>
    api.get("/dashboard/product-performance", { params }),

  getRevenueTrends: (params?: any) =>
    api.get("/dashboard/revenue-trends", { params }),

  getCustomerAnalytics: () => api.get("/dashboard/customer-analytics"),
};

export const syncService = {
  start: (type?: string) => api.post("/api/sync/start", { type }),

  getStatus: () => api.get("/api/sync/status"),

  getHistory: (params?: any) => api.get("/api/sync/history", { params }),

  getLog: (syncId: string) => api.get(`/api/sync/logs/${syncId}`),

  cancel: () => api.post("/api/sync/cancel"),

  getStatistics: () => api.get("/api/sync/statistics"),

  controlScheduler: (action: string) =>
    api.post(`/api/sync/scheduler/${action}`),
};
