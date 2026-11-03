import React from "react";
import { IconType } from "react-icons";
import { FaJava, FaCode } from "react-icons/fa";
import {
  SiCss,
  SiHtml5,
  SiExpress,
  SiMongodb,
  SiNextdotjs,
  SiReact,
  SiRedux,
  SiNodedotjs,
  SiTailwindcss,
  SiJavascript,
  SiGit,
  SiAngular,
  SiNestjs,
  SiMysql,
  SiDocker,
  SiTypescript,
  SiPostgresql,
  SiPython,
} from "react-icons/si";

export interface SkillItemData {
  id: string;
  name: string;
  category: string;
  iconUrl?: string | null;
  level?: number | null;
  order: number;
}

interface SkillsProps {
  skills?: SkillItemData[];
}

const iconMap: Record<string, { Icon: IconType; color: string }> = {
  react: { Icon: SiReact, color: "text-cyan-500" },
  "next.js": { Icon: SiNextdotjs, color: "text-foreground" },
  nextjs: { Icon: SiNextdotjs, color: "text-foreground" },
  angular: { Icon: SiAngular, color: "text-red-600" },
  nestjs: { Icon: SiNestjs, color: "text-rose-600" },
  javascript: { Icon: SiJavascript, color: "text-amber-500" },
  typescript: { Icon: SiTypescript, color: "text-blue-500" },
  "node.js": { Icon: SiNodedotjs, color: "text-emerald-600" },
  nodejs: { Icon: SiNodedotjs, color: "text-emerald-600" },
  mysql: { Icon: SiMysql, color: "text-sky-600" },
  mongodb: { Icon: SiMongodb, color: "text-emerald-500" },
  postgresql: { Icon: SiPostgresql, color: "text-sky-600" },
  express: { Icon: SiExpress, color: "text-foreground" },
  "tailwind css": { Icon: SiTailwindcss, color: "text-teal-500" },
  tailwind: { Icon: SiTailwindcss, color: "text-teal-500" },
  redux: { Icon: SiRedux, color: "text-purple-500" },
  java: { Icon: FaJava, color: "text-red-500" },
  python: { Icon: SiPython, color: "text-blue-500" },
  git: { Icon: SiGit, color: "text-orange-600" },
  docker: { Icon: SiDocker, color: "text-blue-500" },
  html5: { Icon: SiHtml5, color: "text-orange-500" },
  html: { Icon: SiHtml5, color: "text-orange-500" },
  css3: { Icon: SiCss, color: "text-blue-500" },
  css: { Icon: SiCss, color: "text-blue-500" },
};

const Skills: React.FC<SkillsProps> = ({ skills = [] }) => {
  return (
    <section id="skills" className="py-8 md:py-10 border-b border-border/40">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-6">
          <span className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Technologies
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-3">
            Stack &amp; Ecosystem
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Frameworks, languages, and developer tools I work with regularly.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {skills.map((skill) => {
            const key = skill.name.toLowerCase().trim();
            const config = iconMap[key] || { Icon: FaCode, color: "text-muted-foreground" };
            const IconComponent = config.Icon;

            return (
              <div
                key={skill.id || skill.name}
                className="minimal-card p-3 flex items-center justify-between gap-3 hover:border-foreground/30 transition-all group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {skill.iconUrl ? (
                    <img
                      src={skill.iconUrl}
                      alt={skill.name}
                      className="w-4 h-4 object-contain rounded-xs"
                    />
                  ) : (
                    <IconComponent
                      className={`${config.color} text-base shrink-0 transition-transform group-hover:scale-110`}
                    />
                  )}
                  <span className="text-xs font-medium text-foreground truncate">
                    {skill.name}
                  </span>
                </div>

                {typeof skill.level === "number" && skill.level > 0 && (
                  <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                    {skill.level}%
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;
