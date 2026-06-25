import { useMutation } from "@tanstack/react-query";
import { apiFetch, setAccessToken } from "@/lib/api";
import { AuthUser } from "@/lib/types";
import { useAuth } from "@/context/auth-context";

interface AuthResponse {
  user: AuthUser;
  accessToken: string;
}

export function useLoginMutation() {
  const { setSession } = useAuth();
  return useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      apiFetch<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      }),
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      setSession(data.user);
    },
  });
}

export function useRegisterMutation() {
  const { setSession } = useAuth();
  return useMutation({
    mutationFn: (credentials: { name: string; email: string; password: string }) =>
      apiFetch<AuthResponse>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(credentials),
      }),
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      setSession(data.user);
    },
  });
}
