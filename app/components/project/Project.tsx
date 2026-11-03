"use client";

import React from "react";
import ProjectCard, { ProjectItemData } from "./ProjectCard";

interface ProjectProps {
  projects?: ProjectItemData[];
}

export default function Project({ projects = [] }: ProjectProps) {
  return (
    <section id="projects" className="py-8 md:py-10 border-b border-border/40 scroll-mt-16">
      <div className="max-w-4xl mx-auto px-6 space-y-6">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Showcase
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Featured Projects
          </h2>
        </div>

        <div className="flex flex-col gap-4 sm:gap-5">
          {projects.map((project) => (
            <ProjectCard
              key={project.id || project.title}
              project={project}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
