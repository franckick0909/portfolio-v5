"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

type Project = {
  id: string;
  name: string;
  year: string;
  category: string;
  image: string;
};

export default function WorksFooter({ projects }: { projects: Project[] }) {
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);

  return (
    <section className="w-full bg-black text-white pt-24 pb-12 px-4 md:px-8 flex flex-col relative z-40 min-h-[80vh]">
      {/* Top Section */}
      <div className="w-full relative flex justify-center items-center h-[30vh] mb-16">
        {/* Fixed Image on the left */}
        <div 
          className="absolute left-0 top-0 w-48 h-48 md:w-[320px] md:h-[320px] transition-opacity duration-500 pointer-events-none overflow-hidden"
          style={{ opacity: hoveredProject ? 1 : 0 }}
        >
          {projects.map((p) => (
             <Image 
                key={p.id}
                src={p.image} 
                alt={p.name} 
                fill 
                className={`object-cover transition-all ease-[cubic-bezier(0.76,0,0.24,1)] ${hoveredProject?.id === p.id ? 'opacity-100 scale-100 duration-300' : 'opacity-0 scale-110 duration-500'}`} 
             />
          ))}
        </div>
        
        <h2 className="text-5xl md:text-[8rem] font-sans font-normal tracking-tighter">
          (SC-12)
        </h2>
      </div>

      {/* Projects List */}
      <div className="w-full flex flex-col max-w-[2400px] mx-auto mt-auto relative">
        {projects.map((p, index) => {
          const paddedIndex = String(index + 1).padStart(2, '0');
          const shortYear = p.year.slice(-2);
          
          return (
            <Link 
              href={`/projets/${p.id}`} 
              key={p.id} 
              className="group w-full flex flex-row justify-between items-center py-3 border-b border-white/20 cursor-pointer"
              onMouseEnter={() => setHoveredProject(p)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              <div className="w-1/3 flex justify-start">
                 <AnimatedText>SC_{paddedIndex}@{shortYear}</AnimatedText>
              </div>
              
              <div className="w-1/3 flex justify-start md:justify-center">
                 <AnimatedText>{p.name}</AnimatedText>
              </div>
              
              <div className="w-1/3 flex justify-end">
                 <AnimatedText>({p.category})</AnimatedText>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function AnimatedText({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative z-10 px-2 py-0.5 text-[10px] md:text-xs font-sans text-white group-hover:text-black transition-colors duration-500 group-hover:duration-300">
      <span className="absolute inset-0 bg-white origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 group-hover:duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] z-[-1]"></span>
      {children}
    </span>
  );
}
