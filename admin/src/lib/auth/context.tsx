"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { apiClient } from "@/lib/api/client";

interface User {
  id: string;
  email: string;
  displayName: string | null;
  roles: string[];
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await apiClient.get<User>("/auth/me");
        setUser(userData);
      } catch (error) {
        // Not authenticated or token expired. 
        // We could attempt to call /auth/refresh here if /auth/me fails,
        // but for simplicity, let's just let the API client throw or we handle it.
        // Actually, let's try refreshing once if we get a 401.
        try {
          await apiClient.post("/auth/refresh");
          const retryUser = await apiClient.get<User>("/auth/me");
          setUser(retryUser);
        } catch (refreshError) {
          setUser(null);
          if (pathname.startsWith("/") && pathname !== "/login") {
            router.push("/login");
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [pathname, router]);

  const login = (newUser: User) => {
    setUser(newUser);
    router.push("/dashboard");
  };

  const logout = async () => {
    try {
      await apiClient.post("/auth/logout");
    } finally {
      setUser(null);
      router.push("/login");
    }
  };

  const hasPermission = (permission: string) => {
    if (!user) return false;
    if (user.roles.includes("SUPER_ADMIN")) return true;
    return user.permissions.includes(permission);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
