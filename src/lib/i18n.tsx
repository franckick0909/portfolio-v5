"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type Locale = "fr" | "en";

const dictionary = {
  fr: {
    // Hero
    heroTitle1: "CREATIVE",
    heroTitle2: "DESIGNER",
    heroTag: "1,618",
    heroServices: ["/ ART DIRECTION", "/ WEB DESIGN (UX/UI)", "/ DÉVELOPPEMENT WEB"],
    heroLocation: "BASÉ EN FRANCE",
    heroAvailable: "DISPONIBLE POUR COLLABORATION",
    heroEmail: "contact@franckchapelon.com",
    heroExperience: "J'ai l'expérience du web et de UX/UI pour créer des expériences web mémorables pour des marques de TOUTES TAILLES.",
    // Manifesto
    manifestoText: "LE DESIGN N'EST PAS QU'UNE DÉCORATION, C'EST UN OUTIL D'INFLUENCE ET DE CROISSANCE.",
    manifestoLines: [
      "LE DESIGN",
      "N'EST PAS QU'UNE",
      "DÉCORATION, C'EST",
      "UN OUTIL D'INFLUENCE",
      "ET DE CROISSANCE."
    ],
    manifestoTag1: "POUR MOI",
    manifestoTag2: "DSGN/2",
    // About
    aboutLabel: "À PROPOS",
    aboutGreeting: "BONJOUR !",
    aboutName: "JE SUIS FRANCK CHAPELON",
    aboutBio: "Designer & Développeur web freelance basé en Dordogne, avec une passion pour la création d'expériences digitales immersives qui transforment les marques.",
    aboutExperience: "MON PARCOURS",
    // Works
    worksLabel: "PROJETS",
    worksProjects: [
      { name: "Angel-Tattoo", category: "Design & Développement", year: "2024" },
      { name: "Harmonie", category: "Website Cabinet-Infirmier Libérale", year: "2026" },
      { name: "IMMO1.shop", category: "Website E-commerce Skin Care", year: "2025" },
      { name: "Sophie Bluel", category: "Website Architect", year: "2024" },
      { name: "MoviesDB", category: "Movies Web Application", year: "2024" },
    ],
    // Footer
    footerCta: "VOUS AVEZ UN PROJET ?",
    footerContact: "CONTACTEZ-MOI",
    footerRights: "Tous droits réservés. Franck Chapelon",
    footerLegal: "Reproduction ou distribution sans permission interdite.",
    // Nav
    langToggle: "EN",
  },
  en: {
    heroTitle1: "CREATIVE",
    heroTitle2: "DESIGNER",
    heroTag: "1,618",
    heroServices: ["/ ART DIRECTION", "/ WEB DESIGN (UX/UI)", "/ WEB DEVELOPMENT"],
    heroLocation: "BASED IN FRANCE",
    heroAvailable: "AVAILABLE FOR COLLABORATION",
    heroEmail: "contact@franckchapelon.com",
    heroExperience: "I have experience in web and UX/UI, to create memorable web experiences for brands of ALL SIZES.",
    manifestoText: "DESIGN IS NOT JUST DECORATION, BUT A TOOL FOR INFLUENCE AND GROWTH.",
    manifestoLines: [
      "DESIGN",
      "IS NOT JUST",
      "DECORATION, BUT",
      "A TOOL FOR INFLUENCE",
      "AND GROWTH."
    ],
    manifestoTag1: "FOR ME",
    manifestoTag2: "DSGN/2",
    aboutLabel: "ABOUT ME",
    aboutGreeting: "HELLO!",
    aboutName: "I'M FRANCK CHAPELON",
    aboutBio: "Freelance Designer & Web Developer based in Dordogne, France, with a passion for crafting immersive digital experiences that transform brands.",
    aboutExperience: "MY EXPERIENCE",
    worksLabel: "WORKS",
    worksProjects: [
      { name: "Angel-Tattoo", category: "Design & Development", year: "2024" },
      { name: "Harmonie", category: "Website Cabinet-Infirmier Libérale", year: "2026" },
      { name: "IMMO1.shop", category: "Website E-commerce Skin Care", year: "2025" },
      { name: "Sophie Bluel", category: "Website Architect", year: "2024" },
      { name: "MoviesDB", category: "Movies Web Application", year: "2024" },
    ],
    footerCta: "HAVE A PROJECT?",
    footerContact: "GET IN TOUCH",
    footerRights: "All Rights Reserved. Franck Chapelon",
    footerLegal: "Any reproduction or distribution without permission is prohibited.",
    langToggle: "FR",
  },
} as const;

type Dictionary = typeof dictionary.fr;

interface I18nContextType {
  locale: Locale;
  t: Dictionary;
  toggleLocale: () => void;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("fr");

  const toggleLocale = useCallback(() => {
    setLocale((prev) => (prev === "fr" ? "en" : "fr"));
  }, []);

  const t = dictionary[locale] as Dictionary;

  return (
    <I18nContext.Provider value={{ locale, t, toggleLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used within I18nProvider");
  return context;
}
