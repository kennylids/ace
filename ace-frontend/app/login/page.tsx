"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserRole } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("maya@example.com");
  const [password, setPassword] = useState("••••••••");
  const [role, setRole] = useState<UserRole>("participant");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    login(email, role);
    router.push(role === "admin" ? "/admin" : "/feed");
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

        <div className="flex rounded-xl bg-secondary p-1">
          {(["participant", "admin"] as UserRole[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={cn(
                "flex-1 rounded-lg py-2.5 text-[13.5px] font-semibold capitalize text-muted-foreground transition-colors",
                role === r && "bg-card text-foreground shadow-sm"
              )}
            >
              {r}
            </button>
          ))}
        </div>

        <Button type="submit" className="mt-1">
          Sign in
        </Button>
      </form>

      <p className="mt-4 text-center text-[13px] text-muted-foreground">
        No account?{" "}
        <span className="font-semibold text-primary">Create one</span>
      </p>
    </div>
  );
}
