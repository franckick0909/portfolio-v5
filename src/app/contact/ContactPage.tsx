"use client";
import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function ContactPage() {
  const container = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    gsap.from(".reveal-text", {
      y: 50,
      opacity: 0,
      duration: 1.5,
      stagger: 0.1,
      ease: "power4.out",
      delay: 0.5
    });
  }, { scope: container });

  return (
    <main ref={container} className="min-h-screen bg-[#050505] text-[#f0f0f0] p-8 flex flex-col justify-center relative overflow-hidden">
      
      <header className="fixed top-0 left-0 w-full p-8 flex justify-between items-center z-40 mix-blend-difference text-white">
        <a href="/" className="font-bold text-xl uppercase tracking-widest cursor-pointer">FC.</a>
        <a href="/" className="text-sm uppercase tracking-[0.2em] opacity-70 hover:opacity-100 transition">Retour</a>
      </header>

      <div className="max-w-6xl w-full mx-auto flex flex-col md:flex-row gap-20 items-center z-10 pt-20">
        <div className="flex-1">
          <h1 className="text-[15vw] md:text-[8vw] font-serif leading-[0.8] reveal-text uppercase mb-8">
            Hello.<br />
            <span className="italic font-light opacity-50 text-[10vw] md:text-[5vw]">Bonjour.</span>
          </h1>
          <p className="mt-8 text-sm opacity-50 uppercase tracking-[0.3em] reveal-text">
            On discute de votre projet ?
          </p>
          <div className="mt-12 flex flex-col gap-6 reveal-text">
            <a href="mailto:hello@franckchapelon.com" className="text-3xl lg:text-4xl font-light hover:italic transition-all">hello@franckchapelon.com</a>
            <a href="tel:+33600000000" className="text-xl font-light opacity-50 hover:opacity-100 transition-all">+33 6 00 00 00 00</a>
          </div>
        </div>

        <div className="flex-1 w-full reveal-text max-w-md ml-auto">
          <form className="flex flex-col gap-12 w-full" onSubmit={(e) => e.preventDefault()}>
            <input type="text" placeholder="Nom complet" className="w-full bg-transparent border-b border-zinc-800 pb-4 outline-none focus:border-white transition-colors uppercase tracking-[0.1em] text-xs" />
            <input type="email" placeholder="Email" className="w-full bg-transparent border-b border-zinc-800 pb-4 outline-none focus:border-white transition-colors uppercase tracking-[0.1em] text-xs" />
            <textarea placeholder="Détails du projet" className="w-full h-32 bg-transparent border-b border-zinc-800 pb-4 outline-none focus:border-white transition-colors uppercase tracking-[0.1em] text-xs resize-none"></textarea>
            <button type="submit" className="border border-zinc-700 hover:border-white rounded-full px-8 py-5 uppercase tracking-[0.2em] text-xs hover:bg-white hover:text-black transition-all duration-500 w-full">
              Envoyer la demande
            </button>
          </form>
        </div>
      </div>
      
      {/* Halo de fond subtil */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] rounded-full bg-white blur-[180px] opacity-[0.03] pointer-events-none"></div>

    </main>
  );
}
