"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useLoginMutation } from "@/lib/queries/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const { user } = useAuth();
  const loginMutation = useLoginMutation();
  const [email, setEmail] = useState("maya@example.com");
  const [password, setPassword] = useState("password123");

  if (user) {
    router.replace(user.role === "ADMIN" ? "/admin" : "/feed");
    return null;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          router.push(data.user.role === "ADMIN" ? "/admin" : "/feed");
        },
      }
    );
  }

  return (
    <div className="flex flex-1 flex-col px-5 pt-16">
      <div className="mb-5 flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-primary">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F7F4E9" strokeWidth="1.6">
          <circle cx="12" cy="12" r="9" />
          <path d="M4.5 7.5C8 9.5 16 9.5 19.5 7.5M4.5 16.5C8 14.5 16 14.5 19.5 16.5" />
        </svg>
      </div>
      <h1 className="font-display text-[30px] font-bold tracking-tight mb-1.5">Ace</h1>
      <p className="mb-8 text-[14.5px] leading-relaxed text-muted-foreground">
        Sign in to book onto a clinic or league night, or manage the club&apos;s court schedule.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {loginMutation.isError && (
          <p className="text-[13px] text-destructive">
            {loginMutation.error instanceof Error ? loginMutation.error.message : "Login failed"}
          </p>
        )}

        <Button type="submit" className="mt-1" disabled={loginMutation.isPending}>
          {loginMutation.isPending ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <p className="mt-4 text-center text-[13px] text-muted-foreground">
        No account?{" "}
        <span className="font-semibold text-primary">Create one</span>
      </p>
    </div>
  );
}
