"use client";

import { useI18n } from "@/lib/i18n";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { motion, type Transition } from "motion/react";
import { Link, useTransitionRouter } from "next-view-transitions";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// Importations des images
import imgHome from "../../../public/services/service3_bg.png";
import imgServices from "../../../public/header/services.jpg";
import imgAbout from "../../../public/header/about.jpg";
import imgContact from "../../../public/header/contact.jpg";

import imgHarmonie from "../../../public/header/projets.jpg";
import imgImo from "../../../public/projets/imo/imo1.jpg";
import imgMovie from "../../../public/projets/movie/movie1.jpg";
import imgSophie from "../../../public/projets/sophie/sophie1.png";
import imgTatoo from "../../../public/projets/tatoo/tatoo1.jpg";

const menuItems = [
  // Colonne 1 : Pages principales
  { label: "Home", href: "/", img: imgHome, col: 1 },
  { label: "Services", href: "/#services", img: imgServices, col: 1 },
  { label: "À Propos", href: "/#about", img: imgAbout, col: 1 },
  {
    label: "Projets",
    href: "/#works",
    img: imgHarmonie,
    col: 1,
  },
  { label: "Contact", href: "/contact", img: imgContact, col: 1 },
  // Colonne 2 : Projets
  { label: "Harmonie", href: "/projets/harmonie", img: imgHarmonie, col: 2 },
  { label: "Imo", href: "/projets/imo", img: imgImo, col: 2 },
  { label: "Movie", href: "/projets/movie", img: imgMovie, col: 2 },
  { label: "Sophie", href: "/projets/sophie", img: imgSophie, col: 2 },
  { label: "Tatoo", href: "/projets/tatoo", img: imgTatoo, col: 2 },
];

const socialLinks = {
  twitter: "https://x.com/FranckDevs",
  linkedin: "https://www.linkedin.com/in/franck-chapelon-154084289/",
  github: "https://github.com/FranckDevs",
};

const emailAddress = "franckchapelon09@gmail.com";

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
  const router = useTransitionRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentHash(window.location.hash);

      const handleHashChange = () => {
        setCurrentHash(window.location.hash);
      };
      window.addEventListener("hashchange", handleHashChange);
      return () => window.removeEventListener("hashchange", handleHashChange);
    }
  }, [pathname]);

  // Intersection Observer for scroll-based active state detection on homepage
  useEffect(() => {
    if (pathname !== "/") return;

    const sections = ["hero", "services", "about", "works", "footer"];
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -50% 0px", // Detect active section in the top-middle part of the viewport
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          if (id === "hero") {
            setCurrentHash("");
          } else {
            setCurrentHash("#" + id);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => {
      sections.forEach((id) => {
        const element = document.getElementById(id);
        if (element) observer.unobserve(element);
      });
    };
  }, [pathname]);

  const isProjectPage = pathname?.startsWith("/projets/");

  // Index de la page courante (defaultIndex)
  const foundIndex = menuItems.findIndex((m) => {
    if (m.href === "/") {
      return (
        pathname === "/" &&
        (!currentHash || currentHash === "" || currentHash === "#")
      );
    }
    // Pour les ancres (#services etc.)
    if (m.href.startsWith("/#")) {
      const hashToMatch = m.href.substring(1); // "#services"
      return pathname === "/" && currentHash === hashToMatch;
    }
    // Pour les projets, correspondance exacte
    return pathname === m.href || pathname?.startsWith(m.href + "/");
  });
  // Sur une page projet, on cherche le lien correspondant dans la col 2
  const defaultIndex = foundIndex !== -1 ? foundIndex : 0;

  // activeIndex contrôle l'image de fond
  const [activeIndex, setActiveIndex] = useState<number>(defaultIndex);
  // hoverId garantit qu'une NOUVELLE animation se lance à CHAQUE survol, même très rapide
  const [hoverId, setHoverId] = useState<number>(0);
  // hoveredIndex contrôle UNIQUEMENT l'état de survol des liens (flèche + décalage)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const prevIndexRef = useRef<number>(defaultIndex);
  const blindObjsRef = useRef(Array.from({ length: 32 }, () => ({ val: 0 })));

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
      const numBlinds = 32;
      let pts = [];
      const H = 100 / numBlinds;
      for (let i = 0; i < numBlinds; i++) {
        const y1 = i * H;
        pts.push(`0% ${y1}%`, `100% ${y1}%`, `100% ${y1}%`, `0% ${y1}%`);
      }
      gsap.set(menuOverlayRef.current, { clipPath: `polygon(${pts.join(", ")})` });
    },
    { scope: containerRef },
  );

  const toggleMenu = contextSafe(() => {
    const numBlinds = 32;
    const overlap = 0.2;
    const updateClipPath = () => {
      let pts = [];
      const H = 100 / numBlinds;
      for (let i = 0; i < numBlinds; i++) {
        const y1 = i * H;
        const y2 = y1 + (blindObjsRef.current[i].val / 100) * (H + overlap);
        pts.push(`0% ${y1}%`, `100% ${y1}%`, `100% ${y2}%`, `0% ${y2}%`);
      }
      if (menuOverlayRef.current) {
        menuOverlayRef.current.style.clipPath = `polygon(${pts.join(", ")})`;
      }
    };

    if (isOpen) {
      setIsOpen(false);
      gsap.to(blindObjsRef.current, {
        val: 0,
        duration: 0.6,
        ease: "power3.inOut",
        stagger: 0.015,
        onUpdate: updateClipPath,
      });
    } else {
      setIsOpen(true);
      gsap.to(blindObjsRef.current, {
        val: 100,
        duration: 0.7,
        ease: "power3.inOut",
        stagger: 0.015,
        onUpdate: updateClipPath,
      });
      gsap.fromTo(
        ".menu-fade-item",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.04,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.2,
        },
      );
    }
  });

  const handleLinkClick = contextSafe((e: React.MouseEvent, href: string) => {
    e.preventDefault();

    const isAnchor = href.startsWith("/#") || href.startsWith("#") || href === "/";
    const targetHash = href.includes("#") ? href.split("#")[1] : "";

    const numBlinds = 32;
    const overlap = 0.2;
    const updateClipPath = () => {
      let pts = [];
      const H = 100 / numBlinds;
      for (let i = 0; i < numBlinds; i++) {
        const y1 = i * H;
        const y2 = y1 + (blindObjsRef.current[i].val / 100) * (H + overlap);
        pts.push(`0% ${y1}%`, `100% ${y1}%`, `100% ${y2}%`, `0% ${y2}%`);
      }
      if (menuOverlayRef.current) {
        menuOverlayRef.current.style.clipPath = `polygon(${pts.join(", ")})`;
      }
    };

    if (isAnchor && pathname === "/") {
      // Navigation sur la même page : fermeture avec lames vénitiennes + scroll fluide
      setIsOpen(false);

      gsap.to(blindObjsRef.current, {
        val: 0,
        duration: 1.0,
        ease: "expo.inOut",
        stagger: 0.02,
        onUpdate: updateClipPath,
      });

      // Positionnement instantané du scroll sous le menu opaque
      if (targetHash) {
        const element = document.getElementById(targetHash);
        if (element) {
          element.scrollIntoView({ behavior: "auto" });
        }
      } else {
        window.scrollTo({ top: 0, behavior: "auto" });
      }

      window.history.pushState(null, "", href);
      setCurrentHash(targetHash ? "#" + targetHash : "");
    } else {
      // Navigation vers une autre page (ex: /contact ou retour home depuis /contact)
      // On ferme le menu de manière fluide d'abord pour éviter toute disparition abrupte,
      // puis on lance la navigation une fois les lames fermées.
      gsap.to(blindObjsRef.current, {
        val: 0,
        duration: 0.6,
        ease: "power3.inOut",
        stagger: 0.012,
        onUpdate: updateClipPath,
        onComplete: () => {
          setIsOpen(false);
          router.push(href);
        },
      });
    }
  });

  const handleLogoClick = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      if (isOpen) {
        handleLinkClick(e, "/");
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
        window.history.pushState(null, "", "/");
        setCurrentHash("");
      }
    } else {
      if (isOpen) {
        handleLinkClick(e, "/");
      }
    }
  };

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
        className={`fixed inset-0 w-full h-dvh bg-background z-[250] flex flex-col md:flex-row ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        {/* PARTIE GAUCHE : IMAGES AVEC ANIMATEPRESENCE POUR FLUIDITÉ MAXIMALE */}
        <div className="hidden md:block relative w-full h-[35vh] md:h-full md:w-[40%] overflow-hidden bg-[#1A1A1A]">
          {menuItems.map((link, i) => {
            const isActive = activeIndex === i;
            const isPrev = prevIndexRef.current === i;

            if (!isActive && !isPrev) return null;

            return (
              <motion.div
                key={i}
                className="absolute inset-0 w-full h-full origin-center"
                initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
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
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/10" />
              </motion.div>
            );
          })}
        </div>

        {/* PARTIE DROITE : CONTENU */}
        <div className="w-full md:w-[60%] h-dvh md:h-full flex flex-col justify-start pt-24 pb-12 px-6 md:px-10 lg:px-20 text-[#1A1A1A] overflow-y-auto">
          <div
            className="flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-16 flex-1"
            onMouseLeave={handleMouseLeaveNav}
          >
            {/* Colonne 1 : Pages Principales */}
            <div className="flex flex-col flex-1">
              <div className="menu-fade-item text-[10px] md:text-xs font-sans uppercase tracking-[0.2em] text-black/50 hover:text-black mb-4 md:mb-12 group relative w-max cursor-pointer pb-1 transition-colors duration-300 select-none">
                Découvrir
                <span className="absolute bottom-0 left-0 h-px w-full bg-current scale-x-0 origin-right transition-transform duration-300 ease-out group-hover:scale-x-100 group-hover:origin-left" />
              </div>
              <nav className="flex flex-col gap-4 sm:gap-2 md:gap-1">
                {menuItems.map((link, i) => {
                  if (link.col !== 1) return null;
                  const isCurrentPage = i === defaultIndex;
                  const isHovered = hoveredIndex === i && !isCurrentPage;
                  const isDimmed = hoveredIndex !== null && hoveredIndex !== i;

                  return (
                    <div
                      key={i}
                      className={`menu-fade-item relative flex items-center py-0.5 sm:py-1 w-max pr-6 md:pr-10 lg:pr-24 ${(link as any).mobileOnly ? "md:hidden" : ""}`}
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
                          onClick={(e) => handleLinkClick(e, link.href)}
                          onMouseEnter={() => handleMouseEnter(i)}
                          className={`font-sans text-[clamp(1.75rem,3.5vw,3.5rem)] leading-[1.1] font-light tracking-tight ${isCurrentPage ? "underline decoration-1 underline-offset-4" : ""}`}
                        >
                          {link.label}
                        </Link>
                      </motion.div>
                    </div>
                  );
                })}
              </nav>
            </div>

            {/* Colonne 2 : Projets */}
            <div className="hidden md:flex flex-col flex-1">
              <div className="menu-fade-item text-[10px] md:text-xs font-sans uppercase tracking-[0.2em] text-black/50 hover:text-black mb-4 md:mb-12 group relative w-max cursor-pointer pb-1 transition-colors duration-300 select-none">
                Projets
                <span className="absolute bottom-0 left-0 h-px w-full bg-current scale-x-0 origin-right transition-transform duration-300 ease-out group-hover:scale-x-100 group-hover:origin-left" />
              </div>
              <nav className="flex flex-col gap-1">
                {menuItems.map((link, i) => {
                  if (link.col !== 2) return null;
                  const isCurrentPage = i === defaultIndex;
                  const isHovered = hoveredIndex === i && !isCurrentPage;
                  const isDimmed = hoveredIndex !== null && hoveredIndex !== i;

                  return (
                    <div
                      key={i}
                      className="menu-fade-item relative flex items-center py-0.5 sm:py-1 w-max pr-6 md:pr-10 lg:pr-24"
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
                          onClick={(e) => handleLinkClick(e, link.href)}
                          onMouseEnter={() => handleMouseEnter(i)}
                          className={`font-sans text-[clamp(1.75rem,3.5vw,3.5rem)] leading-[1.1] font-light tracking-tight ${isCurrentPage ? "underline decoration-1 underline-offset-4" : ""}`}
                        >
                          {link.label}
                        </Link>
                      </motion.div>
                    </div>
                  );
                })}
              </nav>
            </div>
          </div>

          <div className="menu-fade-item mt-8 md:mt-12 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <div className="text-[10px] font-sans uppercase tracking-widest text-black/50 mb-3">
                Contact
              </div>
              <a
                href={`mailto:${emailAddress}`}
                className="group relative inline-block font-sans text-xs md:text-sm text-black pb-0.5"
              >
                <span className="relative z-10">{emailAddress}</span>
                <span className="absolute bottom-0 left-0 h-px w-full bg-black scale-x-0 origin-right transition-transform duration-300 ease-out group-hover:scale-x-100 group-hover:origin-left" />
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
                    className="group relative inline-block font-sans text-xs md:text-sm text-black pb-0.5"
                  >
                    <span className="relative z-10">{social}</span>
                    <span className="absolute bottom-0 left-0 h-px w-full bg-black scale-x-0 origin-right transition-transform duration-300 ease-out group-hover:scale-x-100 group-hover:origin-left" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`fixed left-0 w-full z-[300] flex justify-between items-center pointer-events-auto transition-all duration-500 top-0 px-4 md:px-6 lg:px-12 text-white mix-blend-difference h-16`}
      >
        <div
          className={`flex-1 flex items-center ${isProjectPage ? "" : "header-anim opacity-0 -translate-y-10"}`}
        >
          <Link
            href="/"
            onClick={handleLogoClick}
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
