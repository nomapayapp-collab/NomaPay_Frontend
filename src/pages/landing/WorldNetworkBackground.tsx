export function WorldNetworkBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <svg
        viewBox="0 0 1000 640"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          <radialGradient id="americaGlow" cx="70%" cy="50%" r="65%">
            <stop offset="0%" stopColor="#7B3BFF" stopOpacity="0.4" />
            <stop offset="45%" stopColor="#12E0D4" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#12E0D4" stopOpacity="0" />
          </radialGradient>
          <pattern id="dotGrid" width="8" height="8" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" fill="#12E0D4" fillOpacity="0.6" />
          </pattern>
          <clipPath id="americasClip">
            <path d="M620,25 L790,15 L820,70 L800,140 L780,190 L765,215 L750,230 L730,255 L718,285 L740,310 L770,340 L810,380 L830,420 L815,470 L790,510 L760,560 L745,600 L740,615 L725,600 L710,560 L695,510 L675,460 L665,410 L660,360 L665,320 L680,290 L698,265 L715,240 L728,215 L700,180 L720,165 L680,150 L650,140 L630,90 Z" />
          </clipPath>
        </defs>

        <rect x="0" y="0" width="1000" height="640" fill="url(#americaGlow)" />
        <rect x="0" y="0" width="1000" height="640" fill="url(#dotGrid)" clipPath="url(#americasClip)" />

        <circle cx="710" cy="100" r="3.2" fill="#12E0D4" fillOpacity="0.95" />
        <circle cx="720" cy="270" r="3.2" fill="#12E0D4" fillOpacity="0.95" />
        <circle cx="790" cy="420" r="3.2" fill="#12E0D4" fillOpacity="0.95" />
        <circle cx="750" cy="520" r="3.2" fill="#12E0D4" fillOpacity="0.95" />

        <path
          d="M 710 100 Q 820 250 790 420"
          fill="none"
          stroke="#FF2E88"
          strokeWidth="2.5"
          strokeOpacity="0.85"
          strokeDasharray="6 10"
          className="animate-dash"
        />
        <path
          d="M 720 270 Q 670 400 750 520"
          fill="none"
          stroke="#7B3BFF"
          strokeWidth="2"
          strokeOpacity="0.7"
          strokeDasharray="5 9"
          className="animate-dash"
        />
      </svg>

      <div className="absolute right-[28%] top-[10%] animate-float">
        <span className="inline-flex items-center rounded-full bg-surface-dark-elevated/90 border border-white/10 px-3 py-1.5 text-xs font-semibold text-text-dark-primary shadow-elevation-sm">
          USD
        </span>
      </div>
      <div className="absolute right-[14%] top-[58%] animate-float [animation-delay:-2s]">
        <span className="inline-flex items-center rounded-full bg-surface-dark-elevated/90 border border-white/10 px-3 py-1.5 text-xs font-semibold text-text-dark-primary shadow-elevation-sm">
          BRL
        </span>
      </div>
      <div className="absolute right-[24%] bottom-[6%] animate-float [animation-delay:-4s]">
        <span className="inline-flex items-center rounded-full bg-surface-dark-elevated/90 border border-white/10 px-3 py-1.5 text-xs font-semibold text-text-dark-primary shadow-elevation-sm">
          ARS
        </span>
      </div>
    </div>
  );
}