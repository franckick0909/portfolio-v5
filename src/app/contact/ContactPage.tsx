"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Link } from "next-view-transitions";
import Header from "@/components/navigation/Header";
import { useI18n } from "@/lib/i18n";

export default function ContactPage() {
  const container = useRef<HTMLDivElement>(null);
  const successContainer = useRef<HTMLDivElement>(null);
  const { locale } = useI18n();

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
    // Reveal text elements stagger
    gsap.from(".reveal-text", {
      y: 30,
      opacity: 0,
      duration: 1.2,
      stagger: 0.1,
      ease: "power3.out",
      delay: 0.1,
    });

    // Reveal form fields/sections step-by-step
    gsap.from(".reveal-field", {
      y: 40,
      opacity: 0,
      duration: 1.2,
      stagger: 0.08,
      ease: "power3.out",
      delay: 0.3,
    });
  }, { scope: container });

  // Custom Selection Lists Data
  const projectTypes = [
    { id: "site-vitrine", label: locale === "fr" ? "Site Vitrine" : "Vitrine Site" },
    { id: "ecommerce", label: "E-Commerce" },
    { id: "web-app", label: locale === "fr" ? "Application Web" : "Web App" },
    { id: "autre", label: locale === "fr" ? "Autre" : "Other" },
  ];

  const budgets = [
    { id: "<5k", label: locale === "fr" ? "Moins de 5k €" : "Under 5k €" },
    { id: "5k-15k", label: "5k € - 15k €" },
    { id: "15k-30k", label: "15k € - 30k €" },
    { id: ">30k", label: locale === "fr" ? "Plus de 30k €" : "Over 30k €" },
  ];

  const timelines = [
    { id: "<1-mois", label: locale === "fr" ? "Moins d'un mois" : "Less than 1 month" },
    { id: "1-3-mois", label: locale === "fr" ? "1 à 3 mois" : "1 to 3 months" },
    { id: "3-6-mois", label: locale === "fr" ? "3 à 6 mois" : "3 to 6 months" },
    { id: ">6-mois", label: locale === "fr" ? "Plus de 6 mois" : "Over 6 months" },
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
    if (!form.name.trim()) {
      newErrors.name = locale === "fr" ? "Le nom est obligatoire" : "Name is required";
    }
    if (!form.email.trim()) {
      newErrors.email = locale === "fr" ? "L'adresse email est obligatoire" : "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = locale === "fr" ? "L'adresse email est invalide" : "Email is invalid";
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
        className="min-h-screen bg-[#E8E5E0] text-[#0a0a0a] p-6 md:p-12 lg:p-16 flex flex-col justify-between relative select-none"
      >
        <div className="grain-overlay" />

        {isSubmitted ? (
          /* SUCCESS SCREEN */
          <div
            ref={successContainer}
            className="flex-1 flex flex-col items-center justify-center text-center z-10 pt-28 pb-12 max-w-2xl mx-auto w-full"
          >
            {/* Animated checkmark circle */}
            <div className="success-reveal w-20 h-20 rounded-full border border-black/10 flex items-center justify-center mb-8 bg-white/20 backdrop-blur-sm shadow-sm">
              <svg
                className="w-8 h-8 text-black"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <h2 className="success-reveal text-[clamp(2.2rem,6vw,4.5rem)] font-serif font-medium leading-none mb-6 text-[#0a0a0a]">
              Merci <span className="italic font-normal">{form.name}</span> !
            </h2>
            <p className="success-reveal text-xs md:text-sm text-black/60 max-w-md uppercase tracking-[0.15em] leading-relaxed mb-12 font-semibold">
              {locale === "fr" 
                ? "Votre demande a bien été reçue. Je reviens vers vous sous 24 à 48 heures pour échanger."
                : "Your request has been received. I will get back to you within 24 to 48 hours."}
            </p>

            <Link
              href="/#hero"
              className="success-reveal group relative inline-block font-sans text-xs md:text-sm text-black pb-2 font-bold uppercase tracking-[0.2em] mt-8 cursor-pointer w-max mx-auto"
            >
              <span className="relative z-10">
                {locale === "fr" ? "Retourner à l'accueil" : "Go back home"}
              </span>
              <span className="absolute bottom-0 left-0 h-px w-full bg-black scale-x-0 origin-right transition-transform duration-300 ease-out group-hover:scale-x-100 group-hover:origin-left" />
            </Link>
          </div>
        ) : (
          /* MAIN FORM SECTION (Style Leeroy - Left Aligned inside Centered Block) */
          <div className="max-w-2xl w-full mx-auto flex flex-col items-start z-10 pt-28 pb-12 text-left">
            
            {/* Centered Heading */}
            <div className="reveal-text mb-20 text-left w-full">
              <h1 className="text-[clamp(2.2rem,5vw,4.5rem)] font-serif leading-tight text-[#0a0a0a] font-normal mb-4">
                {locale === "fr" ? "Bonjour, ravi de vous rencontrer !" : "Hello, nice to meet you!"}
              </h1>
              <p className="text-xs text-black/50 uppercase tracking-[0.25em] font-bold">
                {locale === "fr" ? "Dites-moi tout sur votre projet" : "Tell me everything about your project"}
              </p>
            </div>

            <form className="w-full flex flex-col gap-16" onSubmit={handleSubmit}>
              
              {/* Field 1: Name */}
              <div className="flex flex-col items-start gap-2 w-full reveal-field">
                <label className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-black/50 font-bold transition-colors duration-300 hover:text-black">
                  {locale === "fr" ? "Quel est votre nom ?" : "What's your name?"} *
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder={locale === "fr" ? "Entrez votre nom complet" : "Enter your full name"}
                  className={`bg-transparent border-b ${errors.name ? "border-red-500 focus:border-red-500" : "border-black/15 focus:border-black"} w-full pb-4 outline-none transition-all duration-300 placeholder:text-black/15 text-left text-lg md:text-xl text-[#0a0a0a] font-normal`}
                />
                {errors.name && (
                  <span className="text-red-500 text-[10px] uppercase tracking-wider mt-2 font-semibold text-error">
                    {errors.name}
                  </span>
                )}
              </div>

              {/* Field 2: Email */}
              <div className="flex flex-col items-start gap-2 w-full reveal-field">
                <label className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-black/50 font-bold transition-colors duration-300 hover:text-black">
                  {locale === "fr" ? "Quelle est votre adresse email ?" : "What's your email?"} *
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="e.g. hello@domain.com"
                  className={`bg-transparent border-b ${errors.email ? "border-red-500 focus:border-red-500" : "border-black/15 focus:border-black"} w-full pb-4 outline-none transition-all duration-300 placeholder:text-black/15 text-left text-lg md:text-xl text-[#0a0a0a] font-normal`}
                />
                {errors.email && (
                  <span className="text-red-500 text-[10px] uppercase tracking-wider mt-2 font-semibold text-error">
                    {errors.email}
                  </span>
                )}
              </div>

              {/* Field 3: Phone */}
              <div className="flex flex-col items-start gap-2 w-full reveal-field">
                <label className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-black/50 font-bold transition-colors duration-300 hover:text-black">
                  {locale === "fr" ? "Quel est votre numéro de téléphone ?" : "What's your phone number?"}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="e.g. +33 6 12 34 56 78"
                  className="bg-transparent border-b border-black/15 focus:border-black w-full pb-4 outline-none transition-all duration-300 placeholder:text-black/15 text-left text-lg md:text-xl text-[#0a0a0a] font-normal"
                />
              </div>

              {/* Field 4: Company */}
              <div className="flex flex-col items-start gap-2 w-full reveal-field">
                <label className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-black/50 font-bold transition-colors duration-300 hover:text-black">
                  {locale === "fr" ? "Quel est le nom de votre entreprise ?" : "What's your company name?"}
                </label>
                <input
                  type="text"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  placeholder="e.g. Acme Corp"
                  className="bg-transparent border-b border-black/15 focus:border-black w-full pb-4 outline-none transition-all duration-300 placeholder:text-black/15 text-left text-lg md:text-xl text-[#0a0a0a] font-normal"
                />
              </div>

              {/* Field 5: Current Website */}
              <div className="flex flex-col items-start gap-2 w-full reveal-field">
                <label className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-black/50 font-bold transition-colors duration-300 hover:text-black">
                  {locale === "fr" ? "Quel est votre site web actuel ?" : "What's your current website?"}
                </label>
                <input
                  type="url"
                  name="currentWebsite"
                  value={form.currentWebsite}
                  onChange={handleChange}
                  placeholder="e.g. www.domain.com"
                  className="bg-transparent border-b border-black/15 focus:border-black w-full pb-4 outline-none transition-all duration-300 placeholder:text-black/15 text-left text-lg md:text-xl text-[#0a0a0a] font-normal"
                />
              </div>

              {/* INTERMEDIATE TITLE FOR MESSAGE */}
              <div className="reveal-field my-8 text-left w-full">
                <h2 className="text-[clamp(1.5rem,4vw,2.5rem)] font-serif leading-tight text-[#0a0a0a] font-normal">
                  {locale === "fr"
                    ? "Si votre projet pouvait parler, que dirait-il ?"
                    : "If your project could talk, what would it say?"}
                </h2>
              </div>

              {/* Field 6: Message */}
              <div className="flex flex-col items-start gap-2 w-full reveal-field">
                <label className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-black/50 font-bold transition-colors duration-300 hover:text-black">
                  {locale === "fr" ? "Votre message" : "Your message"} *
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder={
                    locale === "fr"
                      ? "Décrivez votre projet, vos objectifs, vos besoins spécifiques..."
                      : "Describe your project, goals, specific needs..."
                  }
                  className="w-full bg-transparent border-b border-black/15 focus:border-black pb-4 outline-none transition-all duration-300 placeholder:text-black/15 text-left text-base md:text-lg text-[#0a0a0a] font-normal resize-none h-24"
                />
              </div>

              {/* Selection 1: Project Type */}
              <div className="flex flex-col items-start gap-4 w-full reveal-field mt-4">
                <label className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-black/50 font-bold">
                  {locale === "fr" ? "Quel type de site web ?" : "What type of website?"}
                </label>
                <div className="flex flex-wrap justify-start gap-x-8 gap-y-3">
                  {projectTypes.map((type) => {
                    const isActive = form.projectType === type.id;
                    return (
                      <button
                        type="button"
                        key={type.id}
                        onClick={() => handleSelect("projectType", type.id)}
                        className="group relative inline-block py-1 text-base md:text-lg font-medium cursor-pointer transition-colors duration-300 text-left w-max"
                      >
                        <span className={`relative z-10 transition-colors duration-300 ${isActive ? "text-black" : "text-black/45 group-hover:text-black"}`}>
                          {type.label}
                        </span>
                        <span
                          className={`absolute bottom-0 left-0 h-px w-full bg-black transition-transform duration-300 ${
                            isActive
                              ? "scale-x-100 origin-left"
                              : "scale-x-0 origin-right group-hover:scale-x-100 group-hover:origin-left"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selection 2: Budget */}
              <div className="flex flex-col items-start gap-4 w-full reveal-field">
                <label className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-black/50 font-bold">
                  {locale === "fr" ? "Budget estimé" : "Estimated budget"}
                </label>
                <div className="flex flex-wrap justify-start gap-x-8 gap-y-3">
                  {budgets.map((budget) => {
                    const isActive = form.budget === budget.id;
                    return (
                      <button
                        type="button"
                        key={budget.id}
                        onClick={() => handleSelect("budget", budget.id)}
                        className="group relative inline-block py-1 text-base md:text-lg font-medium cursor-pointer transition-colors duration-300 text-left w-max"
                      >
                        <span className={`relative z-10 transition-colors duration-300 ${isActive ? "text-black" : "text-black/45 group-hover:text-black"}`}>
                          {budget.label}
                        </span>
                        <span
                          className={`absolute bottom-0 left-0 h-px w-full bg-black transition-transform duration-300 ${
                            isActive
                              ? "scale-x-100 origin-left"
                              : "scale-x-0 origin-right group-hover:scale-x-100 group-hover:origin-left"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selection 3: Timeline */}
              <div className="flex flex-col items-start gap-4 w-full reveal-field">
                <label className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-black/50 font-bold">
                  {locale === "fr" ? "Délai de réalisation" : "Timeline"}
                </label>
                <div className="flex flex-wrap justify-start gap-x-8 gap-y-3">
                  {timelines.map((time) => {
                    const isActive = form.timeline === time.id;
                    return (
                      <button
                        type="button"
                        key={time.id}
                        onClick={() => handleSelect("timeline", time.id)}
                        className="group relative inline-block py-1 text-base md:text-lg font-medium cursor-pointer transition-colors duration-300 text-left w-max"
                      >
                        <span className={`relative z-10 transition-colors duration-300 ${isActive ? "text-black" : "text-black/45 group-hover:text-black"}`}>
                          {time.label}
                        </span>
                        <span
                          className={`absolute bottom-0 left-0 h-px w-full bg-black transition-transform duration-300 ${
                            isActive
                              ? "scale-x-100 origin-left"
                              : "scale-x-0 origin-right group-hover:scale-x-100 group-hover:origin-left"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* DUAL ACTIONS (Left Aligned) */}
              <div className="flex flex-col sm:flex-row items-center justify-start gap-8 mt-12 w-full reveal-field">
                <button
                  type="submit"
                  className="bg-[#0a0a0a] text-white border border-[#0a0a0a] rounded-sm px-16 py-4.5 text-xs md:text-sm uppercase tracking-[0.25em] font-bold cursor-pointer transition-all duration-300 hover:bg-transparent hover:text-[#0a0a0a] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] scale-100 hover:scale-[1.01] active:scale-[0.99]"
                >
                  {locale === "fr" ? "Envoyer" : "Send"}
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="group relative inline-block py-2 text-base md:text-lg font-medium cursor-pointer text-black/40 hover:text-black transition-colors duration-300"
                >
                  <span className="relative z-10">{locale === "fr" ? "Réinitialiser" : "Reset"}</span>
                  <span className="absolute bottom-0 left-0 h-px w-full bg-black/40 scale-x-0 origin-right transition-transform duration-300 ease-out group-hover:scale-x-100 group-hover:origin-left" />
                </button>
              </div>

            </form>
          </div>
        )}
      </main>
    </>
  );
}
