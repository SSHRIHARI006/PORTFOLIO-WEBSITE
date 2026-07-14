# shrihari.dev — Master Design Specification

Supersedes all earlier docs (v1 base, v2 graph-hero, v3 fix notes, FINAL). This is the single source of truth — tool-agnostic, meant to drive Stitch mockups and whatever builds off them (Antigravity or otherwise). Nothing else needs to be cross-referenced.

---

## 0. What changed, in one paragraph

The site is now two pages, not one. The root domain is a **solar system landing page** — a sun (routes to the portfolio) orbited by four inactive placeholder planets (Projects, Blogs, Social, Contact) that will get wired up later. `/portfolio` is the resume-style page we already designed — same section structure, but repositioned copy (AI/AI-systems engineer first, DevOps/infra as supporting skill, not co-equal identity), real content pulled from your resume, real social links, no location mentioned, and the light theme promoted to default and pushed further visually.

---

## 1. Concept & positioning

**Who:** Shrihari Telang — AI / AI systems engineer, with DevOps and infra as a supporting skill set, not the headline. B.Tech CSE (Data Science & Analytics), IIIT Nagpur, 2024–2028.

**Positioning shift from earlier drafts:** previously framed backend/DevOps-first. That's now corrected — you build AI systems (multi-agent orchestration, distributed ML scheduling, inference platforms); the Docker/Nginx/Prometheus/CI-CD work is what makes those systems actually shippable, not a separate identity. Copy throughout leads with the AI/systems framing and treats infra as "and I also run the plumbing," not a parallel headline.

**Core metaphor, updated:** the site used to say "this is a running system" via terminal chrome. It now says the same thing two ways on two pages — the landing page **shows** it (a literal solar system: one core body, everything else in orbit around it, exactly the shape of an orchestrator with worker agents), and the portfolio page **tells** it (terminal panels, commit-log experience section, live uptime counter). The solar system isn't just a prettier graph — it's a better metaphor for what you actually build: one core, several independent bodies in orbit, not yet all connected to their eventual destinations.

**What this is NOT:** no matrix-rain, no glitch-text, no janky physics-simulated orbits (paths are fixed/calculated, not physics-engine wobble), no overloaded landing page competing with the solar system for attention — the landing page's *only* job is the solar system, nothing scrolls below it.

---

## 2. Information architecture

```
shrihari.dev                    → Solar System landing (this IS the whole page, no scroll)
  └── sun click                 → /portfolio

shrihari.dev/portfolio          → resume-style page (nav, hero, about, stack, projects, log, stats, contact)
  └── planets other than sun are NOT reachable from here yet — they only exist visually on the landing page
```

**Landing page planets and their current state:**

| Body | Represents | v1 state |
|---|---|---|
| ☉ Sun | Portfolio | **Active** — click/tap navigates to `/portfolio` |
| Planet — Projects | future project hub | Inactive — hover/tap shows a "coming soon" tooltip, no navigation |
| Planet — Blogs | future blog | Inactive — same |
| Planet — Social | future social hub (GitHub/LinkedIn/LC/CF as moons, eventually — see §11) | Inactive — same |
| Planet — Contact | future contact page | Inactive — same |

Real, working social links (GitHub, LinkedIn, LeetCode, Codeforces, email) live on `/portfolio` immediately (§8.7) — they don't wait on the landing page's Social planet being wired up. Two different things: the landing page is a placeholder shell for future expansion, the portfolio page is the real, live resume-style destination and should be fully functional today.

---

## 3. Theming system

Two themes, one component set, driven entirely by tokens — same discipline as before, but **light is now the default and the primary design target.** Dark remains available via toggle but gets no bespoke embellishment beyond the existing token set; design effort goes into light.

### 3.1 Tokens

| Token | Light (default) | Dark | Usage |
|---|---|---|---|
| `bg` | `#F7F4EC` | `#0B0E11` | Page background |
| `panel` | `#FFFFFF` | `#12161C` | Card / panel surfaces |
| `panel-alt` | `#EFEAD9` | `#161B22` | Secondary surface, inactive planet fill |
| `border` | `#E3DCC9` | `#232A33` | Hairlines, orbit ring paths |
| `text` | `#2B2621` | `#D8DEE4` | Primary text |
| `muted` | `#8B8172` | `#5C6773` | Secondary text, inactive labels |
| `accent` | `#D97757` (terracotta) | `#4FD1C5` | Sun, live/interactive states, primary CTA, links |
| `warm` | `#B54A24` (rust) | `#F2A65A` | Metrics, emphasis values |
| `red` | `#B3261E` | `#E06C75` | Reserved, essentially unused |

### 3.2 Default & toggle

- **Default: light**, regardless of OS preference. This is a deliberate override of the usual "respect `prefers-color-scheme`" pattern — you've specifically called out the bright theme as the stronger one, so it should be what everyone sees first.
- Toggle: sun/moon icon, top-right of nav on both pages. Manual choice persists (localStorage) once toggled.
- Cross-fade colors over ~150ms on toggle.

### 3.3 Elevating the light theme

This is the theme that needs to land as "wow," so it gets three specific upgrades beyond the flat-surfaces rule the dark theme follows:

1. **Sun glow.** The one deliberate exception to "no glow anywhere" — the sun gets a soft radial `accent`-colored glow behind it (large soft-edged radial gradient, low opacity ~15–20%, breathing in sync with its pulse). This isn't decorative glow for its own sake, it's the sun actually looking like it's radiating — the metaphor earns it.
2. **Soft elevation shadows on cards.** Light mode can't rely on dark mode's background-value-shift trick to make panels feel "raised" (panel is *lighter* than bg here, not darker) — so panels get a very soft, warm-toned shadow: `0 4px 20px rgba(43, 38, 33, 0.06)`, barely-there, no hard edges. This is what makes the light theme feel premium instead of flat-and-pale.
3. **Orbit ring paths.** Faint circular guide lines (§8) marking each planet's path — visually these read as intentional "solar system diagram" structure and solve the composition/empty-space problem outright, rather than needing a background texture hack.

Dark mode keeps the original flat, no-shadow discipline (with the same sun-glow exception, rendered in cyan) — it's still fully coherent, it's just not where the polish budget goes.

---

## 4. Typography, spacing, iconography

Unchanged from prior versions:
- Display/headings: `JetBrains Mono` (500/600/700/800). Body: `IBM Plex Mono` (400/500). Fully monospace site, both pages, both themes.
- Type scale: hero name 48px/30px, section h2 20px/18px, card title 14px, body 14–15px, small/labels 11–12px.
- Base spacing unit 4px; radius 6px (small elements) / 8px (cards); max content width 1024px on the portfolio page (landing page's solar system is full-bleed, no max-width).
- Icons: Lucide outline set, always paired with text.

---

## 5. Reusable UI patterns

**Terminal panel, Status dot, Section label, Tag/pill** — unchanged from the prior spec, used on `/portfolio` only (the landing page doesn't use terminal-panel chrome — see §7).

**Celestial body** — new pattern, used only on the landing page. A circle (sun or planet) with a label beneath it. Sun: `accent` fill, glow (§3.3), breathing pulse. Planet (inactive state): `panel-alt` fill, `border` outline, `muted` label — no color-coding by category for now since all four are equally inactive; once a planet is wired up (§11), it can pick up its own accent treatment.

**Orbit ring** — a thin circular path (stroke = `border` at ~25–30% opacity) that a planet travels along. Purely structural/decorative at rest; brightens slightly to `accent` at 40% opacity when its planet is hovered.

**Tooltip callout** — small card that appears near a hovered/tapped celestial body: name + one line (destination for the sun, "coming soon" for planets). Replaces the heavier "inspector panel" pattern from the old graph version — with only 5 bodies and mostly-inactive states, a lightweight tooltip is enough; a persistent side panel would just be empty most of the time.

---

## 6. Landing page — Solar System

Full-bleed, full-viewport, no content below it — this page's entire job is this one moment.

**Composition:** sun centered (true center, not left-biased). Four orbit rings as concentric circles around it, radii roughly 180 / 240 / 300 / 360px on desktop (scale down proportionally, don't just clip, on smaller desktop viewports). One planet per ring.

**Sizing:** sun 140px diameter desktop / 96px mobile. Planets 48px uniform desktop / 36px mobile — deliberately equal-sized since all four are currently peers in "not yet active" status; don't invent a hierarchy among them yet.

**Orbit motion:** each planet continuously travels its ring, inner rings faster than outer (real orbital mechanics as the inspiration) — roughly 40s per revolution for the innermost ring up to ~100s for the outermost. All planets move the same rotational direction for visual harmony. Stagger starting angles (e.g. 0°, 80°, 160°, 250°) so they don't all launch from the same position and briefly line up.

**Sun idle state:** slow breathing pulse (scale 1↔1.03, glow opacity 0.15↔0.25, ~3s loop) — the one body that doesn't orbit, it's the center.

**Hover/focus (desktop):**
- Sun: scale ~1.1×, tooltip appears (`enter portfolio →`), cursor indicates it's clickable.
- Planet: its orbit motion eases to a stop (don't just freeze instantly — ease out over ~300ms), scales ~1.2×, its ring brightens, tooltip shows its name + "coming soon." Other bodies dim slightly (~60% opacity) as a simple focus effect.
- Releasing hover resumes that planet's orbit motion from where it paused.

**Tap (mobile/touch):** same visual state as hover, persists until tapped elsewhere or another body is tapped — no hover to fall back on.

**Minimal nav on this page only:** small logo/wordmark top-left, theme toggle top-right. No section links (there's nothing to scroll to). Optionally a small "enter portfolio" text link near the sun as a redundant, obviously-clickable path in addition to clicking the sun itself.

**Mobile fallback:** concentric rings don't work below ~768px (either too cramped or requires the sun to shrink to nothing). Switch to a vertical layout instead: sun centered at top (still pulsing/glowing), the four planets in a single column beneath it connected by a short vertical line from the sun through each — same bodies, same colors, same tap interactions, adapted layout rather than a shrunk desktop version. Orbit motion can be dropped on mobile (static positions) — not worth the battery/performance cost at this layout, and it's not the "wow" moment on mobile the way the full desktop composition is.

**Reduced motion:** disable sun pulse, orbit motion, and hover transitions — snap to final states instantly. The solar system is still fully legible as a static diagram.

---

## 7. Portfolio page (`/portfolio`)

Structure carries over from the prior spec largely unchanged ("current layout is fine") — differences are in content, ordering, and two additions (a Projects section is back, since this page now needs to stand alone as the full resume-equivalent; real contact links).

```
[ Nav — incl. ← home, section links, uptime, theme toggle ]
[ Hero ]
[ About ]
[ Stack (reordered: AI/agentic first) ]
[ Projects ]
[ Log (experience) ]
[ Stats ]
[ Contact — real links ]
[ Footer ]
```

### 7.1 Navigation

Same as before, plus a small `← home` link (leftmost, before the terminal-icon wordmark) back to the solar system landing. Section links: `./about` `./stack` `./projects` `./log` `./stats` `./contact`. Uptime counter + theme toggle, right side, desktop only (hidden in the mobile hamburger menu, uptime specifically dropped on mobile as before).

### 7.2 Hero

- Eyebrow label: `AI SYSTEMS ENGINEER · SHRI.DEV` (was `LIVE TOPOLOGY`, updated to match repositioning).
- Name (h1): `Shrihari Telang`.
- Role line: `AI / AI systems engineer — devops & infra on the side` (accent color).
- **Social row** (new): small icon row directly beneath the role line — GitHub, LinkedIn, LeetCode, Codeforces, email — mirroring how your resume itself puts every link right under your name. Real URLs, see §12.
- Short bio (2–3 sentences, see §12) — no boot sequence, no location.
- Fact badges: `IIIT Nagpur '28` · `CGPA 8.56` · `2,000+ users shipped` · `LeetCode Knight` — location badge removed per your instruction, replaced with a CP credibility signal.
- CTA buttons: `view projects` (primary, scrolls to Projects), `get in touch` (outlined, scrolls to Contact).

### 7.3 About

Terminal panel, `~/about $ cat about.md`. Copy in §12 — leads with AI systems, frames infra/DevOps as what makes the AI work shippable rather than a separate track.

### 7.4 Stack — reordered

Still a 2×2 grid, but reordered and rebalanced so AI is visually first and DevOps reads as smaller/supporting:
1. **AI / agentic systems** (largest list — this is the headline category now)
2. **Backend & data**
3. **DevOps / infra** (kept, but positioned third — "on the side," not co-equal)
4. **Languages & core**

Full item lists in §12.

### 7.5 Projects (new — was folded into the graph in the last version, now back as its own section since it's not on the landing page anymore)

Standard card grid, 2-column desktop / 1-column mobile — same card visual language as before (name, one-line hook, short technical bullets, a headline metric where one exists, tags), just without the graph-node status system (no "core/live-app/case-study" types — that belonged to the old hero graph, not this page). A project can optionally carry a small `in development` tag where your resume itself says so.

Content is pulled directly from your resume (§12) — real bullets, real numbers, flagged where the two resumes disagree (§13). You mentioned this content is placeholder-able since you'll customize per-project once each is deployed — that's fine, but since the resume gives real, precise content, it's used here rather than left generic; swap freely later.

### 7.6 Log (experience)

`~/experience $ git log --oneline`. Same visual pattern (commit marker, hash-style code, role/org, timeframe, description) — content updated and expanded from your resume in §12, richer than what the site had before (Coolify migration, specific uptime %, CTF sandbox details, Pravesh's live URL and QR-validation volume).

### 7.7 Stats

Unchanged pattern. Numbers flagged for confirmation in §13 (your two resumes disagree on LeetCode problems solved).

### 7.8 Contact — real links, no placeholders

`~/contact $ cat .env`. Left column: `NAME=`, `EDU=`, `STATUS=` (location line removed entirely per your instruction). Right column: five real link rows now instead of three placeholders — email, GitHub, LinkedIn, LeetCode, Codeforces, all sourced from your resume header (§12).

### 7.9 Footer

Unchanged: `built by shri · rendered [year] · uptime HH:MM:SS`.

---

## 8. Motion principles (site-wide)

- **Landing page:** sun breathing pulse + glow (continuous), planet orbit motion (continuous, per-planet speed), hover/tap state changes (eased). Nothing else moves.
- **Portfolio page:** status-dot pulses (uptime + any "running" indicators only), hover micro-interactions (link color, button state, card lift), theme-toggle cross-fade. No scroll-triggered fade-ups.
- `prefers-reduced-motion` disables all of the above in favor of instant final states, on both pages.

---

## 9. Responsive behavior

- Single breakpoint: 768px, both pages.
- Landing: concentric-ring layout → vertical stacked layout below 768px, per §6.
- Portfolio: Stack (4→2×2→1col), Projects (2→1col), Stats (3→1col) collapse below 768px. Nav collapses to hamburger (uptime hidden). Touch targets ≥44px throughout.

---

## 10. Accessibility

- Verify `muted` meets AA against `bg`/`panel` in both themes at the sizes used.
- All celestial bodies and nav/project/contact links are real focusable elements with visible 2px `accent` focus rings, logical tab order.
- Project/experience/contact info must exist as real text in the DOM — never gated behind a hover-only interaction, on either page.
- `prefers-reduced-motion` fully respected per §8.
- Semantic HTML throughout (real heading hierarchy, real `<a>`/`<button>`).

---

## 11. Forward compatibility

- **Planet activation:** when Projects/Blogs/Social/Contact go live, each planet can pick up its own `accent` tint (currently uniform neutral since all four are equally inactive) and a real destination URL/route.
- **Social moons (nice idea for later, not in scope now):** once the Social planet is activated, it could grow small moons of its own — GitHub/LinkedIn/LeetCode/Codeforces as tiny orbiting bodies around the Social planet, nested orbits mirroring the sun/planet relationship one level down. Don't build this now — it's a natural extension once Social stops being a placeholder.
- **Projects planet → Projects page:** eventually the landing page's Projects planet could route to a dedicated project hub (the "docs + architecture diagrams per project" idea from earlier planning) — the `/portfolio` Projects section stays as the condensed resume-style summary regardless; the two aren't meant to merge.
- Tokens (§3) and the Celestial body / Terminal panel component sets are the site-wide system — both current and future pages should reuse them rather than reinventing styles.

---

## 12. Content inventory

### Hero (portfolio page)
- Eyebrow: `AI SYSTEMS ENGINEER · SHRI.DEV`
- Role line: `AI / AI systems engineer — devops & infra on the side`
- Fact badges: `IIIT Nagpur '28` · `CGPA 8.56` · `2,000+ users shipped` · `LeetCode Knight`

### About
> I'm a B.Tech CS student at IIIT Nagpur (Data Science & Analytics, 2024–2028), and most of what I build lives inside AI systems — training and evaluating models, and increasingly, orchestrating multi-agent pipelines that plan and execute their own work.
>
> My current focus is an enterprise agentic data analyst: upload a dataset, ask a question in plain English, and a Gemini-driven planner hands off to a local Qwen2.5-Coder worker that writes and runs the analysis inside an isolated, memory-capped sandbox — auto-retrying from its own errors. Alongside that I've built a distributed ML task scheduler (LCACS) that cuts makespan 49.4% below the HEFT baseline, and a self-serve inference platform (ModelDeploy) serving PyTorch and scikit-learn models behind a JWT-gated API.
>
> Infra and DevOps run underneath all of it, not apart from it — as Server Head at CRISPR Tech Club I run monitoring and CI/CD for a 2,000+ user platform, which is usually what keeps AI systems like these actually shippable instead of staying research code.

### Stack (reordered, AI first)
- **AI / agentic systems:** PyTorch, TensorFlow, Keras, Scikit-learn, HuggingFace Transformers, LangChain, LangGraph, RAG, Vector databases (Pinecone), Prompt engineering, Multi-agent systems, OpenCV, YOLOv4, DINOv2, SegFormer, DeepLabV3
- **Backend & data:** Django (DRF), FastAPI, Flask, Node.js, Express.js, Strapi, PostgreSQL, MySQL, MongoDB, Redis
- **DevOps / infra:** Docker, Nginx, Prometheus, Grafana, Coolify, CI/CD, Linux
- **Languages & core:** Python, C/C++, Java, JavaScript, SQL

### Projects
1. **LCACS — Distributed ML Task Scheduler** *(research project, in development)*
   Hook: "Decides which node runs which task in a distributed ML training job — not just dependency order, but compute cost, network contention, and load balance too."
   - Models the training job as a DAG, resolves execution order via topological sort in O(T·W + T + E)
   - Benchmarked in simulation against the classical HEFT scheduler
   - Metric: **49.4% lower makespan vs. HEFT**, 93–99% cluster utilization
   - Tags: Distributed systems, DAG scheduling, Simulation

2. **Enterprise Agentic Data Analyst Engine**
   Hook: "Upload a dataset, ask a question in plain English — an AI agent writes and runs the analysis code for you, inside a sandbox."
   - Splits planning from execution: Gemini plans the steps, a local Qwen2.5-Coder model writes the code — keeps it usable on 8GB RAM / CPU-only hardware
   - Thread-safe, network-isolated, 512MB memory-capped Docker sandbox; failed runs feed their traceback back to the model to self-correct and re-run
   - Caches successful runs by a hash of task + dataset schema; multi-key API rotation with 429 failover
   - Tags: Agent orchestration, Gemini, Qwen2.5-Coder, Docker sandboxing

3. **ModelDeploy — ML Inference Platform** *(in development)*
   Hook: "Upload a trained model, get an API key, call it over REST — hosted inference without building infra per model."
   - FastAPI worker pool (via `uv`) spins up isolated per-model environments in seconds, instead of a Docker image per model
   - Framework-agnostic RunnerFactory serves scikit-learn and PyTorch models through privilege-dropped subprocesses
   - JWT + API-key gateway, Redis-backed rate limiting
   - Metric: **~2ms routing/inference latency** *(see §13 — two slightly different figures across your resumes)*
   - Tags: Django, FastAPI, Redis, Docker

4. **Semantic Scene Segmentation — Off-Road Navigation**
   Hook: "Compares how a CNN and a transformer 'see' terrain, then combines them for real-time off-road path planning."
   - Benchmarked DeepLabV3 (CNN) vs. DINOv2 (ViT) plus a custom decoder across 8,000 terrain images
   - Integrated A* pathfinding on the predicted obstacle grid
   - Metric: **56% mIoU** across 10 classes, sub-100ms inference latency
   - Tags: PyTorch, OpenCV, Streamlit, Computer vision

5. **Plastic Waste Detector**
   Hook: "Real-time detection and classification of plastic waste for automated sorting."
   - Fine-tuned YOLOv4 via transfer learning; classifies 6 plastic types
   - Metric: 70%+ accuracy on 50×50px objects, **2nd place among 150+ teams** at a national hackathon
   - Tags: YOLOv4, TensorFlow, OpenCV

### Log (experience)
1. `a3f9c1` — **Server Head** @ CRISPR Tech Club — *2025–Present (see §13)*
   "Migrated campus services to a self-hosted Coolify CI/CD platform on a newly provisioned VM, configuring virtual networking end-to-end. Built a Prometheus + Grafana monitoring stack maintaining 99% uptime for 2,000+ users. Designed a sandboxed Docker-based CTF for 100+ junior developers, each isolated via SSH-accessible containers testing secure tunneling and reverse-proxy configuration."

2. `7d2e08` — **Backend Developer** @ Pravesh — *2024–Present · live on Play Store · pravesh.iiitn.ac.in*
   "Built and shipped the backend for an institution-wide entry/exit management system. Designed REST APIs (Node.js, Strapi) handling 1,000+ daily QR validations and real-time access logs for 2,000+ active users across multiple roles. Containerized the app with Nginx reverse proxies for zero-downtime production deploys."

3. `1b6a44` — **CTF Challenge Designer** @ EnigmaXplore 3.0 — *2025*
   "Designed cryptography challenges (RSA, AES, ECC, isogeny) for a global cybersecurity competition *(participant/country count flagged — see §13)*. Developed complex mathematical vulnerabilities requiring custom solver scripts, resulting in the event's lowest solve rates."

4. `e91f2a` — **Education** — IIIT Nagpur, B.Tech CSE (Data Science & Analytics) — *2024–2028*
   "CGPA 8.56/10. Coursework: DSA, OOP, DBMS, OS, Computer Networks, Compiler Design, ML, DL."

### Stats
- LeetCode: Knight — 1850+ rating · *400+ or 500+ solved, flagged, see §13*
- Codeforces: Specialist — 1400+ rating · 200+ solved

### Contact — real links
- Email: `shriharitelang06@gmail.com`
- GitHub: `github.com/SSHRIHARI006`
- LinkedIn: `linkedin.com/in/shriharitelang06`
- LeetCode: `leetcode.com/u/Shrihari06`
- Codeforces: `codeforces.com/profile/shriharitelang06`
- `STATUS="open to AI/ML internships"` *(carried over from prior draft — confirm still accurate)*

### Footer
`built by shri · rendered [current year] · uptime HH:MM:SS`

---

## 13. Content discrepancies to confirm before build

Your two resumes (and my prior notes) don't fully agree. Flagging rather than guessing:

| Item | SWE resume | AI resume | Used in this doc |
|---|---|---|---|
| CGPA | 8.56 | 8.56 | 8.56 (both agree — differs from 8.83 I had from earlier context, resume wins) |
| LeetCode problems solved | 500+ | 400+ | Left as "400+ or 500+" — pick one |
| Server Head tenure | 2025–2026 | 2025–Present | Used "2025–Present" — confirm this is current |
| EnigmaXplore participants | 1,000+ participants, 30+ countries | 500+ participants, 30+ countries | Left unspecified in copy — pick one |
| EnigmaXplore crypto topics | RSA, ECC, Isogeny | RSA, AES, ECC, isogeny | Used the AI resume's fuller list (includes AES) |
| ModelDeploy latency figure | "sub-2ms routing latency" | "2ms cached inference latency" | Written as "~2ms" — these may describe different things (routing vs. cached inference), worth a precise pass |

None of these block starting on Stitch mockups — they're all copy-level fixes, not structural ones.
