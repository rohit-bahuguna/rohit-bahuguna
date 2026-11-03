"use client";

import React from "react";
import Image from "next/image";
import { HiExternalLink } from "react-icons/hi";
import { FiGithub } from "react-icons/fi";
import { FaCode } from "react-icons/fa";

export interface ProjectItemData {
  id?: string;
  title: string;
  description: string;
  tags: string | string[];
  imageUrl?: string | null;
  liveUrl?: string | null;
  githubUrl?: string | null;
  featured?: boolean;
  order?: number;
}

interface ProjectCardProps {
  project: ProjectItemData;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const { imageUrl, title, tags, githubUrl, liveUrl, description, featured } = project;

  let parsedTags: string[] = [];
  try {
    parsedTags = Array.isArray(tags) ? tags : typeof tags === "string" ? JSON.parse(tags) : [];
  } catch {
    parsedTags = typeof tags === "string" ? tags.split(",").map((t) => t.trim()) : [];
  }

  const trackClick = (targetType: string, url: string) => {
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType: "project_click",
        targetId: `${title} (${targetType})`,
        targetUrl: url,
      }),
      keepalive: true,
    }).catch(() => {});
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden hover:border-foreground/30 hover:shadow-md transition-all duration-200 flex flex-col md:flex-row group">
      {/* Cover Image Frame */}
      <div className="md:w-5/12 relative min-h-[200px] md:min-h-[240px] bg-muted/30 border-b md:border-b-0 md:border-r border-border overflow-hidden flex items-center justify-center">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-103 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, 360px"
          />
        ) : (
          <div className="text-muted-foreground flex flex-col items-center">
            <FaCode className="text-4xl" />
          </div>
        )}

        {featured && (
          <span className="absolute top-3 left-3 text-[10px] font-semibold bg-background/90 text-foreground border border-border px-2 py-0.5 rounded-full shadow-xs">
            Featured
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-6 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          {/* Tech Tag Pills */}
          <div className="flex flex-wrap gap-1.5">
            {parsedTags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-mono font-medium text-muted-foreground bg-muted px-2.5 py-0.5 rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>

          <h3 className="text-lg font-bold tracking-tight text-foreground">
            {title}
          </h3>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick("Live Demo", liveUrl)}
              className="btn btn-primary text-xs h-8 px-3.5 gap-1.5 shadow-xs"
            >
              <HiExternalLink className="text-xs" />
              <span>Live Demo</span>
            </a>
          )}

          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick("Source Code", githubUrl)}
              className="btn btn-outline text-xs h-8 px-3.5 gap-1.5"
            >
              <FiGithub className="text-xs" />
              <span>Source</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
