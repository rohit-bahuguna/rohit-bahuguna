import React from "react";
import { IconType } from "react-icons";
import { FaJava } from "react-icons/fa";
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
} from "react-icons/si";

interface SkillItem {
  name: string;
  Icon: IconType;
  color: string;
}

const skills: SkillItem[] = [
  { name: "React", Icon: SiReact, color: "text-cyan-500" },
  { name: "Next.js", Icon: SiNextdotjs, color: "text-slate-900" },
  { name: "Angular", Icon: SiAngular, color: "text-red-600" },
  { name: "NestJS", Icon: SiNestjs, color: "text-rose-600" },
  { name: "JavaScript", Icon: SiJavascript, color: "text-yellow-500" },
  { name: "Node.js", Icon: SiNodedotjs, color: "text-green-600" },
  { name: "MySQL", Icon: SiMysql, color: "text-sky-600" },
  { name: "MongoDB", Icon: SiMongodb, color: "text-green-500" },
  { name: "Express", Icon: SiExpress, color: "text-slate-700" },
  { name: "Tailwind CSS", Icon: SiTailwindcss, color: "text-teal-500" },
  { name: "Redux", Icon: SiRedux, color: "text-purple-500" },
  { name: "Java", Icon: FaJava, color: "text-red-500" },
  { name: "Git", Icon: SiGit, color: "text-orange-600" },
  { name: "HTML5", Icon: SiHtml5, color: "text-orange-500" },
  { name: "CSS3", Icon: SiCss, color: "text-blue-500" },
];

const Skills = () => {
  return (
    <section id="skills" className="bg-[--bg] py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-8">
          <span className="mono text-[10px] font-black uppercase tracking-wider text-black border-2 border-black bg-white px-2.5 py-1 rounded shadow-[2px_2px_0px_#000]">
            Technologies
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight mt-4">
            Stack &amp; Ecosystem
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {skills.map(({ name, Icon, color }) => (
            <div
              key={name}
              className="tech-chip cursor-default"
            >
              <Icon className={`${color} text-base`} />
              <span className="text-xs font-bold text-black">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
