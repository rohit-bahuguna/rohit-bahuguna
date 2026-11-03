import React from "react";
import { AiFillGithub, AiFillLinkedin, AiFillInstagram, AiFillTwitterCircle } from "react-icons/ai";
import { HiOutlineMail } from "react-icons/hi";
import FooterScrollLinks from "./common/FooterScrollLinks";
import ThemeToggle from "./ThemeToggle";

export interface FooterData {
  logoImage?: string | null;
  copyrightText?: string | null;
  socials?: Array<{ label: string; href: string; icon?: string }>;
}

interface FooterProps {
  data?: FooterData | null;
  navItems?: Array<{ label: string; target: string; visible?: boolean }>;
}

function getSocialIcon(iconName?: string) {
  switch (iconName?.toLowerCase()) {
    case "aifilllinkedin":
    case "linkedin":
      return AiFillLinkedin;
    case "aifillgithub":
    case "github":
      return AiFillGithub;
    case "aifillinstagram":
    case "instagram":
      return AiFillInstagram;
    case "twitter":
    case "x":
      return AiFillTwitterCircle;
    case "mail":
    case "email":
      return HiOutlineMail;
    default:
      return AiFillGithub;
  }
}

const Footer: React.FC<FooterProps> = ({ data, navItems = [] }) => {
  const logoImage = data?.logoImage;
  const copyrightText = data?.copyrightText;
  const socials = data?.socials || [];

  return (
    <footer className="border-t border-border/40 bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-6 py-6 md:py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 pb-5 border-b border-border/40">
          {/* Brand */}
          <div className="flex items-center h-8">
            {logoImage && (
              <img
                src={logoImage}
                alt="Brand Signature"
                className="h-full w-auto object-contain brightness-0 contrast-200 dark:invert transition-all"
              />
            )}
          </div>

          {/* Quick links from Database Header Config */}
          <FooterScrollLinks navItems={navItems} />

          {/* Socials & Theme */}
          <div className="flex items-center gap-2">
            {socials.map(({ label, href, icon }) => {
              const IconComponent = getSocialIcon(icon || label);
              return (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-md border border-border hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <IconComponent className="text-base" />
                </a>
              );
            })}
            <div className="ml-2 pl-2 border-l border-border/60">
              <ThemeToggle />
            </div>
          </div>
        </div>

        {copyrightText && (
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} {copyrightText}</p>
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;
