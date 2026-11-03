"use client";

import React, { useState, useEffect } from "react";
import ThemeToggle from "@/app/components/ThemeToggle";
import { HiOutlineMenuAlt2, HiOutlineX } from "react-icons/hi";

export interface HeaderData {
  logoType?: "text" | "image";
  logoText?: string;
  logoImage?: string;
  navItems?: Array<{ label: string; target: string; visible?: boolean; order?: number }>;
  ctaButton?: { label: string; target: string; visible?: boolean };
}

interface HeaderProps {
  data?: HeaderData | null;
  isPreview?: boolean;
}

export default function Header({ data, isPreview = false }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navItems = (data?.navItems || []).filter((item) => item.visible !== false);
  const cta = data?.ctaButton;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (target: string) => {
    setMenuOpen(false);
    if (target.startsWith("#")) {
      const el = document.querySelector(target);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    window.location.href = target;
  };

  return (
    <header
      className={`fixed ${isPreview ? "top-11" : "top-0"} left-0 right-0 z-40 transition-all duration-200 border-b ${
        scrolled
          ? "border-border bg-background/80 backdrop-blur-md shadow-xs"
          : "border-transparent bg-background/60 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
        >
          {data?.logoType === "text" ? (
            <span className="font-bold text-base tracking-tight text-foreground">
              {data.logoText || ""}
            </span>
          ) : data?.logoImage ? (
            <img
              src={data.logoImage}
              alt="Brand Signature"
              className="h-9 w-auto object-contain brightness-0 contrast-200 dark:invert transition-all"
            />
          ) : null}
        </button>

        {/* Desktop Navigation */}
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollTo(item.target)}
                className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ))}

            {cta && cta.visible !== false && (
              <button
                onClick={() => scrollTo(cta.target)}
                className="btn btn-primary text-xs h-8 px-3.5 shadow-sm"
              >
                {cta.label}
              </button>
            )}
          </nav>

          {/* Theme Toggle (Light / Dark) */}
          <ThemeToggle />

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
            aria-label="Open menu"
          >
            {menuOpen ? <HiOutlineX className="text-xl" /> : <HiOutlineMenuAlt2 className="text-xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="md:hidden border-b border-border bg-background/95 backdrop-blur-md px-6 py-5 space-y-4 animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollTo(item.target)}
                className="text-sm font-medium text-left text-muted-foreground hover:text-foreground py-1"
              >
                {item.label}
              </button>
            ))}
            {cta && cta.visible !== false && (
              <button
                onClick={() => scrollTo(cta.target)}
                className="btn btn-primary text-xs h-9 px-4 w-full mt-2"
              >
                {cta.label}
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
