"use client";

import React from "react";
import Image from "next/image";
import { HiExternalLink } from "react-icons/hi";
import { FiGithub } from "react-icons/fi";
import { Project } from "@/app/utils/projectData";

interface ProjectCardProps {
  project: Project;
  reverse?: boolean;
}

const ProjectCard = ({ project, reverse = false }: ProjectCardProps) => {
  const { image, heading, tech, githubUrl, liveUrl, description, points } =
    project;

  return (
    <div
      className={`brutal-card p-5 sm:p-6 bg-white flex flex-col ${
        reverse ? "md:flex-row-reverse" : "md:flex-row"
      } gap-6 md:gap-8 items-stretch transition-transform duration-200 hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#000]`}
    >
      {/* Image container */}
      <div className="md:w-[42%] relative rounded-lg overflow-hidden border-2 border-black min-h-[180px] max-h-[220px] flex-shrink-0 bg-slate-50">
        <Image
          src={image}
          alt={heading}
          fill
          className="object-cover"
          sizes="(max-w-768px) 100vw, 320px"
        />
      </div>

      {/* Content */}
      <div className="flex-grow flex flex-col justify-between py-0.5">
        <div>
          {/* Tech pills */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {tech.map(({ title, Icon }) => (
              <span
                key={title}
                className="mono inline-flex items-center gap-1 text-[9px] font-black text-black px-2.5 py-1 rounded border-2 border-black bg-white shadow-[1.5px_1.5px_0px_#000] uppercase tracking-wide"
              >
                <Icon className="text-[10px] text-primary" />
                {title}
              </span>
            ))}
          </div>

          <h3 className="text-lg font-black text-black mb-1.5 tracking-tight uppercase">
            {heading}
          </h3>
          
          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed mb-4 font-semibold">
            {description}
          </p>

          {/* Key points list */}
          <ul className="flex flex-col gap-1.5 mb-4">
            {points.map((point, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 font-semibold"
              >
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-black border border-black flex-shrink-0" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-filled !py-1.5 !px-4 !text-[11px] !rounded shadow-[2px_2px_0px_#000]"
          >
            <HiExternalLink className="text-xs" />
            Live Demo
          </a>
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline !py-1.5 !px-4 !text-[11px] !rounded shadow-[2px_2px_0px_#000]"
          >
            <FiGithub className="text-xs" />
            Source
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
