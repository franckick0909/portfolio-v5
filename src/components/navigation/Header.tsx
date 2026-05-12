"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { label: "Home", href: "/" },
  { label: "Projets", href: "/#works" },
  { label: "Services", href: "/#services" },
  { label: "À Propos", href: "/#about" },
  { label: "Commencer", href: "/#footer" },
];

type HeaderProps = {
  projectName?: string;
  shortYear?: string;
  projectIndex?: string;
};

export default function Header({ projectName, shortYear, projectIndex }: HeaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const menuContainer = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { locale, toggleLocale } = useI18n();
  const pathname = usePathname();

  const isProjectPage = pathname?.startsWith("/projets/");

  // Global colors for the animated text links inside the dropdown
  // With mix-blend-difference, text-white becomes black on white backgrounds!
  const textColor = "text-white";
  const hoverTextColor = "group-hover:text-black";
  const bgSlideColor = "bg-white";

  useGSAP(() => {
    if (isProjectPage) return; // No preloader animation on project page

    const handlePreloaderComplete = () => {
      gsap.to(".header-anim", { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.5 });
    };

    window.addEventListener("preloaderComplete", handlePreloaderComplete);
    
    const isHotReload = document.readyState === "complete" && !document.querySelector('.preloader-canvas');
    if (isHotReload) handlePreloaderComplete();

    return () => window.removeEventListener("preloaderComplete", handlePreloaderComplete);
  }, { scope: containerRef });

  const { contextSafe } = useGSAP({ scope: menuContainer });
  const tl = useRef<gsap.core.Timeline | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useGSAP(() => {
    tl.current = gsap.timeline({ paused: true })
      // Roll text animation
      .to(".menu-text-menu", { y: "-100%", opacity: 0, duration: 0.4, ease: "power3.inOut" }, 0)
      .fromTo(".menu-text-close", { y: "100%", opacity: 0 }, { y: "0%", opacity: 1, duration: 0.4, ease: "power3.inOut" }, 0)
      // Stagger links
      .fromTo(".menu-link-item", 
        { y: 15, opacity: 0 }, 
        { y: 0, opacity: 1, stagger: 0.05, duration: 0.4, ease: "power2.out" }, 
        0.1
      );
  }, { scope: menuContainer });

  const handleMouseEnter = contextSafe(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (!isOpen) {
      setIsOpen(true);
      tl.current?.play();
    }
  });

  const handleMouseLeave = contextSafe(() => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      tl.current?.reverse();
    }, 150);
  });

  return (
    <div ref={containerRef}>
      {/* HEADER BAR */}
      <div className={`fixed left-0 w-full z-[200] flex justify-between items-center pointer-events-auto transition-all duration-500 top-3 px-4 md:px-6 lg:px-12 text-white mix-blend-difference`}>
        
        {/* LEFT: LOGO */}
        <div className={`flex-1 flex items-center ${isProjectPage ? '' : 'header-anim opacity-0 -translate-y-10'}`}>
          <Link href="/" onClick={() => setIsOpen(false)} className="group flex font-serif font-medium text-xl md:text-3xl  leading-none tracking-wider">
            <div className="flex items-end">
              <span>F</span>
              <span className="overflow-hidden whitespace-nowrap max-w-0 opacity-0 group-hover:max-w-[150px] group-hover:opacity-100 transition-all duration-[700ms] ease-[cubic-bezier(0.76,0,0.24,1)]">RANCK</span>
            </div>
            <div className="flex items-end transition-all duration-[700ms] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:ml-2">
              <span>C</span>
              <span className="overflow-hidden whitespace-nowrap max-w-0 opacity-0 group-hover:max-w-[150px] group-hover:opacity-100 transition-all duration-[700ms] ease-[cubic-bezier(0.76,0,0.24,1)]">HAPELON</span>
            </div>
          </Link>
        </div>

        {/* CENTER: Project Name (Only on project page) */}
        {isProjectPage && projectName && (
          <div className="hidden md:flex justify-center">
            {/* To visually appear as Black background / White text on a white page under mix-blend-difference, 
                the DOM colors must be bg-white text-black */}
            <Link href="/#works" className="group relative overflow-hidden flex items-center bg-white text-black px-3 py-[3px] gap-2 text-xs md:text-sm font-light cursor-pointer transition-opacity duration-500 w-[200px]">
              <span className="relative z-10 transition-colors duration-500 group-hover:duration-300 group-hover:text-white flex items-center gap-2">
                 <span className="opacity-50 group-hover:opacity-100">✕</span>
                 <span>{projectName}®</span>
              </span>
              <span className="absolute inset-0 bg-black origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 group-hover:duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] z-0"></span>
            </Link>
          </div>
        )}

        {/* RIGHT: CONTROLS (Lang + Menu Toggle) */}
        <div className={`flex-1 flex items-center justify-end gap-4 md:gap-6 ${isProjectPage ? '' : 'header-anim opacity-0 -translate-y-10'}`}>
          <button onClick={toggleLocale} className="font-sans text-[11px] md:text-xs font-light uppercase tracking-[0.2em] hover:opacity-70 transition-opacity">
            {locale === "fr" ? "EN" : "FR"}
          </button>

          {/* Menu Button & Dropdown Container */}
          <div 
            ref={menuContainer}
            className="relative flex flex-col items-end"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
             <button 
                onClick={() => {
                  if (timeoutRef.current) clearTimeout(timeoutRef.current);
                  if (isOpen) { setIsOpen(false); tl.current?.reverse(); }
                  else { setIsOpen(true); tl.current?.play(); }
                }} 
                className="font-sans font-light flex items-center justify-end uppercase tracking-widest text-[11px] md:text-xs"
             >
                {/* Roll Text Container */}
                <div className="relative h-[1.2em] w-16 md:w-20 overflow-hidden flex items-center justify-end">
                   <div className="menu-text-menu absolute right-0 transition-colors duration-500">
                      Menu
                   </div>
                   <div className="menu-text-close absolute right-0 transition-colors duration-500 opacity-0 translate-y-full">
                      Fermer
                   </div>
                </div>
             </button>

             {/* Staggered Links List (Sans background) */}
             <div 
                className={`absolute top-full right-0 pt-1 pb-1 flex flex-col items-end ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
             >
                {links.map((link, i) => (
                   <div key={i} className="menu-link-item opacity-0 translate-y-4">
                     <Link 
                        href={link.href} 
                        onClick={() => {
                          if (timeoutRef.current) clearTimeout(timeoutRef.current);
                          setIsOpen(false);
                          tl.current?.reverse();
                        }} 
                        className="group relative inline-flex items-center px-1 py-0.5 font-sans text-[13px] md:text-[15px] font-normal capitalize tracking-normal overflow-hidden whitespace-nowrap leading-none"
                     >
                        {/* Tape Background effect: Fast on enter (200ms), Slow on leave (700ms) */}
                        <span className={`absolute inset-0 ${bgSlideColor} origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 group-hover:duration-200 ease-[cubic-bezier(0.76,0,0.24,1)] z-0`}></span>
                        
                        {/* We use mix-blend-difference on the text so it automatically inverts against the white tape */}
                        <span className={`relative z-10 block mix-blend-difference ${textColor}`}>
                           {link.label}
                        </span>
                     </Link>
                   </div>
                ))}
             </div>
          </div>

          {isProjectPage && (projectIndex || shortYear) && (
            <div className="group relative hidden md:inline-block overflow-hidden px-2 py-1 cursor-pointer">
              <span className="relative z-10 transition-colors duration-500 group-hover:duration-300 text-white group-hover:text-black font-sans text-[10px] md:text-xs font-bold uppercase tracking-widest">
                 SI_{projectIndex || shortYear}
              </span>
              <span className="absolute inset-0 bg-white origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 group-hover:duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] z-0"></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
