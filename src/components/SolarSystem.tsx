import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Code2, Github, Linkedin, Mail, Moon, Sun, Swords } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Tokens (mirrors --portfolio-* CSS vars)                                   */
/* -------------------------------------------------------------------------- */

const C = {
  bg: "var(--portfolio-bg)",
  border: "var(--portfolio-border)",
  text: "var(--portfolio-text)",
  muted: "var(--portfolio-muted)",
  accent: "var(--portfolio-accent)",
  panelAlt: "var(--portfolio-panel-alt)",
  panel: "var(--portfolio-panel)",
};

const mono = { fontFamily: "'JetBrains Mono', ui-monospace, monospace" };

/* -------------------------------------------------------------------------- */
/*  Planet config                                                              */
/* -------------------------------------------------------------------------- */

interface Planet {
  id: string;
  label: string;
  orbitR: number;   // desktop orbit radius px
  period: number;   // seconds per revolution
  startDeg: number; // starting angle
}

const PLANETS: Planet[] = [
  { id: "projects", label: "Projects", orbitR: 180, period: 40, startDeg: 0 },
  { id: "blogs",    label: "Blogs",    orbitR: 240, period: 60, startDeg: 80 },
  { id: "social",   label: "Social",   orbitR: 300, period: 80, startDeg: 160 },
  { id: "contact",  label: "Contact",  orbitR: 360, period: 100, startDeg: 250 },
];

const SUN_D  = { desktop: 140, mobile: 96 };
const PLT_D  = { desktop: 48,  mobile: 36 };

/* -------------------------------------------------------------------------- */
/*  Hooks                                                                      */
/* -------------------------------------------------------------------------- */

function usePrefersReducedMotion() {
  const [v, setV] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setV(mq.matches);
    const h = () => setV(mq.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return v;
}

function useIsMobile() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setM(mq.matches);
    const h = () => setM(mq.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return m;
}

/* -------------------------------------------------------------------------- */
/*  ThemeToggle (with localStorage)                                           */
/* -------------------------------------------------------------------------- */

function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = localStorage.getItem("portfolio-theme");
    const isDark =
      saved === "dark" ||
      (!saved && document.documentElement.classList.contains("dark"));
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggle = () => {
    const isDark = document.documentElement.classList.contains("dark");
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("portfolio-theme", "light");
      setTheme("light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("portfolio-theme", "dark");
      setTheme("dark");
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      style={{
        width: 36,
        height: 36,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 4,
        border: `1px solid ${C.border}`,
        background: "transparent",
        color: C.muted,
        cursor: "pointer",
        transition: "color 150ms ease, border-color 150ms ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = C.accent)}
      onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
    >
      {theme === "light" ? <Moon size={14} /> : <Sun size={14} />}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Tooltip                                                                    */
/* -------------------------------------------------------------------------- */

interface TooltipState {
  id: string;
  label: string;
  x: number;
  y: number;
}

function PlanetTooltip({ tip }: { tip: TooltipState }) {
  return (
    <div
      style={{
        position: "absolute",
        left: tip.x + 32,
        top: tip.y - 20,
        backgroundColor: C.panel,
        border: `1px solid ${C.border}`,
        borderRadius: 6,
        padding: "8px 12px",
        pointerEvents: "none",
        zIndex: 10,
        ...mono,
        fontSize: 12,
        color: C.text,
        whiteSpace: "nowrap",
        boxShadow: "0 4px 20px rgba(43,38,33,0.08)",
      }}
    >
      <span style={{ color: C.accent }}>{tip.label}</span>
      <span style={{ color: C.muted }}> — coming soon</span>
    </div>
  );
}

function SunTooltip({ x, y }: { x: number; y: number }) {
  return (
    <div
      style={{
        position: "absolute",
        left: x + 80,
        top: y - 16,
        backgroundColor: C.panel,
        border: `1px solid ${C.border}`,
        borderRadius: 6,
        padding: "8px 12px",
        pointerEvents: "none",
        zIndex: 10,
        ...mono,
        fontSize: 12,
        color: C.text,
        whiteSpace: "nowrap",
        boxShadow: "0 4px 20px rgba(43,38,33,0.08)",
      }}
    >
      <span style={{ color: C.muted }}>enter </span>
      <span style={{ color: C.accent }}>portfolio →</span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Desktop: Orbiting solar system                                            */
/* -------------------------------------------------------------------------- */

function DesktopSystem({ reduced }: { reduced: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const planetRefs = useRef<(HTMLDivElement | null)[]>([]);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const anglesRef = useRef(PLANETS.map((p) => (p.startDeg * Math.PI) / 180));
  const pausedRef = useRef<boolean[]>(PLANETS.map(() => false));
  const speedRef = useRef<number[]>(PLANETS.map(() => 1)); // multiplier 0..1
  const rafRef = useRef<number>(0);

  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [sunHovered, setSunHovered] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // raf animation loop
  useEffect(() => {
    if (reduced) return;

    const animate = () => {
      const container = containerRef.current;
      if (!container) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }
      const cx = container.offsetWidth / 2;
      const cy = container.offsetHeight / 2;

      PLANETS.forEach((planet, i) => {
        // smoothly ease speed multiplier
        const targetSpeed = pausedRef.current[i] ? 0 : 1;
        speedRef.current[i] += (targetSpeed - speedRef.current[i]) * 0.06;

        const degPerFrame = (360 / (planet.period * 60)) * speedRef.current[i];
        anglesRef.current[i] += (degPerFrame * Math.PI) / 180;

        const pR = PLT_D.desktop / 2;
        const x = cx + Math.cos(anglesRef.current[i]) * planet.orbitR - pR;
        const y = cy + Math.sin(anglesRef.current[i]) * planet.orbitR - pR;

        const el = planetRefs.current[i];
        if (el) {
          el.style.left = `${x}px`;
          el.style.top = `${y}px`;
        }
        const lbl = labelRefs.current[i];
        if (lbl) {
          lbl.style.left = `${cx + Math.cos(anglesRef.current[i]) * planet.orbitR}px`;
          lbl.style.top = `${cy + Math.sin(anglesRef.current[i]) * planet.orbitR + pR + 8}px`;
        }
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [reduced]);

  // Initial static position for reduced motion
  useEffect(() => {
    if (!reduced) return;
    const container = containerRef.current;
    if (!container) return;
    const cx = container.offsetWidth / 2;
    const cy = container.offsetHeight / 2;
    PLANETS.forEach((planet, i) => {
      const pR = PLT_D.desktop / 2;
      const x = cx + Math.cos(anglesRef.current[i]) * planet.orbitR - pR;
      const y = cy + Math.sin(anglesRef.current[i]) * planet.orbitR - pR;
      const el = planetRefs.current[i];
      if (el) { el.style.left = `${x}px`; el.style.top = `${y}px`; }
      const lbl = labelRefs.current[i];
      if (lbl) {
        lbl.style.left = `${cx + Math.cos(anglesRef.current[i]) * planet.orbitR}px`;
        lbl.style.top = `${cy + Math.sin(anglesRef.current[i]) * planet.orbitR + pR + 8}px`;
      }
    });
  }, [reduced]);

  const sunD = SUN_D.desktop;
  const sunR = sunD / 2;

  const handlePlanetEnter = (i: number) => {
    pausedRef.current[i] = true;
    setHoveredIdx(i);
    const container = containerRef.current;
    if (!container) return;
    const cx = container.offsetWidth / 2;
    const cy = container.offsetHeight / 2;
    const planet = PLANETS[i];
    const x = cx + Math.cos(anglesRef.current[i]) * planet.orbitR;
    const y = cy + Math.sin(anglesRef.current[i]) * planet.orbitR;
    if (planet.id !== "social" && planet.id !== "contact") {
      setTooltip({ id: planet.id, label: planet.label, x, y });
    }
  };

  const handlePlanetLeave = (i: number) => {
    pausedRef.current[i] = false;
    setHoveredIdx(null);
    setTooltip(null);
  };

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* Orbit rings */}
      {PLANETS.map((planet) => (
        <div
          key={`ring-${planet.id}`}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: planet.orbitR * 2,
            height: planet.orbitR * 2,
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            border: `1.5px solid #B8AC9A`,
            opacity: 0.65,
            pointerEvents: "none",
          }}
        />
      ))}

      {/* Sun glow */}
      <div
        className={reduced ? "" : "solar-sun-glow"}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: sunD * 4,
          height: sunD * 4,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background: `radial-gradient(circle, var(--portfolio-accent) 0%, transparent 70%)`,
          opacity: 0.18,
          pointerEvents: "none",
        }}
      />

      {/* Sun */}
      <Link
        to="/portfolio"
        aria-label="Enter portfolio"
        className={reduced ? "" : "solar-sun-pulse"}
        onMouseEnter={() => setSunHovered(true)}
        onMouseLeave={() => setSunHovered(false)}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: sunD,
          height: sunD,
          transform: `translate(-50%, -50%)${sunHovered && !reduced ? " scale(1.1)" : ""}`,
          borderRadius: "50%",
          backgroundColor: C.accent,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 5,
          transition: reduced ? "none" : "transform 200ms ease",
          textDecoration: "none",
        }}
      >
        <span style={{ ...mono, color: C.bg, fontSize: 11, fontWeight: 600, letterSpacing: "0.06em" }}>
          shri
        </span>
      </Link>
      {sunHovered && (
        <SunTooltip
          x={containerRef.current ? containerRef.current.offsetWidth / 2 + sunR : 0}
          y={containerRef.current ? containerRef.current.offsetHeight / 2 : 0}
        />
      )}

      {/* Planets */}
      {PLANETS.map((planet, i) => {
        const isHovered = hoveredIdx === i;
        const isDimmed = hoveredIdx !== null && hoveredIdx !== i;
        return (
          <div
            key={planet.id}
            ref={(el) => { planetRefs.current[i] = el; }}
            role="button"
            tabIndex={0}
            aria-label={`${planet.label} — coming soon`}
            onMouseEnter={() => handlePlanetEnter(i)}
            onMouseLeave={() => handlePlanetLeave(i)}
            onFocus={() => handlePlanetEnter(i)}
            onBlur={() => handlePlanetLeave(i)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") e.preventDefault();
            }}
            style={{
              position: "absolute",
              width: PLT_D.desktop,
              height: PLT_D.desktop,
              borderRadius: "50%",
              backgroundColor: C.panelAlt,
              border: `1.5px solid ${C.border}`,
              cursor: (planet.id === "social" || planet.id === "contact") && isHovered ? "auto" : "default",
              zIndex: 4,
              opacity: isDimmed ? 0.4 : 1,
              transform: isHovered && !reduced ? "scale(1.2)" : "scale(1)",
              transition: reduced ? "none" : "opacity 200ms ease, transform 200ms ease, border-color 200ms ease",
              borderColor: isHovered ? C.accent : C.border,
            }}
          >
            {planet.id === "social" && isHovered && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  display: "flex",
                  gap: 12,
                  padding: "8px 16px",
                  backgroundColor: C.panelAlt,
                  borderRadius: 24,
                  border: `1.5px solid ${C.accent}`,
                  zIndex: 10,
                  boxShadow: "0 4px 20px rgba(43,38,33,0.08)",
                }}
              >
                {[
                  { icon: Github,   href: "https://github.com/SSHRIHARI006", label: "GitHub" },
                  { icon: Linkedin, href: "https://www.linkedin.com/in/shriharitelang06/", label: "LinkedIn" },
                  { icon: Code2,    href: "https://leetcode.com/u/Shrihari06", label: "LeetCode" },
                  { icon: Swords,   href: "https://codeforces.com/profile/shriharitelang06", label: "Codeforces" },
                  { icon: Mail,     href: "mailto:shriharitelang06@gmail.com", label: "Email" },
                ].map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={label}
                    style={{
                      width: 28,
                      height: 28,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: C.muted,
                      transition: "color 150ms ease",
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = C.accent)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            )}
            {planet.id === "contact" && isHovered && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  display: "flex",
                  gap: 12,
                  padding: "8px 16px",
                  backgroundColor: C.panelAlt,
                  borderRadius: 24,
                  border: `1.5px solid ${C.accent}`,
                  zIndex: 10,
                  boxShadow: "0 4px 20px rgba(43,38,33,0.08)",
                }}
              >
                {[
                  { icon: Mail, href: "mailto:shriharitelang06@gmail.com", label: "Email" },
                ].map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={label}
                    style={{
                      width: 28,
                      height: 28,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: C.muted,
                      transition: "color 150ms ease",
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = C.accent)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Planet labels */}
      {PLANETS.map((planet, i) => {
        const isDimmed = hoveredIdx !== null && hoveredIdx !== i;
        return (
          <div
            key={`lbl-${planet.id}`}
            ref={(el) => { labelRefs.current[i] = el; }}
            style={{
              position: "absolute",
              ...mono,
              fontSize: 11,
              color: hoveredIdx === i ? C.accent : C.muted,
              transform: "translateX(-50%)",
              pointerEvents: "none",
              opacity: isDimmed ? 0.4 : 1,
              transition: reduced ? "none" : "color 200ms ease, opacity 200ms ease",
              userSelect: "none",
              whiteSpace: "nowrap",
            }}
          >
            {planet.label}
          </div>
        );
      })}

      {/* Tooltip */}
      {tooltip && <PlanetTooltip tip={tooltip} />}

      {/* enter portfolio link (redundant CTA near center) */}
      <Link
        to="/portfolio"
        style={{
          position: "absolute",
          bottom: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          ...mono,
          fontSize: 12,
          color: C.muted,
          textDecoration: "none",
          borderBottom: `1px solid ${C.border}`,
          paddingBottom: 2,
          transition: "color 150ms ease",
          whiteSpace: "nowrap",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = C.accent)}
        onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
      >
        enter portfolio →
      </Link>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Mobile: vertical stack                                                     */
/* -------------------------------------------------------------------------- */

function MobileSystem() {
  const sunD = SUN_D.mobile;
  const pltD = PLT_D.mobile;
  const [tapped, setTapped] = useState<string | null>(null);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
        height: "100%",
        padding: "20px 0",
      }}
    >
      {/* Sun */}
      <Link
        to="/portfolio"
        aria-label="Enter portfolio"
        style={{
          width: sunD,
          height: sunD,
          borderRadius: "50%",
          backgroundColor: C.accent,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textDecoration: "none",
          flexShrink: 0,
          boxShadow: `0 0 ${sunD * 1.5}px 0 var(--portfolio-accent)`,
        }}
      >
        <span style={{ ...mono, color: C.bg, fontSize: 11, fontWeight: 600 }}>shri</span>
      </Link>

      {/* connector line */}
      <div style={{ width: 1, height: 24, backgroundColor: C.border, opacity: 0.5 }} />

      {/* enter portfolio text */}
      <Link
        to="/portfolio"
        style={{ ...mono, fontSize: 11, color: C.muted, textDecoration: "none", marginBottom: 16 }}
      >
        enter portfolio →
      </Link>

      {/* Planets */}
      {PLANETS.map((planet, i) => (
        <div
          key={planet.id}
          style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
        >
          {i > 0 && (
            <div style={{ width: 1, height: 20, backgroundColor: C.border, opacity: 0.4 }} />
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              role="button"
              tabIndex={0}
              aria-label={`${planet.label} — coming soon`}
              onClick={() => setTapped(tapped === planet.id ? null : planet.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setTapped(tapped === planet.id ? null : planet.id);
                }
              }}
              style={{
                width: pltD,
                height: pltD,
                borderRadius: "50%",
                backgroundColor: C.panelAlt,
                border: `1.5px solid ${tapped === planet.id ? C.accent : C.border}`,
                cursor: "default",
                flexShrink: 0,
              }}
            />
            <span style={{ ...mono, fontSize: 12, color: tapped === planet.id ? C.accent : C.muted }}>
              {planet.label}
            </span>
            {tapped === planet.id && planet.id !== "social" && planet.id !== "contact" && (
              <span style={{ ...mono, fontSize: 11, color: C.muted }}>— coming soon</span>
            )}
            {tapped === planet.id && planet.id === "social" && (
              <div style={{ display: "flex", gap: 12, marginLeft: 8 }}>
                {[
                  { icon: Github,   href: "https://github.com/SSHRIHARI006", label: "GitHub" },
                  { icon: Linkedin, href: "https://www.linkedin.com/in/shriharitelang06/", label: "LinkedIn" },
                  { icon: Code2,    href: "https://leetcode.com/u/Shrihari06", label: "LeetCode" },
                  { icon: Swords,   href: "https://codeforces.com/profile/shriharitelang06", label: "Codeforces" },
                  { icon: Mail,     href: "mailto:shriharitelang06@gmail.com", label: "Email" },
                ].map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={label}
                    style={{ color: C.muted, textDecoration: "none" }}
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            )}
            {tapped === planet.id && planet.id === "contact" && (
              <div style={{ display: "flex", gap: 12, marginLeft: 8 }}>
                {[
                  { icon: Mail, href: "mailto:shriharitelang06@gmail.com", label: "Email" },
                ].map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={label}
                    style={{ color: C.muted, textDecoration: "none" }}
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Root                                                                       */
/* -------------------------------------------------------------------------- */

export default function SolarSystem() {
  const reduced = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  return (
    <div
      style={{
        width: "100vw",
        height: "100dvh",
        overflow: "hidden",
        backgroundColor: C.bg,
        position: "relative",
        transition: "background-color 150ms ease",
      }}
    >
      {/* Minimal nav */}
      <nav
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 24px",
          zIndex: 20,
        }}
      >
        <span style={{ ...mono, color: C.text, fontSize: 14, fontWeight: 700 }}>
          shri.dev
          <span style={{ color: C.accent }}>_</span>
        </span>
        <ThemeToggle />
      </nav>

      {/* Main canvas */}
      {isMobile ? (
        <MobileSystem />
      ) : (
        <DesktopSystem reduced={reduced} />
      )}
    </div>
  );
}
