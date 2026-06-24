"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/context/auth-context";
import { EventsProvider } from "@/context/events-context";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <EventsProvider>{children}</EventsProvider>
    </AuthProvider>
  );
}
