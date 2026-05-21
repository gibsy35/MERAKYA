import React from 'react';

interface SpiritualLogoProps {
  className?: string;
  size?: number;
}

export default function SpiritualLogo({ className = "h-12 w-12", size = 48 }: SpiritualLogoProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full transition-all duration-700 hover:rotate-12"
        fill="none" 
        stroke="currentColor" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer dotted celestial ring */}
        <circle 
          cx="50" 
          cy="50" 
          r="48" 
          strokeWidth="0.5" 
          strokeDasharray="1.5 1.5" 
          stroke="currentColor"
          strokeOpacity="0.4"
        />
        
        {/* Outer solid golden halo rings */}
        <circle 
          cx="50" 
          cy="50" 
          r="44" 
          strokeWidth="0.75" 
          stroke="currentColor"
        />
        <circle 
          cx="50" 
          cy="50" 
          r="42" 
          strokeWidth="0.5" 
          stroke="currentColor"
          strokeOpacity="0.5"
        />

        {/* Mid-range celestial alignment rings */}
        <circle 
          cx="50" 
          cy="50" 
          r="36" 
          strokeWidth="0.5" 
          strokeDasharray="3 2" 
          stroke="currentColor"
          strokeOpacity="0.6"
        />
        <circle 
          cx="50" 
          cy="50" 
          r="28" 
          strokeWidth="0.5" 
          stroke="currentColor"
          strokeOpacity="0.4"
        />

        {/* Central Triangle: centered equilateral pointing upwards */}
        <polygon 
          points="50,20.5 75.5,64.7 24.5,64.7" 
          strokeWidth="1" 
          stroke="currentColor"
        />

        {/* Central Circle inside the triangle */}
        <circle 
          cx="50" 
          cy="50" 
          r="11" 
          strokeWidth="0.75" 
          stroke="currentColor"
          fill="none"
        />

        {/* The elegant serif letter M at the exact heart of the alchemical seal */}
        <text 
          x="50" 
          y="55" 
          fontFamily="'Georgia', 'Times New Roman', serif" 
          fontSize="14" 
          fontWeight="normal" 
          textAnchor="middle" 
          fill="currentColor"
        >
          M
        </text>

        {/* Alchemical axes intersecting through the center */}
        <line x1="16.5" y1="50" x2="83.5" y2="50" strokeWidth="0.5" stroke="currentColor" strokeOpacity="0.5" />
        <line x1="50" y1="16.5" x2="50" y2="83.5" strokeWidth="0.5" stroke="currentColor" strokeOpacity="0.5" />

        {/* Small celestial alignment circles with starry centers at cardinal points */}
        {/* Left card node */}
        <circle cx="12" cy="50" r="4.5" strokeWidth="0.75" stroke="currentColor" />
        <path d="M12 47.5 L12 52.5 M9.5 50 L14.5 50" strokeWidth="0.5" stroke="currentColor" />
        <path d="M10.5 48.5 L13.5 51.5 M10.5 51.5 L13.5 48.5" strokeWidth="0.5" stroke="currentColor" strokeOpacity="0.6" />

        {/* Right card node */}
        <circle cx="88" cy="50" r="4.5" strokeWidth="0.75" stroke="currentColor" />
        <path d="M88 47.5 L88 52.5 M85.5 50 L90.5 50" strokeWidth="0.5" stroke="currentColor" />
        <path d="M86.5 48.5 L89.5 51.5 M86.5 51.5 L89.5 48.5" strokeWidth="0.5" stroke="currentColor" strokeOpacity="0.6" />

        {/* Top card node */}
        <circle cx="50" cy="12" r="4.5" strokeWidth="0.75" stroke="currentColor" />
        <path d="M50 9.5 L50 14.5 M47.5 12 L52.5 12" strokeWidth="0.5" stroke="currentColor" />
        <path d="M48.5 10.5 L51.5 13.5 M48.5 13.5 L51.5 10.5" strokeWidth="0.5" stroke="currentColor" strokeOpacity="0.6" />

        {/* Bottom card node */}
        <circle cx="50" cy="88" r="4.5" strokeWidth="0.75" stroke="currentColor" />
        <path d="M50 85.5 L50 90.5 M47.5 88 L52.5 88" strokeWidth="0.5" stroke="currentColor" />
        <path d="M48.5 86.5 L51.5 89.5 M48.5 89.5 L51.5 86.5" strokeWidth="0.5" stroke="currentColor" strokeOpacity="0.6" />

        {/* Small diagonal sparkles at 45 degree points along mid circle */}
        <path d="M24.5 22.5 L24.5 26.5 M22.5 24.5 L26.5 24.5" strokeWidth="0.5" stroke="currentColor" strokeOpacity="0.8" />
        <path d="M75.5 22.5 L75.5 26.5 M73.5 24.5 L77.5 24.5" strokeWidth="0.5" stroke="currentColor" strokeOpacity="0.8" />
        <path d="M24.5 73.5 L24.5 77.5 M22.5 75.5 L26.5 75.5" strokeWidth="0.5" stroke="currentColor" strokeOpacity="0.8" />
        <path d="M75.5 73.5 L75.5 77.5 M73.5 75.5 L77.5 75.5" strokeWidth="0.5" stroke="currentColor" strokeOpacity="0.8" />

        {/* Dot symbol representing the Sun, placed inside the top apex of the triangle */}
        <circle cx="50" cy="31.5" r="2.5" strokeWidth="0.5" stroke="currentColor" />
        <circle cx="50" cy="31.5" r="0.75" fill="currentColor" />
      </svg>
    </div>
  );
}
