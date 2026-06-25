"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AuthUser } from "@/lib/types";
import { setAccessToken, apiFetch } from "@/lib/api";
import { getQueryClient } from "@/lib/query-client";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  setSession: (user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiFetch<{ accessToken: string }>("/api/auth/refresh", { method: "POST" })
      .then((data) => {
        setAccessToken(data.accessToken);
        return apiFetch<AuthUser>("/api/auth/me");
      })
      .then((me) => setUser(me))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  function setSession(authUser: AuthUser) {
    setUser(authUser);
  }

  function logout() {
    setAccessToken(null);
    setUser(null);
    getQueryClient().clear();
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, setSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
