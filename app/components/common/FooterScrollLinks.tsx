"use client";

import React from "react";
import Link from "next/link";

interface FooterScrollLinksProps {
  navItems?: Array<{ label: string; target: string; visible?: boolean }>;
}

export default function FooterScrollLinks({ navItems = [] }: FooterScrollLinksProps) {
  const visibleItems = navItems.filter((item) => item.visible !== false);

  const scrollTo = (target: string) => {
    const cleanId = target.replace("#", "");
    const element = document.getElementById(cleanId);
    if (element) {
      const headerOffset = 70;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      return;
    }
    if (target.startsWith("/")) {
      window.location.href = target;
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-5 sm:gap-6">
      {visibleItems.map(({ label, target }) => (
        <button
          key={label}
          onClick={() => scrollTo(target)}
          className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          {label}
        </button>
      ))}
      <Link
        href="/resume"
        className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        Resume
      </Link>
    </div>
  );
}
