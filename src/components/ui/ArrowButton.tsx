"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ArrowButtonProps {
  className?: string;
  onClick?: () => void;
  variant?: "dark" | "light";
}

const ArrowButton = ({ className, onClick, variant = "light" }: ArrowButtonProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] cursor-pointer overflow-hidden",
        variant === "dark" 
          ? "bg-black text-white hover:bg-white hover:text-black" 
          : "bg-white text-black hover:bg-black hover:text-white",
        className
      )}
    >
      {/* Container for the rolling arrows */}
      <div className="relative w-4 h-4 md:w-5 md:h-5 overflow-hidden">
        {/* First Arrow (Leaves top-right) */}
        <div className="absolute inset-0 transform transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-x-[120%] group-hover:-translate-y-[120%]">
          <ArrowIcon />
        </div>
        {/* Second Arrow (Enters from bottom-left with delay) */}
        <div className="absolute inset-0 transform -translate-x-[120%] translate-y-[120%] transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] delay-0 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:delay-[150ms]">
          <ArrowIcon />
        </div>
      </div>
    </div>
  );
};

const ArrowIcon = () => (
  <svg
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full"
  >
    <path
      d="M1 13L13 1M13 1H5M13 1V9"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ArrowButton;
