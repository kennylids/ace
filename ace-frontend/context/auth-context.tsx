"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { AuthUser, UserRole } from "@/lib/types";

interface AuthContextValue {
  user: AuthUser | null;
  login: (email: string, role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  function login(email: string, role: UserRole) {
    setUser({
      name: email.split("@")[0] || "Player",
      email,
      role,
    });
  }

  function logout() {
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
