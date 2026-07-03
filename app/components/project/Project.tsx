"use client";

import React from "react";
import { projects } from "@/app/utils/projectData";
import ProjectCard from "./ProjectCard";

const Project = () => {
  return (
    <section id="projects" className="bg-[--bg] py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-10 text-left">
          <span className="mono text-[10px] font-black uppercase tracking-wider text-black border-2 border-black bg-white px-2.5 py-1 rounded shadow-[2px_2px_0px_#000]">
            Work
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight mt-4">
            Featured Projects
          </h2>
        </div>

        <div className="flex flex-col gap-8">
          {projects.map((project, idx) => (
            <ProjectCard
              key={project.heading}
              project={project}
              reverse={idx % 2 !== 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Project;
