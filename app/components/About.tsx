import React from "react";
import Image from "next/image";

interface JourneyItem {
  year: string;
  title: string;
  description: string;
}

const journey: JourneyItem[] = [
  {
    year: "2021",
    title: "Java Fundamentals",
    description: "Built key foundations in object-oriented programming, data structures, and algorithms.",
  },
  {
    year: "2022",
    title: "Full Stack MERN",
    description: "Expanded learning to JavaScript, Node.js, Express, databases, and client-side styling.",
  },
  {
    year: "2023",
    title: "Shipping Web Portals",
    description: "Designed, built, and shipped complex responsive web projects with cart and auth systems.",
  },
  {
    year: "2024+",
    title: "Next.js & TypeScript",
    description: "Focusing on optimized architectures, server components, and production-ready applications.",
  },
];

const About = () => {
  return (
    <section id="about" className="bg-[--bg] py-14">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-10 md:gap-14 items-start">
          {/* Left Column: Bio */}
          <div className="flex-1 w-full">
            <span className="mono text-[10px] font-black uppercase tracking-wider text-black border-2 border-black bg-white px-2.5 py-1 rounded shadow-[2px_2px_0px_#000]">
              Profile
            </span>
            
            <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight mt-4 mb-5">
              About Me
            </h2>
            
            <div className="brutal-card p-6 flex flex-col gap-4 text-xs sm:text-sm text-slate-800 leading-relaxed font-semibold">
              <p>
                I am a <strong className="text-primary font-extrabold uppercase">Full Stack Developer</strong> focusing on building fast, reliable, and clean web portals. I maintain a strong interest in system architecture, clean interfaces, and optimal performance.
              </p>
              <p>
                With hands-on experience across both front-end and back-end integration, I build APIs, state logic, responsive styling, and database integrations.
              </p>
            </div>

            {/* Metadata list */}
            <div className="mt-6 flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs border-2 border-black rounded p-2.5 bg-white font-bold shadow-[2px_2px_0px_#000]">
                <span className="text-slate-600">Focus Tech</span>
                <span className="text-black uppercase">MERN &amp; Next.js</span>
              </div>
              <div className="flex justify-between items-center text-xs border-2 border-black rounded p-2.5 bg-white font-bold shadow-[2px_2px_0px_#000]">
                <span className="text-slate-600">Projects Done</span>
                <span className="text-black uppercase">10+ Shipped</span>
              </div>
              <div className="flex justify-between items-center text-xs border-2 border-black rounded p-2.5 bg-white font-bold shadow-[2px_2px_0px_#000]">
                <span className="text-slate-600">Base Location</span>
                <span className="text-black uppercase">India</span>
              </div>
            </div>
          </div>

          {/* Right Column: Timeline */}
          <div className="flex-1 w-full">
            <span className="mono text-[10px] font-black uppercase tracking-wider text-black border-2 border-black bg-white px-2.5 py-1 rounded shadow-[2px_2px_0px_#000]">
              Journey
            </span>
            
            <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight mt-4 mb-5">
              Timeline
            </h2>
            
            <div className="relative border-l-3 border-black pl-4 ml-1.5 flex flex-col gap-6">
              {journey.map(({ year, title, description }) => (
                <div key={year} className="relative group">
                  {/* Timeline dot */}
                  <span className="absolute -left-[22.5px] top-1.5 w-3.5 h-3.5 rounded-full bg-white border-3 border-black group-hover:bg-primary transition-colors" />
                  
                  <div className="brutal-card p-4 hover:translate-y-[-1px]">
                    <span className="mono text-[9px] font-extrabold text-white bg-black border border-black rounded px-2 py-0.5 inline-block mb-1.5">
                      {year}
                    </span>
                    
                    <h3 className="text-xs sm:text-sm font-extrabold text-black mb-1">
                      {title}
                    </h3>
                    
                    <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
