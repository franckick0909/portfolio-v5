"use client";

import { useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedTitle from "@/components/AnimatedTitle";

const faqs = [
  { 
    q: "Combien de temps faut-il pour créer un site internet sur-mesure ?", 
    a: "Le délai varie selon la complexité du projet. Un site vitrine peut être réalisé en 3 à 4 semaines, tandis qu'un site e-commerce ou une plateforme sur-mesure nécessitera généralement entre 2 et 3 mois. Nous définissons ensemble un calendrier précis lors de notre premier rendez-vous." 
  },
  { 
    q: "Le référencement (SEO) est-il inclus dans la création du site ?", 
    a: "Oui, tous nos sites sont optimisés dès leur conception pour les moteurs de recherche (SEO technique, structure de base, vitesse de chargement). Pour aller plus loin, nous proposons également des stratégies d'optimisation de contenu mensuelles (SEO sémantique et local)." 
  },
  { 
    q: "Est-il possible de modifier mon site moi-même une fois terminé ?", 
    a: "Absolument. Nous développons nos sites de manière à ce que vous ayez la main sur le contenu (textes, images, nouveaux produits). Une formation complète est incluse à la livraison pour vous rendre 100% autonome." 
  },
  { 
    q: "Proposez-vous des services d'hébergement et de maintenance ?", 
    a: "Oui, nous pouvons héberger votre site sur des serveurs ultra-rapides et sécurisés. Nos contrats de maintenance garantissent des mises à jour régulières, des sauvegardes quotidiennes et une protection optimale contre les failles de sécurité." 
  }
];

export default function FaqSection() {
  const container = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    gsap.fromTo(".faq-item", 
      { opacity: 0, y: 30 },
      {
        opacity: 1, 
        y: 0,
        stagger: 0.15,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        }
      }
    );
  }, { scope: container });

  return (
    <section 
      id="faq" 
      ref={container}
      className="relative w-full pt-8 pb-24 md:pt-16 md:pb-32 bg-background text-foreground z-40"
    >
      <div className="w-full flex flex-col items-center px-6 md:px-16">
        
        {/* FAQ List */}
        <div className="faq-list w-full max-w-7xl flex flex-col gap-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            
            return (
              <div 
                key={index} 
                className="faq-item w-full border-b border-foreground/20 overflow-hidden"
              >
                <button 
                  onClick={() => toggleFaq(index)}
                  className="w-full py-8 flex items-center justify-between text-left cursor-pointer group"
                >
                  <h3 className="text-xl md:text-3xl font-serif pr-8 transition-colors duration-300 group-hover:text-foreground/60">
                    {faq.q}
                  </h3>
                  <div className="relative w-6 h-6 flex-shrink-0 flex items-center justify-center">
                    <div className="absolute w-full h-[2px] bg-foreground transition-transform duration-500" />
                    <div className={'absolute w-[2px] h-full bg-foreground transition-transform duration-500 ' + (isOpen ? 'rotate-90 scale-0' : '')} />
                  </div>
                </button>
                
                <div 
                  className="grid transition-all duration-500 ease-[cubic-bezier(0.87,0,0.13,1)]"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="pb-8 text-foreground/70 text-base md:text-lg leading-relaxed max-w-4xl font-sans">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Contact CTA */}
        <div className="mt-20 flex justify-center w-full">
          <button className="px-10 py-5 bg-foreground text-background font-semibold rounded-full hover:scale-105 transition-transform duration-300 uppercase text-xs md:text-sm tracking-widest cursor-pointer">
            Poser une question
          </button>
        </div>

      </div>
    </section>
  );
}
