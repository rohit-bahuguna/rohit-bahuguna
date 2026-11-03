"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import ThemeToggle from "@/app/components/ThemeToggle";
import { HiOutlineLockClosed } from "react-icons/hi";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast.error("Please enter both username and password");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Authentication failed");
        setLoading(false);
        return;
      }

      toast.success("Welcome back! Loading dashboard...");
      setTimeout(() => {
        router.refresh();
      }, 500);
    } catch {
      toast.error("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center p-6 relative">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <Toaster position="bottom-right" />

      <div className="w-full max-w-sm minimal-card p-8 rounded-xl shadow-xl space-y-6">
        <div className="text-center space-y-1.5">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center text-lg mb-3">
            <HiOutlineLockClosed />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Portfolio Admin Vault
          </h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Enter your credentials to manage content, media, and visitor analytics.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 text-xs font-medium border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="e.g. rohit"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-xs font-medium border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="••••••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full h-10 text-xs font-semibold gap-2 mt-2 shadow-sm"
          >
            {loading ? "Authenticating..." : "Sign In to Vault"}
          </button>
        </form>
      </div>
    </div>
  );
}
