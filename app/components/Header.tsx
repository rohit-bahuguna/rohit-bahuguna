"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoCloseOutline } from "react-icons/io5";
import { IoColorPaletteOutline } from "react-icons/io5";
import { applyThemeColor } from "@/app/utils/theme";

const navItems = [
  { label: "About", id: "about" },
  { label: "Skills", id: "skills" },
  { label: "Projects", id: "projects" },
  { label: "Contact", id: "contact" },
];

const PRESETS = [
  { name: "Plum", value: "#573e60" },
  { name: "Terracotta", value: "#e2725b" },
  { name: "Yellow", value: "#facc15" },
  { name: "Emerald", value: "#10b981" },
  { name: "Rose", value: "#f43f5e" },
  { name: "Indigo", value: "#4f46e5" },
  { name: "Cyan", value: "#06b6d4" },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [pickerOpen, setPickerOpen] = useState<boolean>(false);
  const [themeColor, setThemeColor] = useState<string>("#573e60");
  const [customInput, setCustomInput] = useState<string>("#573e60");

  const menuRef = useRef<HTMLDivElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("portfolio-theme-color") || "#573e60";
    setThemeColor(saved);
    setCustomInput(saved);
    applyThemeColor(saved);
  }, []);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const handleColorChange = (color: string) => {
    setThemeColor(color);
    setCustomInput(color);
    applyThemeColor(color);
    localStorage.setItem("portfolio-theme-color", color);
  };

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 70;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 border-b-3 border-black bg-white ${
        scrolled ? "shadow-[2px_2px_0px_rgba(0,0,0,0.15)]" : ""
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="hover:translate-y-[-1px] active:translate-y-0 transition-transform flex items-center h-12"
        >
          <img
            src="/Images/rohitsign.png"
            alt="Rohit Bahuguna Signature"
            className="h-full w-auto object-contain brightness-0 contrast-200"
          />
        </button>

        {/* Actions & Nav */}
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="text-xs font-extrabold uppercase tracking-wider text-black hover:text-primary transition-colors"
              >
                {item.label}
              </button>
            ))}
            <a
              href="https://drive.google.com/file/d/1J0kPC3TBdtLQpOvORigxMQtoilkYzL4H/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-filled !py-1.5 !px-4 !text-xs !rounded shadow-[2px_2px_0px_#000]"
            >
              Resume
            </a>
          </nav>

          {/* Color Picker */}
          <div className="relative" ref={pickerRef}>
            <button
              onClick={() => setPickerOpen(!pickerOpen)}
              className="p-2 rounded border-3 border-black bg-white hover:bg-slate-50 transition-colors flex items-center gap-1.5 text-black text-xs font-bold shadow-[2px_2px_0px_#000]"
              title="Change Theme Color"
            >
              <IoColorPaletteOutline className="text-sm text-primary" />
              <span
                className="w-3 h-3 rounded-full border-2 border-black inline-block"
                style={{ backgroundColor: themeColor }}
              />
            </button>

            {pickerOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border-3 border-black rounded-lg shadow-[4px_4px_0px_#000] p-4 flex flex-col gap-3.5 z-50">
                <span className="text-[10px] font-black uppercase tracking-wider text-black block">
                  Select Theme Color
                </span>

                <div className="flex flex-wrap gap-2">
                  {PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => handleColorChange(preset.value)}
                      className={`w-6 h-6 rounded-full border-2 border-black transition-transform ${
                        themeColor === preset.value ? "scale-110 ring-2 ring-black" : "hover:scale-105"
                      }`}
                      style={{ backgroundColor: preset.value }}
                      title={preset.name}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-2 border-t-2 border-black">
                  <input
                    type="color"
                    value={themeColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-9 h-9 rounded-md border-2 border-black cursor-pointer bg-transparent p-0 shrink-0"
                  />
                  <input
                    type="text"
                    value={customInput}
                    onChange={(e) => {
                      setCustomInput(e.target.value);
                      if (e.target.value.length === 7 && e.target.value.startsWith("#")) {
                        handleColorChange(e.target.value);
                      }
                    }}
                    placeholder="#573E60"
                    className="flex-1 text-xs border-2 border-black bg-white text-black rounded px-2.5 py-1.5 focus:outline-none uppercase font-mono font-bold"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded border-3 border-black bg-white hover:bg-slate-50 transition-colors shadow-[2px_2px_0px_#000]"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <GiHamburgerMenu className="text-sm text-black" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 md:hidden">
          <div
            ref={menuRef}
            className="absolute right-0 top-0 h-full w-60 bg-white shadow-2xl flex flex-col p-6 border-l-3 border-black"
          >
            <button
              className="self-end p-1.5 rounded border-3 border-black hover:bg-slate-50 mb-6"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <IoCloseOutline className="text-xl text-black" />
            </button>
            <nav className="flex flex-col gap-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="text-left px-4 py-2.5 rounded border-2 border-transparent hover:border-black hover:bg-slate-50 text-xs font-black uppercase tracking-wider text-black transition-all"
                >
                  {item.label}
                </button>
              ))}
              <a
                href="https://drive.google.com/file/d/1J0kPC3TBdtLQpOvORigxMQtoilkYzL4H/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 btn btn-filled justify-center text-center shadow-[3px_3px_0px_#000]"
              >
                Resume
              </a>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
