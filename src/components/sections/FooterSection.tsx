"use client";

import { useI18n } from "@/lib/i18n";

const SOCIALS = [
  { name: "LINKEDIN", url: "https://www.linkedin.com/in/franck-chapelon/" },
  { name: "GITHUB", url: "https://github.com/franck-chapelon" },
  { name: "INSTAGRAM", url: "https://www.instagram.com/franck.chapelon/" },
  { name: "MALT", url: "https://www.malt.fr/profile/franckchapelon" },
] as const;

const NAV_LINKS = [
  { label: "ABOUT ME", href: "#about" },
  { label: "WORKS", href: "#works" },
  { label: "SERVICES", href: "#" },
];

/**
 * FooterSection — Olha-style: reverse to light bg, giant name, socials, contact
 */
export default function FooterSection() {
  const { t } = useI18n();

  return (
    <footer
      id="footer"
      className="relative w-full px-8 md:px-12 pt-32 pb-8"
    >
      {/* Contact info — right aligned, large */}
      <div className="flex flex-col items-end mb-16">
        <a
          href="mailto:contact@franckchapelon.com"
          className="text-[4vw] md:text-[3vw] font-serif hover:italic transition-all duration-300 underline-offset-8 decoration-1 hover:underline"
        >
          contact@franckchapelon.com
        </a>
      </div>

      {/* Social links row — with brackets */}
      <div className="flex flex-wrap justify-end gap-6 md:gap-10 mb-20">
        {SOCIALS.map((social) => (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="section-indicator hover:opacity-100 opacity-60 transition-opacity underline underline-offset-4 decoration-1"
          >
            {social.name} ↗
          </a>
        ))}
      </div>

      {/* Nav + Address row */}
      <div className="flex flex-col md:flex-row justify-between gap-12 mb-20">
        {/* Left — Nav links */}
        <div className="flex flex-col gap-2">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="section-indicator opacity-60 hover:opacity-100 transition-opacity"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right — Address */}
        <div className="flex flex-col items-end text-right">
          <span className="section-indicator opacity-50 mb-1">Adresse:</span>
          <span className="section-indicator opacity-70">Dordogne</span>
          <span className="section-indicator opacity-70">Aquitaine, France</span>
        </div>
      </div>

      {/* Social links — bottom row with brackets */}
      <div className="flex flex-wrap gap-8 md:gap-16 mb-12">
        {["DRIBBBLE", "BEHANCE", "LINKEDIN"].map((name) => (
          <span key={name} className="section-indicator opacity-40">
            [ {name} ]
          </span>
        ))}
      </div>

      {/* Giant name */}
      <div className="w-full overflow-hidden mb-8">
        <h2 className="font-anton text-[15vw] md:text-[13vw] uppercase leading-[0.85] tracking-tighter">
          FRANCK CHAPELON
        </h2>
      </div>

      {/* Bottom bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-6 border-t border-current/10">
        <span className="section-indicator opacity-50">
          DORDOGNE, FRANCE · (GMT+1)
        </span>
        <span className="section-indicator opacity-50">
          DÉVELOPPEMENT — FC
        </span>
        <span className="section-indicator opacity-40 text-right">
          © 2026 {t.footerRights}
        </span>
      </div>
    </footer>
  );
}
