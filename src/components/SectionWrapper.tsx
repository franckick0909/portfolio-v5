"use client";
import { ReactNode } from "react";

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  /** Si vrai, retire les paddings horizontaux par défaut */
  noPadding?: boolean;
}

/**
 * Wrapper réutilisable pour garantir des marges horizontales cohérentes
 * et une largeur maximale sur tout le portfolio.
 */
export default function SectionWrapper({
  children,
  className = "",
  noPadding = false,
}: SectionWrapperProps) {
  return (
    <div
      className={`
        w-full 
        max-w-[1920px] 
        mx-auto
        overflow-hidden
        ${noPadding ? "" : "px-2 md:px-4 lg:px-6"} 
        ${className}
      `}
    >
      {children}
    </div>
  );
}
