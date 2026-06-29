"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import Cookies from "js-cookie";
import { api } from "./api";

interface User {
  id: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
}

interface Tenant {
  id: string;
  name: string;
  shopifyDomain: string;
  hasShopifyToken: boolean;
}

interface AuthContextType {
  user: User | null;
  tenant: Tenant | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  tenantName: string;
  shopifyDomain: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on mount
    const storedToken = Cookies.get("authToken");
    if (storedToken) {
      setToken(storedToken);
      api.setAuthToken(storedToken);
      loadUserProfile();
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadUserProfile = async () => {
    try {
      const response = await api.get("/auth/profile");
      setUser(response.data.user);
      setTenant(response.data.tenant);
    } catch (error) {
      console.error("Failed to load user profile:", error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const {
        token: newToken,
        user: userData,
        tenant: tenantData,
      } = response.data;

      setToken(newToken);
      setUser(userData);
      setTenant(tenantData);

      Cookies.set("authToken", newToken, {
        expires: 7, // 7 days
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      api.setAuthToken(newToken);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Login failed");
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await api.post("/auth/register", data);
      const {
        token: newToken,
        user: userData,
        tenant: tenantData,
      } = response.data;

      setToken(newToken);
      setUser(userData);
      setTenant(tenantData);

      Cookies.set("authToken", newToken, {
        expires: 7, // 7 days
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      api.setAuthToken(newToken);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Registration failed");
    }
  };

  const logout = () => {
    setUser(null);
    setTenant(null);
    setToken(null);
    Cookies.remove("authToken");
    api.setAuthToken(null);
  };

  const value: AuthContextType = {
    user,
    tenant,
    token,
    login,
    register,
    logout,
    isLoading,
    isAuthenticated: !!user && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
