"use client";

import React from "react";

const footerLinks = [
  { label: "About", id: "about" },
  { label: "Skills", id: "skills" },
  { label: "Projects", id: "projects" },
  { label: "Contact", id: "contact" },
];

const FooterScrollLinks = () => {
  const scrollTo = (id: string) => {
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
    <>
      {footerLinks.map(({ label, id }) => (
        <button
          key={id}
          onClick={() => scrollTo(id)}
          className="text-[10px] font-black uppercase tracking-wider text-black hover:text-primary transition-colors"
        >
          {label}
        </button>
      ))}
      <a
        href="https://drive.google.com/file/d/1J0kPC3TBdtLQpOvORigxMQtoilkYzL4H/view?usp=sharing"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[10px] font-black uppercase tracking-wider text-black hover:text-primary transition-colors"
      >
        Resume
      </a>
    </>
  );
};

export default FooterScrollLinks;
