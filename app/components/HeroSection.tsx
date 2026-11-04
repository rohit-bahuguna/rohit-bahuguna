"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { AiFillGithub, AiFillLinkedin, AiFillInstagram, AiFillTwitterCircle } from "react-icons/ai";
import { HiOutlineMail, HiOutlineArrowRight } from "react-icons/hi";

export interface HeroData {
  badgeText?: string;
  greeting?: string;
  nameHighlight?: string;
  nameSurname?: string;
  bio?: string;
  portraitImage?: string;
  ctaProjects?: { label: string; target: string };
  ctaResume?: { label: string; url: string; target?: string };
  socials?: Array<{ label: string; href: string; icon?: string }>;
}

interface HeroSectionProps {
  data?: HeroData | null;
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
    case "aifilltwitter":
    case "twitter":
    case "x":
      return AiFillTwitterCircle;
    case "email":
    case "mail":
      return HiOutlineMail;
    default:
      return AiFillGithub;
  }
}

export default function HeroSection({ data }: HeroSectionProps) {
  const scrollTo = (id: string) => {
    const cleanId = id.replace("#", "");
    const element = document.getElementById(cleanId);
    if (element) {
      const headerOffset = 70;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  const badgeText = data?.badgeText;
  const greeting = data?.greeting;
  const nameHighlight = data?.nameHighlight;
  const nameSurname = data?.nameSurname;
  const bio = data?.bio;
  const portrait = data?.portraitImage;
  const ctaProjects = data?.ctaProjects;
  const ctaResume = data?.ctaResume;
  const socials = data?.socials || [];

  return (
    <section className="pt-20 pb-8 md:pt-24 md:pb-10 overflow-hidden border-b border-border/40">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12 md:gap-16">
          {/* Narrative Column */}
          <div className="flex-1 text-center md:text-left space-y-5">
            {badgeText && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {badgeText}
              </span>
            )}

            {(greeting || nameHighlight || nameSurname) && (
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.15]">
                {greeting}{" "}
                {nameHighlight && (
                  <span className="text-foreground underline decoration-border decoration-2 underline-offset-6">
                    {nameHighlight}
                  </span>
                )}{" "}
                {nameSurname}
              </h1>
            )}

            {bio && (
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl">
                {bio}
              </p>
            )}

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-2">
              {ctaProjects && (
                <button
                  onClick={() => scrollTo(ctaProjects.target)}
                  className="btn btn-primary text-xs h-10 px-5 gap-1.5 shadow-sm"
                >
                  <span>{ctaProjects.label}</span>
                  <HiOutlineArrowRight className="text-xs" />
                </button>
              )}

              {ctaResume && (
                <Link
                  href="/resume"
                  className="btn btn-outline text-xs h-10 px-5 gap-1.5"
                >
                  <span>{ctaResume.label}</span>
                </Link>
              )}
            </div>

            {/* Socials */}
            {socials.length > 0 && (
              <div className="flex gap-2 justify-center md:justify-start pt-3">
                {socials.map(({ label, href, icon }) => {
                  const IconComponent = getSocialIcon(icon || label);
                  return (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="w-9 h-9 rounded-md border border-input bg-background hover:bg-accent text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
                    >
                      <IconComponent className="text-lg" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Portrait Photo Frame */}
          {portrait && (
            <div className="shrink-0 relative">
              <div className="w-44 h-44 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border border-border shadow-md bg-muted/20 relative">
                <Image
                  src={portrait}
                  alt={`${nameHighlight || ""} ${nameSurname || ""}`.trim() || "Portrait"}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 640px) 176px, 224px"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
