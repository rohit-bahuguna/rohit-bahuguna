import React from "react";
import { AiFillGithub, AiFillLinkedin, AiFillInstagram } from "react-icons/ai";
import FooterScrollLinks from "./common/FooterScrollLinks";

const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/rohit--bahuguna", Icon: AiFillLinkedin },
  { label: "GitHub", href: "https://github.com/rohit-bahuguna", Icon: AiFillGithub },
  { label: "Instagram", href: "https://www.instagram.com/the_rohit_bahuguna", Icon: AiFillInstagram },
];

const Footer = () => {
  return (
    <footer className="bg-white border-t-3 border-black text-black">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 pb-6 border-b-2 border-black">
          {/* Brand */}
          <div className="flex items-center h-10">
            <img
              src="/Images/rohitsign.png"
              alt="Rohit Bahuguna Signature"
              className="h-full w-auto object-contain brightness-0 contrast-200"
            />
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap justify-center gap-5">
            <FooterScrollLinks />
          </div>

          {/* Socials */}
          <div className="flex gap-2">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-7 h-7 rounded border-2 border-black bg-white hover:bg-slate-50 hover:translate-y-[-1px] active:translate-y-0 flex items-center justify-center transition-all shadow-[1.5px_1.5px_0px_#000]"
              >
                <Icon className="text-sm" />
              </a>
            ))}
          </div>
        </div>

        <div className="pt-5 text-center sm:text-left text-[10px] text-slate-600 font-extrabold uppercase">
          <p>© {new Date().getFullYear()} Rohit Bahuguna. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
