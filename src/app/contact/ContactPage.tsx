"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Link } from "next-view-transitions";
import Header from "@/components/navigation/Header";

export default function ContactPage() {
  const container = useRef<HTMLDivElement>(null);
  const successContainer = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    currentWebsite: "",
    projectType: "site-vitrine", // site-vitrine | ecommerce | web-app | autre
    budget: "5k-15k", // <5k | 5k-15k | 15k-30k | >30k
    timeline: "1-3-mois", // <1-mois | 1-3-mois | 3-6-mois | >6-mois
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Entrance animations on load
  useGSAP(() => {
    // Reveal editorial content on the left
    gsap.from(".reveal-left", {
      x: -50,
      opacity: 0,
      duration: 1.2,
      stagger: 0.1,
      ease: "power3.out",
      delay: 0.1,
    });

    // Reveal form sections
    gsap.from(".reveal-section", {
      y: 40,
      opacity: 0,
      duration: 1.2,
      stagger: 0.15,
      ease: "power3.out",
      delay: 0.2,
    });

    // Reveal form fields stagger
    gsap.from(".reveal-field", {
      y: 20,
      opacity: 0,
      duration: 0.8,
      stagger: 0.05,
      ease: "power3.out",
      delay: 0.4,
    });

    // Slow pulsing background glow animation
    gsap.to(".ambient-glow", {
      xPercent: "random(-15, 15)",
      yPercent: "random(-15, 15)",
      scale: "random(0.9, 1.2)",
      duration: 10,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, { scope: container });

  // Custom Selection Lists Data
  const projectTypes = [
    { id: "site-vitrine", label: "Site Vitrine" },
    { id: "ecommerce", label: "E-Commerce" },
    { id: "web-app", label: "Application Web" },
    { id: "autre", label: "Autre" },
  ];

  const budgets = [
    { id: "<5k", label: "Moins de 5k €" },
    { id: "5k-15k", label: "5k € - 15k €" },
    { id: "15k-30k", label: "15k € - 30k €" },
    { id: ">30k", label: "Plus de 30k €" },
  ];

  const timelines = [
    { id: "<1-mois", label: "Moins d'un mois" },
    { id: "1-3-mois", label: "1 à 3 mois" },
    { id: "3-6-mois", label: "3 à 6 mois" },
    { id: ">6-mois", label: "Plus de 6 mois" },
  ];

  // Input change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  // Select handlers
  const handleSelect = (key: "projectType" | "budget" | "timeline", value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // Reset handler
  const handleReset = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      company: "",
      currentWebsite: "",
      projectType: "site-vitrine",
      budget: "5k-15k",
      timeline: "1-3-mois",
      message: "",
    });
    setErrors({});
  };

  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Le nom est obligatoire";
    if (!form.email.trim()) {
      newErrors.email = "L'adresse email est obligatoire";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "L'adresse email est invalide";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to first error
      const firstErrorEl = document.querySelector(".text-error");
      if (firstErrorEl) {
        firstErrorEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    // Success State
    setIsSubmitted(true);
  };

  // Animation for submission success
  useGSAP(() => {
    if (isSubmitted && successContainer.current) {
      gsap.fromTo(
        successContainer.current.querySelectorAll(".success-reveal"),
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
        }
      );
    }
  }, [isSubmitted]);

  return (
    <>
      <Header />
      <main
        ref={container}
        className="min-h-screen bg-[#050505] text-[#f5f5f5] p-6 md:p-12 lg:p-16 flex flex-col justify-between relative select-none"
      >
        <div className="grain-overlay" />

      {/* SUCCESS SCREEN */}
      {isSubmitted ? (
        <div
          ref={successContainer}
          className="flex-1 flex flex-col items-center justify-center text-center z-10 pt-28 pb-12 max-w-2xl mx-auto w-full"
        >
          {/* Animated checkmark circle */}
          <div className="success-reveal w-20 h-20 rounded-full border-2 border-accent flex items-center justify-center mb-8 relative">
            <svg
              className="w-10 h-10 text-accent"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h2 className="success-reveal text-[clamp(2.2rem,6vw,4.5rem)] font-serif font-semibold leading-none mb-6">
            Merci <span className="italic text-accent font-medium">{form.name.split(" ")[0]}</span> !
          </h2>
          <p className="success-reveal text-sm md:text-base text-zinc-400 max-w-md uppercase tracking-[0.1em] leading-relaxed mb-12">
            Votre demande a bien été reçue. Je reviens vers vous par email sous 24 à 48 heures pour échanger sur votre projet.
          </p>

          <Link
            href="/"
            className="success-reveal border border-zinc-700 hover:border-accent text-[10px] md:text-xs rounded-full px-8 py-5 uppercase tracking-[0.2em] hover:bg-accent hover:text-black font-semibold transition-all duration-500 shadow-lg hover:shadow-[0_0_20px_rgba(255,251,0,0.25)]"
          >
            Retourner à l'accueil
          </Link>
        </div>
      ) : (
        /* MAIN FORM SECTION */
        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start z-10 pt-24 pb-12">
          
          {/* LEFT SIDE: EDITORIAL & INFO */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full lg:sticky lg:top-32">
            <div className="reveal-left">
              <h1 className="text-[12vw] lg:text-[6.5vw] font-serif leading-[0.85] uppercase mb-6 tracking-tighter text-white font-medium">
                Parlons<br />
                <span className="italic font-normal text-accent text-[9vw] lg:text-[4.5vw]">Projet.</span>
              </h1>
              <p className="text-xs text-zinc-300 uppercase tracking-[0.25em] leading-relaxed max-w-sm font-semibold">
                Remplissez ce formulaire en quelques instants pour me faire part de vos ambitions numériques.
              </p>
            </div>

            <div className="mt-16 lg:mt-32 flex flex-col gap-8 reveal-left">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold block mb-1">Direct contact</span>
                <a
                  href="mailto:franckchapelon09@gmail.com"
                  className="text-lg md:text-xl font-medium text-white hover:text-accent transition-colors duration-300 font-sans"
                >
                  franckchapelon09@gmail.com
                </a>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold block mb-1">Location</span>
                <span className="text-sm font-medium text-zinc-200 uppercase tracking-widest font-sans">
                  Dordogne, France
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: ADVANCED FORM */}
          <div className="lg:col-span-7 w-full reveal-section bg-[#0a0a0a] border border-zinc-800/60 rounded-2xl p-6 md:p-10 lg:p-12 shadow-2xl">
            <form className="flex flex-col gap-10" onSubmit={handleSubmit}>
              
              {/* SECTION 1: ABOUT YOU */}
              <div className="reveal-field">
                <h3 className="text-xs md:text-sm font-sans text-white uppercase tracking-[0.2em] border-b border-zinc-800 pb-3 mb-8 font-bold">
                  01 // Vous connaitre
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Name field */}
                  <div className="flex flex-col gap-2 reveal-field">
                    <label className="text-[11px] md:text-xs uppercase tracking-[0.15em] text-zinc-300 font-bold transition-colors duration-300 hover:text-white">Nom complet *</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. Franck Chapelon"
                      className={`bg-transparent border-b ${errors.name ? "border-red-500 focus:border-red-500" : "border-zinc-800 focus:border-accent"} pb-3 outline-none transition-all duration-300 placeholder:text-zinc-700 placeholder:normal-case uppercase tracking-[0.1em] text-xs text-zinc-200`}
                    />
                    {errors.name && <span className="text-error text-[10px] text-red-500 uppercase tracking-wider">{errors.name}</span>}
                  </div>

                  {/* Email field */}
                  <div className="flex flex-col gap-2 reveal-field">
                    <label className="text-[11px] md:text-xs uppercase tracking-[0.15em] text-zinc-300 font-bold transition-colors duration-300 hover:text-white">Adresse email *</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="e.g. hello@domain.com"
                      className={`bg-transparent border-b ${errors.email ? "border-red-500 focus:border-red-500" : "border-zinc-800 focus:border-accent"} pb-3 outline-none transition-all duration-300 placeholder:text-zinc-700 placeholder:normal-case uppercase tracking-[0.1em] text-xs text-zinc-200`}
                    />
                    {errors.email && <span className="text-error text-[10px] text-red-500 uppercase tracking-wider">{errors.email}</span>}
                  </div>

                  {/* Phone field */}
                  <div className="flex flex-col gap-2 md:col-span-2 reveal-field">
                    <label className="text-[11px] md:text-xs uppercase tracking-[0.15em] text-zinc-300 font-bold transition-colors duration-300 hover:text-white">Téléphone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="e.g. +33 6 12 34 56 78"
                      className="bg-transparent border-b border-zinc-800 focus:border-accent pb-3 outline-none transition-all duration-300 placeholder:text-zinc-700 placeholder:normal-case uppercase tracking-[0.1em] text-xs text-zinc-200"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: ABOUT THE PROJECT */}
              <div className="mt-4 reveal-field">
                <h3 className="text-xs md:text-sm font-sans text-white uppercase tracking-[0.2em] border-b border-zinc-800 pb-3 mb-8 font-bold">
                  02 // Votre Projet
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  {/* Company Name */}
                  <div className="flex flex-col gap-2 reveal-field">
                    <label className="text-[11px] md:text-xs uppercase tracking-[0.15em] text-zinc-300 font-bold transition-colors duration-300 hover:text-white">Nom de l'entreprise</label>
                    <input
                      type="text"
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      placeholder="e.g. Acme Corp"
                      className="bg-transparent border-b border-zinc-800 focus:border-accent pb-3 outline-none transition-all duration-300 placeholder:text-zinc-700 placeholder:normal-case uppercase tracking-[0.1em] text-xs text-zinc-200"
                    />
                  </div>

                  {/* Current website */}
                  <div className="flex flex-col gap-2 reveal-field">
                    <label className="text-[11px] md:text-xs uppercase tracking-[0.15em] text-zinc-300 font-bold transition-colors duration-300 hover:text-white">Site web actuel (si existant)</label>
                    <input
                      type="url"
                      name="currentWebsite"
                      value={form.currentWebsite}
                      onChange={handleChange}
                      placeholder="e.g. www.domain.com"
                      className="bg-transparent border-b border-zinc-800 focus:border-accent pb-3 outline-none transition-all duration-300 placeholder:text-zinc-700 placeholder:normal-case uppercase tracking-[0.1em] text-xs text-zinc-200"
                    />
                  </div>
                </div>

                {/* Project Category Selection */}
                <div className="flex flex-col gap-3 mb-8 reveal-field">
                  <label className="text-[11px] md:text-xs uppercase tracking-[0.15em] text-zinc-300 font-bold transition-colors duration-300 hover:text-white">Quel type de site web ?</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {projectTypes.map((type) => (
                      <button
                        type="button"
                        key={type.id}
                        onClick={() => handleSelect("projectType", type.id)}
                        className={`border rounded-lg py-3 px-2 text-[10px] uppercase tracking-widest font-bold text-center cursor-pointer transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] ${form.projectType === type.id ? "border-accent bg-accent/5 text-accent shadow-[0_0_15px_rgba(255,251,0,0.1)]" : "border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"}`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Budget Range */}
                <div className="flex flex-col gap-3 mb-8 reveal-field">
                  <label className="text-[11px] md:text-xs uppercase tracking-[0.15em] text-zinc-300 font-bold transition-colors duration-300 hover:text-white">Budget estimé</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {budgets.map((budget) => (
                      <button
                        type="button"
                        key={budget.id}
                        onClick={() => handleSelect("budget", budget.id)}
                        className={`border rounded-lg py-3 px-2 text-[10px] uppercase tracking-widest font-bold text-center cursor-pointer transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] ${form.budget === budget.id ? "border-accent bg-accent/5 text-accent shadow-[0_0_15px_rgba(255,251,0,0.1)]" : "border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"}`}
                      >
                        {budget.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Timeline / deadline */}
                <div className="flex flex-col gap-3 mb-8 reveal-field">
                  <label className="text-[11px] md:text-xs uppercase tracking-[0.15em] text-zinc-300 font-bold transition-colors duration-300 hover:text-white">Délai de réalisation</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {timelines.map((time) => (
                      <button
                        type="button"
                        key={time.id}
                        onClick={() => handleSelect("timeline", time.id)}
                        className={`border rounded-lg py-3 px-2 text-[10px] uppercase tracking-widest font-bold text-center cursor-pointer transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] ${form.timeline === time.id ? "border-accent bg-accent/5 text-accent shadow-[0_0_15px_rgba(255,251,0,0.1)]" : "border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"}`}
                      >
                        {time.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Detailed Message */}
                <div className="flex flex-col gap-2 reveal-field">
                  <label className="text-[11px] md:text-xs uppercase tracking-[0.15em] text-zinc-300 font-bold transition-colors duration-300 hover:text-white">Message & détails</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Décrivez votre projet, vos objectifs, vos besoins spécifiques..."
                    className="w-full h-32 bg-transparent border border-zinc-800 focus:border-accent rounded-lg p-4 outline-none transition-all duration-300 placeholder:text-zinc-700 placeholder:normal-case uppercase tracking-[0.1em] text-xs text-zinc-200 resize-none leading-relaxed"
                  />
                </div>
              </div>

              {/* DUAL BUTTON ACTIONS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 reveal-field">
                <button
                  type="button"
                  onClick={handleReset}
                  className="border border-zinc-800 hover:border-zinc-500 hover:bg-zinc-900 rounded-full py-4 text-[10px] uppercase tracking-[0.2em] text-zinc-400 hover:text-white font-bold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] w-full cursor-pointer"
                >
                  Réinitialiser
                </button>

                <button
                  type="submit"
                  className="bg-accent border border-accent text-black rounded-full py-4 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-transparent hover:text-accent transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] w-full cursor-pointer shadow-[0_4px_20px_rgba(255,251,0,0.2)] hover:shadow-[0_4px_30px_rgba(255,251,0,0.4)]"
                >
                  Envoyer la demande
                </button>
              </div>

            </form>
          </div>

        </div>
      )}

      {/* Dynamic ambient background glow */}
      <div className="ambient-glow absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] rounded-full bg-accent blur-[220px] opacity-[0.035] pointer-events-none"></div>
      </main>
    </>
  );
}
