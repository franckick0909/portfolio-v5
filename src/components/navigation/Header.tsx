"use client";

import { useI18n } from "@/lib/i18n";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { motion, type Transition } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// Importations des images
import imgHome from "../../../public/services/service1.png";
import imgServices from "../../../public/services/service2.png";
import imgAbout from "../../../public/services/service3.png";
import imgContact from "../../../public/services/service4.png";

import imgHarmonie from "../../../public/projets/harmonie/harmonie1.jpg";
import imgImo from "../../../public/projets/imo/imo1.jpg";
import imgMovie from "../../../public/projets/movie/movie1.jpg";
import imgSophie from "../../../public/projets/sophie/sophie1.png";
import imgTatoo from "../../../public/projets/tatoo/tatoo1.jpg";

const menuItems = [
  // Colonne 1 : Pages principales
  { label: "Home", href: "/", img: imgHome, col: 1 },
  { label: "Services", href: "/#services", img: imgServices, col: 1 },
  { label: "À Propos", href: "/#about", img: imgAbout, col: 1 },
  { label: "Contact", href: "/#footer", img: imgContact, col: 1 },
  // Colonne 2 : Projets
  { label: "Harmonie", href: "/projets/harmonie", img: imgHarmonie, col: 2 },
  { label: "Imo", href: "/projets/imo", img: imgImo, col: 2 },
  { label: "Movie", href: "/projets/movie", img: imgMovie, col: 2 },
  { label: "Sophie", href: "/projets/sophie", img: imgSophie, col: 2 },
  { label: "Tatoo", href: "/projets/tatoo", img: imgTatoo, col: 2 },
];

type HeaderProps = {
  projectName?: string;
  shortYear?: string;
  projectIndex?: string;
};

export default function Header({
  projectName,
  shortYear,
  projectIndex,
}: HeaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const menuOverlayRef = useRef<HTMLDivElement>(null);
  const { locale, toggleLocale } = useI18n();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isProjectPage = pathname?.startsWith("/projets/");

  // Index de la page courante (defaultIndex)
  const foundIndex = menuItems.findIndex((m) => {
    if (m.href === "/") return pathname === "/";
    return pathname?.startsWith(m.href);
  });
  const defaultIndex = foundIndex !== -1 ? foundIndex : 0;

  // activeIndex contrôle l'image de fond
  const [activeIndex, setActiveIndex] = useState<number>(defaultIndex);
  // hoverId garantit qu'une NOUVELLE animation se lance à CHAQUE survol, même très rapide
  const [hoverId, setHoverId] = useState<number>(0);
  // hoveredIndex contrôle UNIQUEMENT l'état de survol des liens (flèche + décalage)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const prevIndexRef = useRef<number>(defaultIndex);

  useEffect(() => {
    prevIndexRef.current = activeIndex;
  }, [activeIndex]);

  const handleMouseEnter = (i: number) => {
    setHoveredIndex(i);
    if (i !== activeIndex) {
      setActiveIndex(i);
      setHoverId((prev) => prev + 1);
    }
  };

  const handleMouseLeaveNav = () => {
    setHoveredIndex(null); // On cache toutes les flèches !
    if (activeIndex !== defaultIndex) {
      setActiveIndex(defaultIndex); // L'image revient à la page par défaut
      setHoverId((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setActiveIndex(defaultIndex);
      setHoveredIndex(null);
      setHoverId(0);
    }
  }, [pathname, isOpen, defaultIndex]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const { contextSafe } = useGSAP({ scope: containerRef });

  useGSAP(
    () => {
      gsap.set(menuOverlayRef.current, { yPercent: 100 });
    },
    { scope: containerRef },
  );

  const toggleMenu = contextSafe(() => {
    if (isOpen) {
      setIsOpen(false);
      gsap.to(menuOverlayRef.current, {
        yPercent: -100,
        duration: 1,
        ease: "power2.inOut",
      });
    } else {
      setIsOpen(true);
      gsap.fromTo(
        menuOverlayRef.current,
        { yPercent: 100 },
        { yPercent: 0, duration: 1.4, ease: "expo.out" },
      );
      gsap.fromTo(
        ".menu-fade-item",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.05,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.1,
        },
      );
    }
  });

  useGSAP(
    () => {
      if (isProjectPage) return;
      const handlePreloaderComplete = () => {
        gsap.to(".header-anim", {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          delay: 0.5,
        });
      };
      window.addEventListener("preloaderComplete", handlePreloaderComplete);
      const isHotReload =
        document.readyState === "complete" &&
        !document.querySelector(".preloader-canvas");
      if (isHotReload) handlePreloaderComplete();
      return () =>
        window.removeEventListener(
          "preloaderComplete",
          handlePreloaderComplete,
        );
    },
    { scope: containerRef },
  );

  // Paramètres d'animation Framer Motion super fluides (Spring physics)
  const springConfig: Transition = {
    type: "spring",
    stiffness: 80,
    damping: 20,
    mass: 1,
  };
  const easeConfig: Transition = { duration: 0.8, ease: [0.76, 0, 0.24, 1] };

  return (
    <div ref={containerRef}>
      {/* MENU OVERLAY */}
      <div
        ref={menuOverlayRef}
        className={`fixed inset-0 w-full h-screen bg-background z-[250] flex flex-col md:flex-row ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        {/* PARTIE GAUCHE : IMAGES AVEC ANIMATEPRESENCE POUR FLUIDITÉ MAXIMALE */}
        <div className="relative w-full h-[35vh] md:h-full md:w-[40%] overflow-hidden bg-[#1A1A1A]">
          {menuItems.map((link, i) => {
            const isActive = activeIndex === i;
            const isPrev = prevIndexRef.current === i;

            return (
              <motion.div
                key={i}
                className="absolute inset-0 w-full h-full origin-center"
                initial={false}
                animate={{
                  clipPath:
                    isActive || isPrev
                      ? "inset(0% 0% 0% 0%)"
                      : "inset(100% 0% 0% 0%)",
                  zIndex: isActive ? 20 : isPrev ? 10 : 0,
                  transition: {
                    // On anime uniquement l'apparition de la nouvelle image,
                    // les autres disparaissent instantanément (clipPath 100%) sans transition visible
                    duration: isActive ? 0.9 : 0,
                    ease: [0.16, 1, 0.3, 1],
                  },
                }}
              >
                <Image
                  src={link.img}
                  alt={`Menu background ${i}`}
                  fill
                  className="object-cover"
                  priority={isActive || isPrev}
                />
                <div className="absolute inset-0 bg-black/10" />
              </motion.div>
            );
          })}
        </div>

        {/* PARTIE DROITE : CONTENU */}
        <div className="w-full md:w-[60%] h-[65vh] md:h-full flex flex-col p-6 md:p-16 lg:p-24 text-[#1A1A1A] overflow-y-auto">
          <div className="menu-fade-item text-[10px] md:text-xs font-sans uppercase tracking-[0.2em] text-black/50 mb-6 md:mb-12">
            Découvrir
          </div>

          <div
            className="flex flex-col md:flex-row gap-8 md:gap-16 flex-1"
            onMouseLeave={handleMouseLeaveNav}
          >
            {/* Colonne 1 : Pages Principales */}
            <nav className="flex flex-col gap-0 flex-1">
              {menuItems.map((link, i) => {
                if (link.col !== 1) return null;
                const isCurrentPage = i === defaultIndex;
                const isHovered = hoveredIndex === i && !isCurrentPage;
                const isDimmed = hoveredIndex !== null && hoveredIndex !== i;

                return (
                  <div
                    key={i}
                    className="menu-fade-item relative flex items-center py-2 w-max pr-16 md:pr-24"
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {/* Flèche Framer Motion avec masque de rognage */}
                    <div className="absolute left-0 h-full overflow-hidden flex items-center">
                      <motion.div
                        className="flex items-center justify-center text-[#1A1A1A]"
                        initial={false}
                        animate={{
                          x: isHovered ? 0 : "-100%",
                          y: isHovered ? 0 : "100%",
                        }}
                        transition={springConfig}
                      >
                        <svg
                          className="w-[3em] h-[3em]"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <line x1="7" y1="17" x2="17" y2="7" />
                          <polyline points="10 7 17 7 17 14" />
                        </svg>
                      </motion.div>
                    </div>

                    {/* Texte du Lien Framer Motion */}
                    <motion.div
                      initial={false}
                      animate={{
                        x: isHovered ? "4em" : 0,
                        opacity: isDimmed ? 0.3 : 1,
                      }}
                      transition={springConfig}
                      className="flex"
                    >
                      <Link
                        href={link.href}
                        onClick={toggleMenu}
                        onMouseEnter={() => handleMouseEnter(i)}
                        className={`font-sans text-3xl md:text-4xl lg:text-5xl font-light tracking-tight ${isCurrentPage ? "underline decoration-1 underline-offset-4" : ""}`}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  </div>
                );
              })}
            </nav>

            {/* Colonne 2 : Projets */}
            <nav className="flex flex-col gap-0 flex-1">
              {menuItems.map((link, i) => {
                if (link.col !== 2) return null;
                const isCurrentPage = i === defaultIndex;
                const isHovered = hoveredIndex === i && !isCurrentPage;
                const isDimmed = hoveredIndex !== null && hoveredIndex !== i;

                return (
                  <div
                    key={i}
                    className="menu-fade-item relative flex items-center py-2 w-max pr-16 md:pr-24"
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {/* Flèche Framer Motion avec masque de rognage */}
                    <div className="absolute left-0 h-full overflow-hidden flex items-center">
                      <motion.div
                        className="flex items-center justify-center text-[#1A1A1A]"
                        initial={false}
                        animate={{
                          x: isHovered ? 0 : "-100%",
                          y: isHovered ? 0 : "100%",
                        }}
                        transition={springConfig}
                      >
                        <svg
                          className="w-[3em] h-[3em]"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <line x1="7" y1="17" x2="17" y2="7" />
                          <polyline points="10 7 17 7 17 14" />
                        </svg>
                      </motion.div>
                    </div>

                    {/* Texte du Lien Framer Motion */}
                    <motion.div
                      initial={false}
                      animate={{
                        x: isHovered ? "4em" : 0,
                        opacity: isDimmed ? 0.3 : 1,
                      }}
                      transition={springConfig}
                      className="flex"
                    >
                      <Link
                        href={link.href}
                        onClick={toggleMenu}
                        onMouseEnter={() => handleMouseEnter(i)}
                        className={`font-sans text-3xl md:text-4xl lg:text-5xl font-light tracking-tight ${isCurrentPage ? "underline decoration-1 underline-offset-4" : ""}`}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  </div>
                );
              })}
            </nav>
          </div>

          <div className="menu-fade-item mt-8 md:mt-12 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <div className="text-[10px] font-sans uppercase tracking-widest text-black/50 mb-3">
                Contact
              </div>
              <a
                href="mailto:contact@franckchapelon.com"
                className="font-sans text-xs md:text-sm text-black hover:opacity-50 transition-opacity"
              >
                contact@franckchapelon.com
              </a>
            </div>

            <div>
              <div className="text-[10px] font-sans uppercase tracking-widest text-black/50 mb-3">
                Réseaux Sociaux
              </div>
              <div className="flex flex-wrap gap-4 md:gap-6">
                {["Twitter", "LinkedIn", "Github"].map((social, i) => (
                  <a
                    key={i}
                    href="#"
                    className="font-sans text-xs md:text-sm text-black hover:opacity-50 transition-opacity"
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`fixed left-0 w-full z-[300] flex justify-between items-center pointer-events-auto transition-all duration-500 top-0 px-4 md:px-6 lg:px-12 text-white mix-blend-difference backdrop-blur-sm h-16`}
      >
        <div
          className={`flex-1 flex items-center ${isProjectPage ? "" : "header-anim opacity-0 -translate-y-10"}`}
        >
          <Link
            href="/"
            onClick={() => {
              if (isOpen) toggleMenu();
            }}
            className="group flex font-serif font-medium text-xl md:text-3xl leading-none tracking-wider"
          >
            <div className="flex items-end">
              <span>F</span>
              <span className="overflow-hidden whitespace-nowrap max-w-0 opacity-0 group-hover:max-w-[150px] group-hover:opacity-100 transition-all duration-[700ms] ease-[cubic-bezier(0.76,0,0.24,1)]">
                RANCK
              </span>
            </div>
            <div className="flex items-end transition-all duration-[700ms] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:ml-2">
              <span>C</span>
              <span className="overflow-hidden whitespace-nowrap max-w-0 opacity-0 group-hover:max-w-[150px] group-hover:opacity-100 transition-all duration-[700ms] ease-[cubic-bezier(0.76,0,0.24,1)]">
                HAPELON
              </span>
            </div>
          </Link>
        </div>

        {isProjectPage && projectName && (
          <div className="hidden md:flex justify-center">
            <Link
              href="/#works"
              className="group relative overflow-hidden flex items-center bg-white text-black px-3 py-[3px] gap-2 text-xs md:text-sm font-light cursor-pointer transition-opacity duration-500 w-[200px]"
            >
              <span className="relative z-10 transition-colors duration-500 group-hover:duration-300 group-hover:text-white flex items-center gap-2">
                <span className="opacity-50 group-hover:opacity-100">✕</span>
                <span>{projectName}®</span>
              </span>
              <span className="absolute inset-0 bg-black origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 group-hover:duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] z-0"></span>
            </Link>
          </div>
        )}

        <div
          className={`flex-1 flex items-center justify-end gap-6 md:gap-8 ${isProjectPage ? "" : "header-anim opacity-0 -translate-y-10"}`}
        >
          <button
            onClick={toggleLocale}
            className="font-sans text-xs md:text-sm font-light tracking-[0.25em] hover:opacity-70 transition-opacity"
          >
            {locale === "fr" ? "En" : "Fr"}
          </button>

          <button
            onClick={toggleMenu}
            className="relative h-[1.2em] w-16 md:w-20 overflow-hidden flex items-center justify-end font-sans font-light text-xs md:text-sm tracking-[0.25em] cursor-pointer"
          >
            <div
              className={`absolute right-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${isOpen ? "-translate-y-full" : "translate-y-0"}`}
            >
              Menu
            </div>
            <div
              className={`absolute right-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${isOpen ? "translate-y-0" : "translate-y-full"}`}
            >
              Fermer
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
