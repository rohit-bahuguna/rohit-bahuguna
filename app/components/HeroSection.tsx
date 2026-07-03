"use client";

import React from "react";
import Image from "next/image";
import { AiFillGithub, AiFillLinkedin, AiFillInstagram } from "react-icons/ai";

const socials = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/rohit--bahuguna",
    Icon: AiFillLinkedin,
  },
  {
    label: "GitHub",
    href: "https://github.com/rohit-bahuguna",
    Icon: AiFillGithub,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/the_rohit_bahuguna",
    Icon: AiFillInstagram,
  },
];

const HeroSection = () => {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 70;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <section className="bg-[--bg] pt-28 pb-14 overflow-hidden">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-14">
          
          {/* Left Text Column */}
          <div className="flex-grow text-center md:text-left">
            <span className="mono text-[10px] font-extrabold uppercase tracking-wider text-black border-2 border-black bg-white px-3.5 py-1.5 rounded inline-block shadow-[2.5px_2.5px_0px_#000]">
              Full Stack Engineer
            </span>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black leading-[1.25] mt-5 mb-5 tracking-tight">
              Hi, I&apos;m{" "}
              <span className="accent-line text-white">
                Rohit
              </span>{" "}
              Bahuguna
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-800 mb-6 max-w-lg mx-auto md:md-0 leading-relaxed font-semibold">
              I specialize in building full-stack web applications using the MERN stack. Focused on delivering robust backend architectures alongside highly optimized interfaces.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-6">
              <button
                onClick={() => scrollTo("projects")}
                className="btn btn-filled"
              >
                Projects
              </button>
              <a
                href="https://drive.google.com/file/d/1J0kPC3TBdtLQpOvORigxMQtoilkYzL4H/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                Resume
              </a>
            </div>

            {/* Socials */}
            <div className="flex gap-2.5 justify-center md:justify-start">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded border-3 border-black bg-white flex items-center justify-center text-black hover:bg-slate-50 hover:translate-y-[-1px] active:translate-y-0 transition-transform shadow-[2px_2px_0px_#000]"
                >
                  <Icon className="text-lg" />
                </a>
              ))}
            </div>
          </div>

          {/* Right Portrait Column */}
          <div className="flex-shrink-0">
            <div className="w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-xl overflow-hidden border-3 border-black shadow-[6px_6px_0px_#000] bg-white relative transition-transform duration-200 hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_#000]">
              <Image
                src="/Images/rohitBahuguna.jpg"
                alt="Rohit Bahuguna"
                fill
                className="object-cover object-top"
                priority
                sizes="(max-w-1024px) 280px, 320px"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
  
