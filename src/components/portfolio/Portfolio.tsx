import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  Boxes,
  Brain,
  Database,
  Github,
  Linkedin,
  Mail,
  Menu,
  Server,
  Target,
  Terminal,
  Trophy,
  X,
  Sun,
  Moon,
  type LucideIcon,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Tokens (inline for clarity — mirror src/styles.css tokens)                */
/* -------------------------------------------------------------------------- */

const C = {
  bg: "var(--portfolio-bg)",
  panel: "var(--portfolio-panel)",
  panelAlt: "var(--portfolio-panel-alt)",
  border: "var(--portfolio-border)",
  text: "var(--portfolio-text)",
  muted: "var(--portfolio-muted)",
  accent: "var(--portfolio-accent)",
  warm: "var(--portfolio-warm)",
  red: "var(--portfolio-red)",
};

const mono = { fontFamily: "'JetBrains Mono', ui-monospace, monospace" };
const body = { fontFamily: "'IBM Plex Mono', ui-monospace, monospace" };

/* -------------------------------------------------------------------------- */
/*  Small reusable pieces                                                     */
/* -------------------------------------------------------------------------- */

function StatusDot({
  color = C.accent,
  pulse = false,
  size = 8,
}: {
  color?: string;
  pulse?: boolean;
  size?: number;
}) {
  return (
    <span
      aria-hidden
      className={pulse ? "shri-pulse" : ""}
      style={{
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: 999,
        backgroundColor: color,
        flexShrink: 0,
      }}
    />
  );
}

function SectionLabel({ id, name }: { id: string; name: string }) {
  return (
    <div id={id} className="flex items-center gap-3 pt-2">
      <span
        aria-hidden
        style={{ width: 10, height: 10, backgroundColor: C.accent, display: "inline-block" }}
      />
      <h2
        style={{ ...mono, color: C.text, fontSize: 20, fontWeight: 600, letterSpacing: "-0.01em" }}
      >
        {name}
      </h2>
      <span
        aria-hidden
        style={{ flex: 1, height: 1, backgroundColor: C.border }}
      />
    </div>
  );
}

function TerminalPanel({
  prompt,
  children,
  padded = true,
}: {
  prompt: string;
  children: React.ReactNode;
  padded?: boolean;
}) {
  return (
    <section
      style={{
        backgroundColor: C.panel,
        border: `1px solid ${C.border}`,
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      <header
        className="flex items-center gap-3 px-4 py-2.5"
        style={{ borderBottom: `1px solid ${C.border}`, backgroundColor: C.panelAlt }}
      >
        <div className="flex items-center gap-1.5">
          <span
            aria-hidden
            style={{ width: 10, height: 10, borderRadius: 999, backgroundColor: C.red, opacity: 0.6 }}
          />
          <span
            aria-hidden
            style={{ width: 10, height: 10, borderRadius: 999, backgroundColor: C.warm, opacity: 0.6 }}
          />
          <span
            aria-hidden
            style={{ width: 10, height: 10, borderRadius: 999, backgroundColor: C.accent, opacity: 0.6 }}
          />
        </div>
        <span style={{ ...mono, color: C.muted, fontSize: 12 }}>{prompt}</span>
      </header>
      <div style={padded ? { padding: 24 } : {}}>{children}</div>
    </section>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        ...mono,
        fontSize: 11,
        color: C.muted,
        backgroundColor: C.panelAlt,
        border: `1px solid ${C.border}`,
        padding: "3px 8px",
        borderRadius: 6,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Uptime hook                                                               */
/* -------------------------------------------------------------------------- */

function useUptime() {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - start) / 1000)), 1000);
    return () => clearInterval(id);
  }, []);
  const h = String(Math.floor(elapsed / 3600)).padStart(2, "0");
  const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, "0");
  const s = String(elapsed % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

/* -------------------------------------------------------------------------- */
/*  Nav                                                                       */
/* -------------------------------------------------------------------------- */

const NAV = [
  { href: "#about", label: "./about" },
  { href: "#stack", label: "./stack" },
  { href: "#projects", label: "./projects" },
  { href: "#log", label: "./log" },
  { href: "#stats", label: "./stats" },
  { href: "#contact", label: "./contact" },
];

function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains("dark");
    if (isDark) {
      document.documentElement.classList.remove("dark");
      setTheme("light");
    } else {
      document.documentElement.classList.add("dark");
      setTheme("dark");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex h-8 w-8 items-center justify-center rounded-sm transition-colors"
      style={{ color: C.muted, border: `1px solid ${C.border}` }}
      aria-label="Toggle theme"
      onMouseEnter={(e) => (e.currentTarget.style.color = C.accent)}
      onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
    >
      {theme === "light" ? <Moon size={14} /> : <Sun size={14} />}
    </button>
  );
}

function Nav() {
  const uptime = useUptime();
  const [open, setOpen] = useState(false);
  return (
    <nav
      className="fixed inset-x-0 top-0 z-40 backdrop-blur"
      style={{
        backgroundColor: "var(--portfolio-nav-bg)",
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      <div className="mx-auto flex max-w-5xl items-center gap-4 px-5 py-3 md:px-8">
        <a href="#top" className="flex items-center gap-2 min-w-0">
          <Terminal size={16} color={C.accent} />
          <span style={{ ...mono, color: C.text, fontSize: 13, fontWeight: 600 }}>
            shri@iiitn
          </span>
          <span
            className="shri-caret"
            style={{ ...mono, color: C.accent, fontSize: 13, marginLeft: -2 }}
          >
            _
          </span>
        </a>

        <div className="ml-auto hidden items-center gap-5 md:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              style={{ ...mono, color: C.muted, fontSize: 12 }}
              className="transition-colors hover:!text-[color:var(--nav-hover)]"
              onMouseEnter={(e) => (e.currentTarget.style.color = C.accent)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
            >
              {n.label}
            </a>
          ))}
          <div
            className="flex items-center gap-2 pl-4"
            style={{ borderLeft: `1px solid ${C.border}` }}
          >
            <StatusDot pulse />
            <span style={{ ...mono, color: C.muted, fontSize: 12 }}>
              uptime <span style={{ color: C.text }}>{uptime}</span>
            </span>
          </div>
          <ThemeToggle />
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="ml-auto md:hidden"
          style={{
            width: 44,
            height: 44,
            display: "grid",
            placeItems: "center",
            color: C.text,
          }}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div
          className="md:hidden"
          style={{
            borderTop: `1px solid ${C.border}`,
            backgroundColor: C.bg,
          }}
        >
          <ul className="mx-auto flex max-w-5xl flex-col px-5 py-2">
            {NAV.map((n) => (
              <li key={n.href}>
                <a
                  href={n.href}
                  onClick={() => setOpen(false)}
                  style={{
                    ...mono,
                    color: C.text,
                    fontSize: 14,
                    display: "flex",
                    alignItems: "center",
                    minHeight: 44,
                  }}
                >
                  {n.label}
                </a>
              </li>
            ))}
            <li className="mt-2 flex items-center justify-between pt-3" style={{ borderTop: `1px solid ${C.border}` }}>
              <span style={{ ...mono, color: C.muted, fontSize: 14 }}>theme</span>
              <ThemeToggle />
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}

/* -------------------------------------------------------------------------- */
/*  Hero                                                                      */
/* -------------------------------------------------------------------------- */

/* Topology graph — see project data below Hero */

/* -------------------------------------------------------------------------- */
/*  About                                                                     */
/* -------------------------------------------------------------------------- */

function About() {
  return (
    <div className="flex flex-col gap-6">
      <SectionLabel id="about" name="about" />
      <TerminalPanel prompt="~/about $ cat about.md">
        <div style={{ ...body, color: C.text, fontSize: 15, lineHeight: 1.75 }}>
          <p>
            I'm a first-year B.Tech student at IIIT Nagpur, majoring in Data Science &
            Analytics — but most of what I build lives at the intersection of{" "}
            <span style={{ color: C.accent }}>backend engineering</span> and{" "}
            <span style={{ color: C.accent }}>agentic AI</span>.
          </p>
          <p className="mt-4">
            My current focus is an enterprise agentic data analyst — a system where multiple
            LLM agents plan, write, and execute analysis code inside sandboxed containers,
            with a human able to step in mid-run. Outside of that, I've shipped a production
            backend used by <span style={{ color: C.warm }}>thousands of students</span>, run
            club infrastructure, and designed cryptography challenges for a 500-participant
            CTF.
          </p>
          <p className="mt-4">
            I care about systems that are correct, observable, and don't fall over — whether
            that's a distributed task scheduler or a multi-agent pipeline with a human in the
            loop.
          </p>
        </div>
      </TerminalPanel>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Stack                                                                     */
/* -------------------------------------------------------------------------- */

const STACK: { icon: LucideIcon; name: string; items: string[] }[] = [
  {
    icon: Brain,
    name: "agentic / ai",
    items: [
      "LangGraph",
      "LangChain",
      "Multi-agent orchestration",
      "RAG",
      "Langfuse",
      "RAGAS",
      "MCP tool-calling",
      "Prompt engineering",
    ],
  },
  {
    icon: Server,
    name: "backend",
    items: ["Node.js", "Django Ninja", "Strapi", "Celery", "REST APIs"],
  },
  {
    icon: Boxes,
    name: "devops / infra",
    items: ["Docker", "Redis", "Prometheus", "Grafana", "CI/CD", "Linux"],
  },
  {
    icon: Database,
    name: "data / ml",
    items: [
      "Python",
      "PyTorch",
      "Distributed scheduling",
      "CNN / ViT architectures",
    ],
  },
];

function Stack() {
  return (
    <div className="flex flex-col gap-6">
      <SectionLabel id="stack" name="stack" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {STACK.map(({ icon: Icon, name, items }) => (
          <div
            key={name}
            style={{
              backgroundColor: C.panel,
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              padding: 20,
            }}
          >
            <div className="flex items-center gap-2">
              <Icon size={16} color={C.accent} />
              <h3 style={{ ...mono, color: C.text, fontSize: 14, fontWeight: 600 }}>
                {name}
              </h3>
            </div>
            <ul className="mt-4 flex flex-col gap-2">
              {items.map((it) => (
                <li key={it} className="flex items-center gap-2.5">
                  <StatusDot color={C.accent} size={6} />
                  <span style={{ ...body, color: C.text, fontSize: 13 }}>{it}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Projects                                                                  */
/* -------------------------------------------------------------------------- */

type Status = "running" | "deploying" | "archived" | "production";

interface Project {
  slug: string;
  status: Status;
  statusLabel: string;
  description: string;
  detail: string;
  metricLabel: string;
  metricValue: string;
  tags: string[];
}

const PROJECTS: Project[] = [
  {
    slug: "enterprise-agentic-analyst",
    status: "deploying",
    statusLabel: "deploying",
    description:
      "Multi-agent data analyst that plans, writes, and runs its own analysis code, with a human able to step in mid-task.",
    detail:
      "LangGraph orchestration across a Gemini 2.5 Flash planner and Qwen2.5-Coder worker agents, each code execution isolated in a Docker sandbox; Django Ninja + Celery handle the job queue, results stream back over SSE with human-in-the-loop checkpoints.",
    metricLabel: "orchestration",
    metricValue: "multi-agent",
    tags: ["LangGraph", "Docker", "Django Ninja", "Celery", "SSE", "HITL"],
  },
  {
    slug: "lcacs",
    status: "running",
    statusLabel: "running",
    description:
      "A distributed scheduler that decides the order ML training tasks run in, instead of just splitting work evenly.",
    detail:
      "Models the task graph as a DAG and schedules by topological sort rather than naive round-robin.",
    metricLabel: "makespan reduction vs HEFT",
    metricValue: "49.4%",
    tags: ["Distributed systems", "DAG scheduling", "Topological sort"],
  },
  {
    slug: "scene-segmentation",
    status: "running",
    statusLabel: "running",
    description:
      "Pixel-level scene understanding, comparing how a CNN and a transformer see the same image.",
    detail: "DINOv2 backbone with a SegFormer head, benchmarked against a CNN baseline.",
    metricLabel: "mIoU",
    metricValue: "56%",
    tags: ["DINOv2", "SegFormer", "CNN vs ViT"],
  },
  {
    slug: "modeldeploy",
    status: "running",
    statusLabel: "running",
    description:
      "A lightweight platform for pushing trained models to a low-latency inference endpoint.",
    detail: "Redis-backed serving layer tuned for fast lookups.",
    metricLabel: "redis latency",
    metricValue: "2ms",
    tags: ["Inference", "Redis", "Serving"],
  },
  {
    slug: "pravesh",
    status: "production",
    statusLabel: "running · production",
    description:
      "Institution-wide entry/exit management system used campus-wide, live on the Play Store.",
    detail:
      "Node.js + Strapi backend behind the Android app used across the institute; backed by ₹1L+ in college funding.",
    metricLabel: "active users",
    metricValue: "2,000+",
    tags: ["Node.js", "Strapi", "Production"],
  },
  {
    slug: "plastic-waste-detector",
    status: "archived",
    statusLabel: "archived · placed 2nd",
    description:
      "Real-time object detection to spot and classify plastic waste for automated sorting.",
    detail: "Built on YOLOv4; placed 2nd nationally at a sustainability-tech hackathon.",
    metricLabel: "national hackathon",
    metricValue: "2nd place",
    tags: ["YOLOv4", "Computer vision"],
  },
];

function statusColor(s: Status) {
  if (s === "running" || s === "production") return C.accent;
  if (s === "deploying") return C.warm;
  return C.muted;
}

/* -------------------------------------------------------------------------- */
/*  Topology hero — the signature section                                     */
/* -------------------------------------------------------------------------- */

type NodeType = "core" | "live" | "case-study" | "in-progress";

interface TopoNode {
  id: string;
  label: string;
  type: NodeType;
  x: number; // in viewBox units (1000x640 desktop)
  y: number;
  r: number;
  projectSlug?: string;
  url?: string;
  identity?: string; // for core
}

const NODES: TopoNode[] = [
  { id: "shri-core", label: "shri-core", type: "core", x: 500, y: 280, r: 50, identity: "orchestrator · you" },
  { id: "enterprise-agentic-analyst", label: "agentic-analyst", type: "in-progress", x: 760, y: 120, r: 32, projectSlug: "enterprise-agentic-analyst" },
  { id: "plastic-waste-detector", label: "plastic-detector", type: "case-study", x: 240, y: 120, r: 26, projectSlug: "plastic-waste-detector" },
  { id: "pravesh", label: "pravesh", type: "live", x: 870, y: 280, r: 32, projectSlug: "pravesh", url: "https://play.google.com/store" },
  { id: "lcacs", label: "lcacs", type: "case-study", x: 760, y: 440, r: 26, projectSlug: "lcacs" },
  { id: "scene-segmentation", label: "scene-seg", type: "case-study", x: 240, y: 440, r: 26, projectSlug: "scene-segmentation" },
  { id: "modeldeploy", label: "modeldeploy", type: "case-study", x: 130, y: 280, r: 26, projectSlug: "modeldeploy" },
];

// Curved bezier from core → satellite. Perpendicular offset creates the curve.
function edgePath(a: TopoNode, b: TopoNode, curve = 42) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  // perpendicular unit vector
  const px = -dy / len;
  const py = dx / len;
  const mx = (a.x + b.x) / 2 + px * curve;
  const my = (a.y + b.y) / 2 + py * curve;
  return `M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`;
}

function nodeTypeColor(t: NodeType) {
  if (t === "in-progress") return C.warm;
  return C.accent;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);
  return reduced;
}

function useIsMobile() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setM(mq.matches);
    const on = () => setM(mq.matches);
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);
  return m;
}

function TopologyNode({
  n,
  active,
  dimmed,
  reduced,
  onActivate,
  onHover,
  onLeave,
}: {
  n: TopoNode;
  active: boolean;
  dimmed: boolean;
  reduced: boolean;
  onActivate: () => void;
  onHover: () => void;
  onLeave: () => void;
}) {
  const ringColor = nodeTypeColor(n.type);
  const isCore = n.type === "core";
  const isLive = n.type === "live";
  const isCase = n.type === "case-study";
  const scale = active && !reduced ? 1.22 : 1;
  const opacity = dimmed ? 0.4 : 1;

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={`${n.label} — ${n.type}`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onFocus={onHover}
      onBlur={onLeave}
      onClick={onActivate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onActivate();
        }
      }}
      style={{
        cursor: "pointer",
        transition: "opacity 200ms ease",
        opacity,
        outline: "none",
      }}
    >
      <g
        style={{
          transform: `translate(${n.x}px, ${n.y}px) scale(${scale})`,
          transformBox: "fill-box",
          transformOrigin: "center",
          transition: reduced ? "none" : "transform 220ms cubic-bezier(0.2, 0.7, 0.2, 1)",
        }}
      >
        {isCore && !reduced && (
          <circle
            r={n.r + 6}
            fill="none"
            stroke={ringColor}
            strokeWidth={1}
            opacity={0.35}
          >
            <animate attributeName="r" values={`${n.r + 4};${n.r + 10};${n.r + 4}`} dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.55;0.1;0.55" dur="3s" repeatCount="indefinite" />
          </circle>
        )}
        {isLive && !reduced && (
          <circle r={n.r + 3} fill="none" stroke={ringColor} strokeWidth={1} opacity={0.35}>
            <animate attributeName="r" values={`${n.r + 2};${n.r + 7};${n.r + 2}`} dur="2.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.45;0.05;0.45" dur="2.4s" repeatCount="indefinite" />
          </circle>
        )}
        <circle
          r={n.r}
          fill={isLive ? "var(--portfolio-live-bg)" : C.panelAlt}
          stroke={ringColor}
          strokeWidth={active ? 2.5 : isCore ? 2 : 1.5}
          strokeDasharray={isCase ? "4 3" : undefined}
        />
        {/* focus ring */}
        {active && (
          <circle
            r={n.r + 6}
            fill="none"
            stroke={ringColor}
            strokeWidth={1}
            opacity={0.5}
          />
        )}
      </g>
      <text
        x={n.x}
        y={n.y + n.r + 24}
        textAnchor="middle"
        style={{
          ...mono,
          fontSize: isCore ? 14 : 13,
          fontWeight: isCore ? 600 : 500,
          fill: active ? C.accent : C.text,
          transition: "fill 200ms ease",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        {n.label}
      </text>
    </g>
  );
}

function TopologyGraph({
  activeId,
  setActiveId,
  onSelect,
  reduced,
}: {
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  onSelect: (n: TopoNode) => void;
  reduced: boolean;
}) {
  const core = NODES[0];
  const satellites = NODES.slice(1);
  const anyActive = activeId !== null;

  return (
    <svg
      viewBox="0 0 1000 560"
      preserveAspectRatio="xMidYMid meet"
      style={{ width: "100%", height: "100%", display: "block" }}
      role="img"
      aria-label="Live system topology graph of Shrihari's projects"
    >
      <defs>
        <pattern id="topo-dotgrid" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill={C.text} opacity="0.06" />
        </pattern>
        {satellites.map((s, i) => (
          <path key={s.id} id={`edge-${s.id}`} d={edgePath(core, s, i % 2 === 0 ? 42 : -38)} />
        ))}
      </defs>

      <rect x="0" y="0" width="1000" height="560" fill="url(#topo-dotgrid)" />

      {/* edges */}
      {satellites.map((s, i) => {
        const isActive = activeId === s.id || activeId === core.id;
        const dimmed = anyActive && !isActive;
        return (
          <use
            key={s.id}
            href={`#edge-${s.id}`}
            fill="none"
            stroke={isActive ? nodeTypeColor(s.type) : C.muted}
            strokeWidth={isActive ? 2 : 1.5}
            opacity={dimmed ? 0.18 : isActive ? 1 : 0.4}
            style={{ transition: "opacity 200ms ease, stroke 200ms ease" }}
          />
        );
      })}

      {/* traffic dots + trail along each edge */}
      {!reduced &&
        satellites.flatMap((s, i) => {
          const dur = 3.6 + (i % 3) * 0.6;
          const baseBegin = -i * 0.7;
          const trail = [
            { r: 4.5, op: 0.85, delay: 0 },
            { r: 3.5, op: 0.5, delay: 0.12 },
            { r: 2.5, op: 0.28, delay: 0.24 },
            { r: 1.8, op: 0.15, delay: 0.36 },
          ];
          return trail.map((t, ti) => (
            <circle
              key={`t-${s.id}-${ti}`}
              r={t.r}
              fill={nodeTypeColor(s.type)}
              opacity={t.op}
            >
              <animateMotion
                dur={`${dur}s`}
                repeatCount="indefinite"
                begin={`${baseBegin - t.delay}s`}
              >
                <mpath href={`#edge-${s.id}`} />
              </animateMotion>
            </circle>
          ));
        })}

      {/* nodes */}
      {NODES.map((n) => (
        <TopologyNode
          key={n.id}
          n={n}
          active={activeId === n.id}
          dimmed={anyActive && activeId !== n.id}
          reduced={reduced}
          onHover={() => setActiveId(n.id)}
          onLeave={() => setActiveId(null)}
          onActivate={() => onSelect(n)}
        />
      ))}
    </svg>
  );
}

// Mobile: vertical spine layout
function TopologyGraphMobile({
  activeId,
  setActiveId,
  onSelect,
  reduced,
}: {
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  onSelect: (n: TopoNode) => void;
  reduced: boolean;
}) {
  const core: TopoNode = { ...NODES[0], x: 160, y: 60, r: 34 };
  const sats = NODES.slice(1).map((n, i): TopoNode => {
    const rightSide = i % 2 === 0;
    return {
      ...n,
      x: rightSide ? 250 : 70,
      y: 170 + i * 100,
      r: 22,
    };
  });
  const all = [core, ...sats];
  const anyActive = activeId !== null;
  const height = 170 + sats.length * 100 + 40;

  return (
    <svg
      viewBox={`0 0 320 ${height}`}
      preserveAspectRatio="xMidYMid meet"
      style={{ width: "100%", height: "auto", display: "block" }}
      role="img"
      aria-label="Live system topology graph"
    >
      <defs>
        {sats.map((s, i) => (
          <path
            key={s.id}
            id={`m-edge-${s.id}`}
            d={edgePath(core, s, i % 2 === 0 ? 20 : -20)}
          />
        ))}
      </defs>
      {sats.map((s) => {
        const isActive = activeId === s.id || activeId === core.id;
        const dimmed = anyActive && !isActive;
        return (
          <use
            key={s.id}
            href={`#m-edge-${s.id}`}
            fill="none"
            stroke={isActive ? nodeTypeColor(s.type) : C.muted}
            strokeWidth={1.5}
            opacity={dimmed ? 0.2 : isActive ? 1 : 0.4}
          />
        );
      })}
      {!reduced &&
        sats.flatMap((s, i) => {
          const dur = 4 + (i % 2);
          const baseBegin = -i * 0.6;
          const trail = [
            { r: 3.5, op: 0.8, delay: 0 },
            { r: 2.5, op: 0.45, delay: 0.14 },
            { r: 1.6, op: 0.22, delay: 0.28 },
          ];
          return trail.map((t, ti) => (
            <circle key={`mt-${s.id}-${ti}`} r={t.r} fill={nodeTypeColor(s.type)} opacity={t.op}>
              <animateMotion dur={`${dur}s`} repeatCount="indefinite" begin={`${baseBegin - t.delay}s`}>
                <mpath href={`#m-edge-${s.id}`} />
              </animateMotion>
            </circle>
          ));
        })}
      {all.map((n) => (
        <TopologyNode
          key={n.id}
          n={n}
          active={activeId === n.id}
          dimmed={anyActive && activeId !== n.id}
          reduced={reduced}
          onHover={() => setActiveId(n.id)}
          onLeave={() => {}}
          onActivate={() => onSelect(n)}
        />
      ))}
    </svg>
  );
}

function statusMeta(n: TopoNode) {
  if (n.type === "core") return { color: C.accent, label: "running" };
  if (n.type === "in-progress") return { color: C.warm, label: "deploying" };
  const p = PROJECTS.find((x) => x.slug === n.projectSlug);
  return { color: statusColor(p?.status ?? "running"), label: p?.statusLabel ?? "running" };
}

function NodeInspector({ node }: { node: TopoNode | null }) {
  if (!node) {
    return (
      <div
        style={{
          backgroundColor: C.panel,
          border: `1px solid ${C.border}`,
          borderRadius: 8,
          padding: 20,
          minHeight: 320,
        }}
        className="flex items-center justify-center"
      >
        <p style={{ ...mono, color: C.muted, fontSize: 12, textAlign: "center" }}>
          hover a node to inspect it
          <br />
          <span style={{ opacity: 0.7 }}>· tap on touch devices ·</span>
        </p>
      </div>
    );
  }

  const meta = statusMeta(node);

  if (node.type === "core") {
    return (
      <div
        style={{
          backgroundColor: C.panel,
          border: `1px solid ${C.border}`,
          borderRadius: 8,
          padding: 20,
        }}
      >
        <div className="flex items-center gap-2">
          <StatusDot color={meta.color} pulse />
          <span style={{ ...mono, color: C.text, fontSize: 14, fontWeight: 600 }}>
            {node.label}
          </span>
          <span style={{ ...mono, color: C.muted, fontSize: 11, marginLeft: "auto" }}>
            {meta.label}
          </span>
        </div>
        <p style={{ ...body, color: C.text, fontSize: 14, lineHeight: 1.6, marginTop: 14 }}>
          {node.identity}
        </p>
        <p style={{ ...body, color: C.muted, fontSize: 12.5, lineHeight: 1.6, marginTop: 8 }}>
          Backend + devops engineer routing traffic to every project on this graph.
          Each satellite is a real service — some deployed, some documented.
        </p>
      </div>
    );
  }

  const p = PROJECTS.find((x) => x.slug === node.projectSlug)!;
  const isLive = node.type === "live";

  return (
    <div
      style={{
        backgroundColor: C.panel,
        border: `1px solid ${C.border}`,
        borderRadius: 8,
        padding: 20,
      }}
    >
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <span
          style={{ ...mono, color: C.text, fontSize: 14, fontWeight: 600 }}
          className="truncate"
        >
          {p.slug}
        </span>
        <div className="flex shrink-0 items-center gap-2">
          <StatusDot color={meta.color} pulse={isLive} />
          <span style={{ ...mono, color: C.muted, fontSize: 11 }}>{p.statusLabel}</span>
        </div>
      </div>
      <p style={{ ...body, color: C.text, fontSize: 14, lineHeight: 1.6, marginTop: 12 }}>
        {p.description}
      </p>
      <p style={{ ...body, color: C.muted, fontSize: 12.5, lineHeight: 1.6, marginTop: 8 }}>
        {p.detail}
      </p>
      <div
        className="mt-4 flex items-baseline gap-3"
        style={{
          backgroundColor: C.panelAlt,
          border: `1px solid ${C.border}`,
          borderRadius: 6,
          padding: "10px 12px",
        }}
      >
        <span
          style={{
            ...mono,
            color: C.muted,
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          {p.metricLabel}
        </span>
        <span
          className="ml-auto"
          style={{ ...mono, color: C.warm, fontSize: 16, fontWeight: 700 }}
        >
          {p.metricValue}
        </span>
      </div>
      <ul className="mt-4 flex flex-wrap gap-1.5">
        {p.tags.map((t) => (
          <li key={t}>
            <Tag>{t}</Tag>
          </li>
        ))}
      </ul>
      {isLive && node.url && (
        <a
          href={node.url}
          target="_blank"
          rel="noreferrer noopener"
          style={{
            ...mono,
            fontSize: 12,
            color: C.accent,
            marginTop: 14,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          open live app <ArrowUpRight size={12} />
        </a>
      )}
    </div>
  );
}

function Hero() {
  const reduced = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const [activeId, setActiveIdRaw] = useState<string | null>(null);
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const setActiveId = (id: string | null) => {
    if (pinnedId) return; // hover locked while pinned
    setActiveIdRaw(id);
  };

  const shownId = pinnedId ?? activeId;
  // Default idle state: show the core node's info instead of a blank placeholder
  const shownNode =
    (shownId ? NODES.find((n) => n.id === shownId) : null) ?? NODES[0];

  const handleSelect = (n: TopoNode) => {
    // Live app with external URL → open it
    if (n.type === "live" && n.url) {
      window.open(n.url, "_blank", "noopener,noreferrer");
      return;
    }
    setPinnedId((cur) => (cur === n.id ? null : n.id));
    setActiveIdRaw(n.id);
  };

  return (
    <section
      id="projects"
      aria-labelledby="hero-heading"
      className="relative"
      style={{
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 pt-24 pb-6 md:px-8 md:pt-28 md:pb-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <StatusDot pulse />
            <span
              style={{
                ...mono,
                color: C.muted,
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              live topology · shri.dev
            </span>
          </div>
          <h1
            id="hero-heading"
            style={{
              ...mono,
              color: C.text,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
            className="text-[28px] md:text-[40px]"
          >
            Shrihari Telang
          </h1>
          <p style={{ ...mono, color: C.accent, fontSize: 14, fontWeight: 500 }}>
            backend + devops engineer · building agentic ai systems
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_340px]">
          <div
            style={{
              backgroundColor: C.panel,
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <div
              className="flex items-center gap-3 px-4 py-2.5"
              style={{ borderBottom: `1px solid ${C.border}`, backgroundColor: C.panelAlt }}
            >
              <div className="flex items-center gap-1.5">
                <span style={{ width: 10, height: 10, borderRadius: 999, backgroundColor: C.red, opacity: 0.6 }} />
                <span style={{ width: 10, height: 10, borderRadius: 999, backgroundColor: C.warm, opacity: 0.6 }} />
                <span style={{ width: 10, height: 10, borderRadius: 999, backgroundColor: C.accent, opacity: 0.6 }} />
              </div>
              <span style={{ ...mono, color: C.muted, fontSize: 12 }}>
                ~/infra $ topology --live
              </span>
              <span
                style={{ ...mono, color: C.muted, fontSize: 11, marginLeft: "auto" }}
                className="hidden sm:inline"
              >
                {NODES.length} nodes · {NODES.length - 1} edges
              </span>
            </div>
            <div
              style={{
                minHeight: isMobile ? 0 : 460,
                padding: isMobile ? 12 : 8,
              }}
            >
              {isMobile ? (
                <TopologyGraphMobile
                  activeId={shownId}
                  setActiveId={setActiveId}
                  onSelect={handleSelect}
                  reduced={reduced}
                />
              ) : (
                <TopologyGraph
                  activeId={shownId}
                  setActiveId={setActiveId}
                  onSelect={handleSelect}
                  reduced={reduced}
                />
              )}
            </div>
            <div
              className="flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-2.5"
              style={{ borderTop: `1px solid ${C.border}`, backgroundColor: C.panelAlt }}
            >
              <LegendItem swatch={<CoreSwatch />} label="core" />
              <LegendItem swatch={<LiveSwatch />} label="live app" />
              <LegendItem swatch={<CaseSwatch />} label="case study" />
              <LegendItem swatch={<InProgressSwatch />} label="in progress" />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <NodeInspector node={shownNode} />
            <div className="flex flex-wrap gap-3">
              <a
                href="#about"
                style={{
                  ...mono,
                  fontSize: 13,
                  fontWeight: 600,
                  color: C.bg,
                  backgroundColor: C.accent,
                  padding: "10px 16px",
                  borderRadius: 6,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  minHeight: 44,
                }}
              >
                explore the graph <ArrowUpRight size={14} />
              </a>
              <a
                href="#contact"
                style={{
                  ...mono,
                  fontSize: 13,
                  fontWeight: 600,
                  color: C.text,
                  border: `1px solid ${C.border}`,
                  padding: "10px 16px",
                  borderRadius: 6,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  minHeight: 44,
                }}
              >
                get in touch
              </a>
            </div>
          </div>
        </div>

        {/* DOM-accessible project list for screen readers */}
        <ul className="sr-only">
          {PROJECTS.map((p) => (
            <li key={p.slug}>
              {p.slug} — {p.statusLabel}. {p.description} {p.detail} {p.metricLabel}: {p.metricValue}.
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function LegendItem({ swatch, label }: { swatch: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2">
      {swatch}
      <span style={{ ...mono, color: C.muted, fontSize: 11 }}>{label}</span>
    </div>
  );
}
function CoreSwatch() {
  return (
    <svg width={14} height={14}>
      <circle cx={7} cy={7} r={4.5} fill={C.panelAlt} stroke={C.accent} strokeWidth={1.5} />
      <circle cx={7} cy={7} r={6.5} fill="none" stroke={C.accent} strokeWidth={0.75} opacity={0.5} />
    </svg>
  );
}
function LiveSwatch() {
  return (
    <svg width={14} height={14}>
      <circle cx={7} cy={7} r={5} fill="var(--portfolio-swatch-bg)" stroke={C.accent} strokeWidth={1.5} />
    </svg>
  );
}
function CaseSwatch() {
  return (
    <svg width={14} height={14}>
      <circle cx={7} cy={7} r={5} fill={C.panelAlt} stroke={C.accent} strokeWidth={1.2} strokeDasharray="3 2" />
    </svg>
  );
}
function InProgressSwatch() {
  return (
    <svg width={14} height={14}>
      <circle cx={7} cy={7} r={5} fill={C.panelAlt} stroke={C.warm} strokeWidth={1.5} />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Log (experience)                                                          */
/* -------------------------------------------------------------------------- */

const LOG = [
  {
    hash: "a3f9c1",
    role: "Server Head",
    org: "CRISPR Tech Club",
    when: "current",
    body: "Own club infrastructure and designed CTF challenges for EnigmaXplore 3.0, covering RSA, AES, ECC, and isogeny-based cryptography for 500+ participants.",
  },
  {
    hash: "7d2e08",
    role: "Backend Developer",
    org: "Pravesh",
    when: "current",
    body: "Built the Node.js + Strapi backend for an entry/exit management system now live on the Play Store with 2,000+ active users and ₹1L+ in college funding.",
  },
  {
    hash: "1b6a44",
    role: "B.Tech CSE, Data Science & Analytics",
    org: "IIIT Nagpur",
    when: "2024–2028",
    body: "CGPA 8.83/10, highest in batch first semester with multiple perfect-10 subject grades.",
  },
];

function Log() {
  return (
    <div className="flex flex-col gap-6">
      <SectionLabel id="log" name="log" />
      <TerminalPanel prompt="~/experience $ git log --oneline">
        <ol className="flex flex-col">
          {LOG.map((e, i) => (
            <li key={e.hash} className="grid grid-cols-[24px_1fr] gap-4">
              {/* commit column */}
              <div className="flex flex-col items-center">
                <span
                  aria-hidden
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 999,
                    border: `1px solid ${C.border}`,
                    backgroundColor: C.panelAlt,
                    marginTop: 4,
                  }}
                />
                {i < LOG.length - 1 && (
                  <span
                    aria-hidden
                    style={{
                      width: 1,
                      flex: 1,
                      backgroundColor: C.border,
                      marginTop: 4,
                    }}
                  />
                )}
              </div>
              {/* entry column */}
              <div className={i === LOG.length - 1 ? "pb-0" : "pb-6"}>
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3">
                  <div className="min-w-0">
                    <span style={{ ...mono, color: C.warm, fontSize: 12 }}>{e.hash}</span>{" "}
                    <span style={{ ...mono, color: C.text, fontSize: 13, fontWeight: 600 }}>
                      {e.role}
                    </span>{" "}
                    <span style={{ ...mono, color: C.muted, fontSize: 13 }}>@ {e.org}</span>
                  </div>
                  <span style={{ ...mono, color: C.muted, fontSize: 11 }}>{e.when}</span>
                </div>
                <p
                  style={{
                    ...body,
                    color: C.muted,
                    fontSize: 13,
                    lineHeight: 1.65,
                    marginTop: 6,
                  }}
                >
                  {e.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </TerminalPanel>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Stats                                                                     */
/* -------------------------------------------------------------------------- */

function StatCard({
  icon: Icon,
  label,
  title,
  detail,
  lines,
}: {
  icon: LucideIcon;
  label: string;
  title?: string;
  detail?: string;
  lines?: string[];
}) {
  return (
    <div
      style={{
        backgroundColor: C.panel,
        border: `1px solid ${C.border}`,
        borderRadius: 8,
        padding: 20,
      }}
    >
      <div className="flex items-center gap-2">
        <Icon size={14} color={C.accent} />
        <span
          style={{
            ...mono,
            color: C.muted,
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          {label}
        </span>
      </div>
      {title && (
        <div className="mt-3">
          <div style={{ ...mono, color: C.warm, fontSize: 22, fontWeight: 700 }}>{title}</div>
          {detail && (
            <div style={{ ...body, color: C.muted, fontSize: 13, marginTop: 4 }}>{detail}</div>
          )}
        </div>
      )}
      {lines && (
        <ul className="mt-3 flex flex-col gap-2">
          {lines.map((l) => (
            <li key={l} style={{ ...body, color: C.text, fontSize: 13 }}>
              {l}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Stats() {
  return (
    <div className="flex flex-col gap-6">
      <SectionLabel id="stats" name="stats" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          icon={Target}
          label="leetcode"
          title="Knight"
          detail="1850+ rating · 400+ solved"
        />
        <StatCard
          icon={Activity}
          label="codeforces"
          title="Specialist"
          detail="1400+ rating · 200+ solved"
        />
        <StatCard
          icon={Trophy}
          label="hackathons"
          lines={["Swayambhu — 2nd place, ₹30K", "Insignia (MIT WPU) — Finalist"]}
        />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Contact                                                                   */
/* -------------------------------------------------------------------------- */

const ENV_ROWS: { k: string; v: string; accent?: boolean }[] = [
  { k: "NAME", v: '"Shrihari Telang"' },
  { k: "LOCATION", v: '"Nagpur, Maharashtra, IN"' },
  { k: "EDU", v: '"IIIT Nagpur, CSE-DSA \'28"' },
  { k: "STATUS", v: '"open to AI/ML internships"', accent: true },
];

const LINKS: { icon: LucideIcon; label: string; value: string; href: string }[] = [
  {
    icon: Mail,
    label: "email",
    value: "hello@shrihari.dev  // placeholder",
    href: "mailto:hello@shrihari.dev",
  },
  {
    icon: Github,
    label: "github",
    value: "github.com/shrihari  // placeholder",
    href: "https://github.com/",
  },
  {
    icon: Linkedin,
    label: "linkedin",
    value: "linkedin.com/in/shrihari  // placeholder",
    href: "https://linkedin.com/",
  },
];

function ContactRow({
  icon: Icon,
  value,
  href,
}: {
  icon: LucideIcon;
  value: string;
  href: string;
}) {
  const [hover, setHover] = useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3"
      style={{
        border: `1px solid ${hover ? C.accent : C.border}`,
        backgroundColor: C.panelAlt,
        borderRadius: 6,
        padding: "12px 14px",
        minHeight: 44,
        transition: "border-color 160ms ease",
      }}
    >
      <Icon size={14} color={hover ? C.accent : C.muted} />
      <span
        className="truncate"
        style={{ ...mono, color: hover ? C.accent : C.text, fontSize: 13 }}
      >
        {value}
      </span>
      <ArrowUpRight size={14} color={hover ? C.accent : C.muted} />
    </a>
  );
}

function Contact() {
  return (
    <div className="flex flex-col gap-6">
      <SectionLabel id="contact" name="contact" />
      <TerminalPanel prompt="~/contact $ cat .env">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            {ENV_ROWS.map((r) => (
              <div key={r.k} style={{ ...mono, fontSize: 13, lineHeight: 1.7 }}>
                <span style={{ color: C.muted }}>{r.k}</span>
                <span style={{ color: C.muted }}>=</span>
                <span style={{ color: r.accent ? C.accent : C.text }}>{r.v}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            {LINKS.map((l) => (
              <ContactRow key={l.label} icon={l.icon} value={l.value} href={l.href} />
            ))}
          </div>
        </div>
      </TerminalPanel>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Footer                                                                    */
/* -------------------------------------------------------------------------- */

function Footer() {
  const uptime = useUptime();
  const year = useMemo(() => new Date().getFullYear(), []);
  return (
    <footer
      className="mt-20 py-8"
      style={{ borderTop: `1px solid ${C.border}` }}
    >
      <p
        className="text-center"
        style={{ ...mono, color: C.muted, fontSize: 12 }}
      >
        built by shri · rendered {year} · uptime{" "}
        <span style={{ color: C.text }}>{uptime}</span>
      </p>
    </footer>
  );
}

/* -------------------------------------------------------------------------- */
/*  Root                                                                      */
/* -------------------------------------------------------------------------- */

export default function Portfolio() {
  // Global focus outline via a tiny injected style so we can target :focus-visible
  useEffect(() => {
    const id = "shri-focus-style";
    if (document.getElementById(id)) return;
    const el = document.createElement("style");
    el.id = id;
    el.textContent = `
      html, body { background-color: ${C.bg}; color: ${C.text}; }
      a:focus-visible, button:focus-visible {
        outline: 2px solid ${C.accent};
        outline-offset: 2px;
        border-radius: 4px;
      }
      ::selection { background: ${C.accent}; color: ${C.bg}; }
    `;
    document.head.appendChild(el);
  }, []);

  return (
    <div id="top" style={{ backgroundColor: C.bg, minHeight: "100vh" }}>
      <Nav />
      <Hero />
      <main className="mx-auto max-w-5xl px-5 md:px-8">
        <div className="mt-20 flex flex-col gap-20 md:mt-24 md:gap-24">
          <About />
          <Stack />
          <Log />
          <Stats />
          <Contact />
        </div>
        <div className="flex items-center gap-2 pt-16 pl-1 md:hidden">
          <StatusDot pulse />
          <span style={{ ...mono, color: C.muted, fontSize: 11 }}>
            uptime <span style={{ color: C.text }}>live</span>
          </span>
        </div>
      </main>
      <Footer />
    </div>
  );
}