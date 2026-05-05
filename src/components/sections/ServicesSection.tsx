"use client";

import AnimatedTitle from "@/components/AnimatedTitle";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import SplitType from "split-type";

import img1 from "../../../public/services/service1.png";
import img2 from "../../../public/services/service2.png";
import img3 from "../../../public/services/service3.png";
import img4 from "../../../public/services/service4.png";

const servicesData = [
  { 
    title: "Création de site internet sur-mesure", 
    desc: "Votre site web est la vitrine de votre entreprise. Nous créons des sites internet professionnels entièrement personnalisés et optimisés pour l’expérience utilisateur (UX). Que vous ayez besoin d’un site vitrine, d’un site e-commerce, ou d’une plateforme sur-mesure, notre équipe vous assure un design moderne, responsive et en accord avec vos objectifs. En choisissant Jsemproduction, vous obtenez un site internet unique qui reflète l’image de votre entreprise et attire vos clients.",
    features: [
      { name: "Sites vitrines", desc: "Présentez vos services et développez votre présence en ligne." },
      { name: "Sites e-commerce", desc: "Vendez vos produits avec une plateforme sécurisée et intuitive." },
      { name: "Développement sur-mesure", desc: "Solutions adaptées à vos besoins spécifiques et à votre secteur d’activité." }
    ],
    bg: img4.src,
    isVideo: false,
    smallVideo: "/services/service.mp4"
  },
  { 
    title: "Webdesign UX/UI", 
    desc: "Le webdesign UX/UI est essentiel pour assurer une expérience utilisateur optimale. Nous concevons des interfaces attrayantes, ergonomiques et intuitives pour maximiser l’engagement de vos visiteurs. Nous allions créativité et expertise technique pour créer des sites web qui se démarquent visuellement tout en restant faciles à utiliser.",
    features: [
      { name: "Design responsive", desc: "Votre site s’adapte à tous les écrans (mobiles, tablettes, ordinateurs)." },
      { name: "Optimisation UX/UI", desc: "Une navigation fluide pour améliorer l’expérience utilisateur et la conversion." },
      { name: "Création de maquettes", desc: "Nous créons des designs uniques qui reflètent l’identité de votre marque." }
    ],
    bg: img1.src,
    isVideo: false
  },
  { 
    title: "Référencement SEO", 
    desc: "Le référencement naturel SEO est une étape cruciale pour améliorer votre visibilité sur les moteurs de recherche. Notre expertise en SEO à Andorre vous permet de positionner votre site en haut des résultats de Google pour les mots-clés les plus pertinents à votre activité. Avec notre approche stratégique, nous optimisons votre contenu, votre structure et vos performances techniques pour garantir un meilleur classement et attirer du trafic qualifié.",
    features: [
      { name: "Audit SEO complet", desc: "Analyse de votre site et de vos concurrents." },
      { name: "Optimisation des mots-clés", desc: "Intégration des termes les plus recherchés pour votre activité." },
      { name: "SEO technique", desc: "Amélioration de la vitesse de chargement, de l’indexation et de la structure du site." },
      { name: "SEO local", desc: "Optimisation pour les recherches locales à Andorre et dans vos zones d’activité." }
    ],
    bg: img2.src,
    isVideo: false
  },
  { 
    title: "Design Visuel & Branding", 
    desc: "En plus de nos services principaux de développement web, nous proposons une gamme complète de services créatifs pour donner vie à votre marque et la faire briller sur tous les supports.",
    features: [
      { name: "Création de logos", desc: "Un logo sur-mesure qui reflète l’essence de votre entreprise." },
      { name: "Refonte de site internet", desc: "Modernisez votre site existant pour le rendre plus performant et attractif." },
      { name: "Supports imprimés", desc: "Création de cartes de visite, flyers et catalogues professionnels." },
      { name: "Vidéographie & Photo", desc: "Mettez en avant vos produits ou événements avec des visuels de haute qualité." }
    ],
    bg: img3.src,
    isVideo: false
  }
];

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      // --- Title Rule Animation ---
      const titleRule = document.querySelector(".services-title-rule");

      if (titleRule) {
        gsap.fromTo(
          titleRule,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.5,
            ease: "expo.out",
            scrollTrigger: {
              trigger: titleRule,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          },
        );
      }

      // --- Slider Animation ---
      const sections = gsap.utils.toArray(".service-section") as HTMLElement[];
      const images = gsap.utils.toArray(".bg") as HTMLElement[];
      const headings = gsap.utils.toArray(".section-heading") as HTMLElement[];
      const descriptions = gsap.utils.toArray(".section-desc") as HTMLElement[];
      const outers = gsap.utils.toArray(".outer") as HTMLElement[];
      const inners = gsap.utils.toArray(".inner") as HTMLElement[];

      // Safety check
      if (sections.length < 2) return;

      // Split text setup
      const splitHeadings = headings.map(
        (h) =>
          new SplitType(h, {
            types: "words,lines",
            lineClass: "clip-text overflow-hidden pb-2",
          }),
      );

      // Set initial states
      gsap.set(outers, { yPercent: 100 });
      gsap.set(inners, { yPercent: -100 });
      gsap.set(descriptions, { autoAlpha: 0, y: 30 });
      gsap.set(".feature-item", { autoAlpha: 0, y: 30 });
      gsap.set(".section-button", { autoAlpha: 0, y: 20 });
      gsap.set(".small-video", { autoAlpha: 0, scale: 0.9, y: 30 });

      // First slide is visible initially
      gsap.set(outers[0], { yPercent: 0 });
      gsap.set(inners[0], { yPercent: 0 });
      gsap.set(images[0], { yPercent: 0 });
      gsap.set(descriptions[0], { autoAlpha: 1, y: 0 });
      if (splitHeadings[0]?.words) {
        gsap.set(splitHeadings[0].words, { autoAlpha: 1, yPercent: 0 });
      }
      const firstSlideFeatures = sections[0].querySelectorAll(".feature-item");
      const firstSlideBtn = sections[0].querySelector(".section-button");
      const firstSlideVideo = sections[0].querySelector(".small-video");
      if (firstSlideFeatures.length) gsap.set(firstSlideFeatures, { autoAlpha: 1, y: 0 });
      if (firstSlideBtn) gsap.set(firstSlideBtn, { autoAlpha: 1, y: 0 });
      if (firstSlideVideo) gsap.set(firstSlideVideo, { autoAlpha: 1, scale: 1, y: 0 });

      // Create the master scrubbed timeline for pinning
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinContainerRef.current,
          start: "top top",
          end: `+=${sections.length * 100}%`, // Pins the section for 400% of screen height
          pin: true,
          scrub: 1, // Smooth scrub effect
          snap: {
            snapTo: 1 / (sections.length - 1), // Snaps magnetically to each slide
            duration: { min: 0.3, max: 0.8 },
            ease: "power1.inOut",
          },
        },
      });

      sections.forEach((sec, i) => {
        if (i === 0) return;

        const prevIndex = i - 1;
        const tlStep = gsap.timeline();

        // Animate previous background out (parallax)
        tlStep.to(images[prevIndex], { yPercent: -15, ease: "none" }, 0);

        // Animate current in (curtain reveal)
        tlStep
          .fromTo(
            outers[i],
            { yPercent: 100 },
            { yPercent: 0, ease: "none" },
            0,
          )
          .fromTo(
            inners[i],
            { yPercent: -100 },
            { yPercent: 0, ease: "none" },
            0,
          )
          .fromTo(
            images[i],
            { yPercent: 15 },
            { yPercent: 0, ease: "none" },
            0,
          );

        // Stagger words in
        if (splitHeadings[i] && splitHeadings[i].words) {
          tlStep.fromTo(
            splitHeadings[i].words,
            { autoAlpha: 0, yPercent: 150 },
            {
              autoAlpha: 1,
              yPercent: 0,
              ease: "power3.out",
              stagger: 0.02,
            },
            0.2,
          );
        }

        // Animate description in
        if (descriptions[i]) {
          tlStep.fromTo(descriptions[i],
            { autoAlpha: 0, y: 30 },
            { autoAlpha: 1, y: 0, duration: 1, ease: "power3.out" },
            0.5
          );
        }

        const slideFeatures = sec.querySelectorAll(".feature-item");
        const slideBtn = sec.querySelector(".section-button");
        const slideVideo = sec.querySelector(".small-video");

        if (slideVideo) {
          tlStep.fromTo(slideVideo,
            { autoAlpha: 0, scale: 0.9, y: 30 },
            { autoAlpha: 1, scale: 1, y: 0, duration: 1, ease: "power3.out" },
            0.5
          );
        }

        if (slideFeatures.length) {
          tlStep.fromTo(slideFeatures,
            { autoAlpha: 0, y: 30 },
            { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.1 },
            0.6
          );
        }
        if (slideBtn) {
          tlStep.fromTo(slideBtn,
            { autoAlpha: 0, y: 20 },
            { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" },
            0.8
          );
        }

        tl.add(tlStep);
      });

      return () => {
        splitHeadings.forEach((s) => s.revert());
      };
    },
    { scope: sectionRef, dependencies: [] },
  );

  return (
    <section
      ref={sectionRef}
      id="services"
      className="w-full bg-background text-foreground relative z-20"
    >
      {/* Animated Title (Aligned to right) */}
      <div className="relative w-full flex justify-end py-12 md:py-24 px-6 md:px-16 z-30">
        <div className="flex flex-col items-end w-full max-w-max">
          <AnimatedTitle
            text="SERVICES"
            sizeClass="text-[clamp(4rem,14vw,16rem)]"
            className="font-anton text-foreground leading-none tracking-tight uppercase text-right"
            trigger="scroll"
          />
          <div className="services-title-rule w-full h-[2px] md:h-1 opacity-80 origin-right bg-foreground" />
        </div>
      </div>

      {/* Pinned Fullscreen Slider */}
      <div
        ref={pinContainerRef}
        className="relative w-full h-screen overflow-hidden"
      >
        {servicesData.map((s, i) => (
          <section
            className="service-section absolute inset-0 w-full h-full overflow-hidden"
            key={i}
          >
            <div className="outer w-full h-full overflow-hidden">
              <div className="inner w-full h-full overflow-hidden relative">
                <div className="bg absolute w-full h-[130%] top-[-15%] left-0">
                  {/* Background Media */}
                  {s.isVideo ? (
                    <video src={s.bg} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full" style={{ backgroundImage: `url(${s.bg})`, backgroundSize: "cover", backgroundPosition: "center" }} />
                  )}
                  
                  {/* Dark Overlay for text readability */}
                  <div className="absolute inset-0 bg-black/60 md:bg-black/40" />

                  {/* Content Container */}
                  <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 lg:px-24">
                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 w-full max-w-7xl mx-auto">
                      
                      {/* Left Column: Title & Desc */}
                      <div className="flex-1 flex flex-col justify-center">
                        <div className="overflow-hidden z-10 mb-6">
                          <h2 className="section-heading text-[clamp(2.5rem,4vw,6rem)] font-serif font-semibold leading-[1.1] m-0 text-[hsl(0,0%,95%)] tracking-tight">
                            {s.title}
                          </h2>
                        </div>
                        <div className="overflow-hidden z-10">
                          <p className="section-desc text-[clamp(0.95rem,1.1vw,1.2rem)] text-[hsl(0,0%,85%)] leading-relaxed font-sans max-w-2xl">
                            {s.desc}
                          </p>
                        </div>
                        <div className="mt-8 section-button">
                          <button className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors uppercase text-xs tracking-widest cursor-pointer">
                            En savoir plus
                          </button>
                        </div>
                      </div>

                      {/* Right Column: Features List */}
                      <div className="flex-1 flex flex-col justify-center gap-6 pt-10 lg:pt-0">
                        
                        {/* Optional Small Video */}
                        {s.smallVideo && (
                          <div className="small-video w-full md:w-4/5 lg:w-3/4 aspect-video rounded-2xl overflow-hidden shadow-2xl mb-4 border border-white/10 relative">
                            <div className="absolute inset-0 bg-black/20 z-10 pointer-events-none" />
                            <video src={s.smallVideo} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                          </div>
                        )}

                        {s.features.map((feature, fIndex) => (
                          <div key={fIndex} className="feature-item overflow-hidden">
                            <h3 className="text-xl md:text-2xl font-serif text-white mb-2">{feature.name}</h3>
                            <p className="text-sm md:text-base text-white/70 font-sans leading-relaxed">{feature.desc}</p>
                            <div className="w-full h-px bg-white/20 mt-6" />
                          </div>
                        ))}
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
