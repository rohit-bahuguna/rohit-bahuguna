"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`w-9 h-9 rounded-md border border-input bg-background/50 ${className}`} />
    );
  }

  const toggle = () => {
    if (resolvedTheme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return (
    <button
      onClick={toggle}
      className={`w-9 h-9 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-colors cursor-pointer ${className}`}
      title={resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      aria-label="Toggle theme"
    >
      {resolvedTheme === "dark" ? (
        <HiOutlineSun className="text-base text-amber-400" />
      ) : (
        <HiOutlineMoon className="text-base text-slate-700" />
      )}
    </button>
  );
}
