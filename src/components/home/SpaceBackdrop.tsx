import styles from "./Hero.module.css";

// Deterministic star field so server and client render the same markup.
function stars(count: number, seed: number) {
  let s = seed;
  const rand = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
  return Array.from({ length: count }, () => ({
    x: +(rand() * 1000).toFixed(1),
    y: +(rand() * 700).toFixed(1),
    r: +(rand() * 1.3 + 0.3).toFixed(2),
    o: +(rand() * 0.6 + 0.25).toFixed(2),
  }));
}

const starField = stars(110, 20130);

/** Decorative space scene: stars, a planet's limb and an orbiting satellite. */
export function SpaceBackdrop() {
  return (
    <div className={styles.backdrop} aria-hidden="true">
      <svg className={styles.stars} viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid slice">
        {starField.map((star, i) => (
          <circle key={i} cx={star.x} cy={star.y} r={star.r} fill="#dfe8ff" opacity={star.o} />
        ))}
      </svg>

      <div className={styles.planet} />

      <svg className={styles.satellite} viewBox="0 0 320 200">
        <defs>
          <linearGradient id="sat-body" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f4f6fa" />
            <stop offset="0.5" stopColor="#a9b2c0" />
            <stop offset="1" stopColor="#5d6878" />
          </linearGradient>
          <linearGradient id="sat-panel" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2c4f9e" />
            <stop offset="1" stopColor="#0d1f4a" />
          </linearGradient>
          <pattern id="sat-cells" width="12" height="12" patternUnits="userSpaceOnUse">
            <path d="M12 0H0V12" fill="none" stroke="#7d9be0" strokeOpacity="0.55" strokeWidth="0.8" />
          </pattern>
        </defs>
        <g transform="rotate(-24 160 100)">
          {/* left wing */}
          <rect x="18" y="74" width="96" height="52" fill="url(#sat-panel)" stroke="#c3c9d2" strokeWidth="1.5" />
          <rect x="18" y="74" width="96" height="52" fill="url(#sat-cells)" />
          {/* right wing */}
          <rect x="206" y="74" width="96" height="52" fill="url(#sat-panel)" stroke="#c3c9d2" strokeWidth="1.5" />
          <rect x="206" y="74" width="96" height="52" fill="url(#sat-cells)" />
          {/* booms */}
          <rect x="114" y="97" width="22" height="6" fill="#a9b2c0" />
          <rect x="184" y="97" width="22" height="6" fill="#a9b2c0" />
          {/* body */}
          <rect x="136" y="70" width="48" height="60" rx="3" fill="url(#sat-body)" stroke="#4d5767" strokeWidth="1" />
          <rect x="142" y="78" width="36" height="8" fill="#5d6878" opacity="0.6" />
          <rect x="142" y="114" width="36" height="8" fill="#5d6878" opacity="0.6" />
          {/* antenna dish */}
          <line x1="160" y1="70" x2="160" y2="54" stroke="#c3c9d2" strokeWidth="2" />
          <path d="M140 54 Q160 34 180 54 Z" fill="url(#sat-body)" stroke="#4d5767" strokeWidth="1" />
          <circle cx="160" cy="44" r="2.5" fill="#ffffff" />
        </g>
      </svg>

      <svg className={styles.blueprint} viewBox="0 0 200 200">
        <g fill="none" stroke="#9fb4d9" strokeOpacity="0.35" strokeWidth="0.8">
          <circle cx="100" cy="100" r="60" />
          <circle cx="100" cy="100" r="34" />
          <path d="M100 20V180M20 100H180" />
          <path d="M100 30v-10M100 180v-10" strokeOpacity="0.7" />
        </g>
      </svg>
    </div>
  );
}
