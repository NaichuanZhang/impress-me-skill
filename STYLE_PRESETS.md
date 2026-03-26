# Style Presets Reference

Curated visual styles for Deep Research pages. Each preset is optimized for long-form reading, data presentation, and research credibility. **Abstract shapes only — no illustrations.**

**Viewport CSS:** For mandatory base styles, see [viewport-research.css](assets/viewport-research.css). Include in every research page.

---

## Dark Themes

### 1. Scholarly Dusk

**Vibe:** Academic, authoritative, deep thinking

**Layout:** Full-width sections on deep navy. Gold accent highlights on key findings. Pull quotes with left gold border.

**Typography:**
- Display: `Newsreader` (400/700) — editorial serif with personality
- Body: `Source Sans 3` (400/600) — highly readable for long text

**Font Link:**
```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,700;1,400&family=Source+Sans+3:wght@400;600&display=swap">
```

**Colors:**
```css
:root {
    --bg-primary: #1a1a2e;
    --bg-section: #16213e;
    --bg-section-alt: #1a1a2e;
    --text-primary: #e8e6e3;
    --text-secondary: #8b8fa3;
    --accent: #e2b714;
    --accent-muted: rgba(226, 183, 20, 0.15);
    --card-bg: rgba(255, 255, 255, 0.04);
    --border: rgba(255, 255, 255, 0.08);
    --chat-bg: #16213e;
    --chat-border: rgba(226, 183, 20, 0.2);
}
```

**Signature Elements:**
- Gold accent highlights on key data and findings
- Subtle grain texture background (inline SVG noise filter)
- Thin gold horizontal rules between sections
- Pull quotes with thick left gold border
- Stat cards with frosted glass effect (`backdrop-filter: blur(12px)`)
- Section numbers in gold with serif font

---

### 2. Research Lab

**Vibe:** Technical, precise, data-driven

**Layout:** GitHub-dark inspired. Grid background pattern. Colored status indicators on findings.

**Typography:**
- Display: `Space Grotesk` (500/700)
- Body: `IBM Plex Sans` (400/500)
- Mono: `IBM Plex Mono` (400) — for data callouts and code

**Font Link:**
```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=IBM+Plex+Sans:wght@400;500&family=IBM+Plex+Mono:wght@400&display=swap">
```

**Colors:**
```css
:root {
    --bg-primary: #0d1117;
    --bg-section: #161b22;
    --bg-section-alt: #0d1117;
    --text-primary: #c9d1d9;
    --text-secondary: #8b949e;
    --accent: #58a6ff;
    --accent-green: #3fb950;
    --accent-orange: #d29922;
    --accent-red: #f85149;
    --card-bg: #21262d;
    --border: #30363d;
    --chat-bg: #161b22;
    --chat-border: #30363d;
}
```

**Signature Elements:**
- Subtle dot grid background pattern (CSS radial-gradient)
- Colored status pills on findings: blue (info), green (positive), orange (caution), red (critical)
- Monospace data callouts with left accent border
- Terminal-style source list with `>` prefix
- Stat cards with solid backgrounds and top-colored border
- Section headers with `##` prefix in monospace

---

### 3. Midnight Journal

**Vibe:** Contemplative, immersive, long-read

**Layout:** Generous whitespace. Large pull quotes. Warm amber accents on charcoal.

**Typography:**
- Display: `Playfair Display` (400/700)
- Body: `Lora` (400/500) — warm readable serif for extended reading

**Font Link:**
```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Lora:ital,wght@0,400;0,500;1,400&display=swap">
```

**Colors:**
```css
:root {
    --bg-primary: #0f0f0f;
    --bg-section: #1a1a1a;
    --bg-section-alt: #141414;
    --text-primary: #e8e4df;
    --text-secondary: #9a9590;
    --accent: #d4a574;
    --accent-muted: rgba(212, 165, 116, 0.15);
    --card-bg: rgba(255, 255, 255, 0.03);
    --border: rgba(255, 255, 255, 0.06);
    --chat-bg: #1a1a1a;
    --chat-border: rgba(212, 165, 116, 0.2);
}
```

**Signature Elements:**
- Warm amber accent color for highlights and borders
- Atmospheric gradient backgrounds (subtle radial orbs)
- Very generous whitespace — content breathes
- Large serif pull quotes centered with thin amber rules above and below
- Reading-focused minimalism — no decorative clutter
- Subtle animated gradient orbs on hero section (CSS only)

---

## Light Themes

### 4. Paper Trail

**Vibe:** Editorial, literary, thoughtful, print-magazine

**Layout:** Cream paper feel with alternating section backgrounds. Drop caps on section openers. Elegant horizontal rules.

**Typography:**
- Display: `Fraunces` (700/900) — distinctive variable serif
- Body: `Literata` (400/500) — designed for long reading sessions

**Font Link:**
```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:wght@700;900&family=Literata:ital,wght@0,400;0,500;1,400&display=swap">
```

**Colors:**
```css
:root {
    --bg-primary: #faf8f5;
    --bg-section: #faf8f5;
    --bg-section-alt: #f0ece4;
    --text-primary: #2c2c2c;
    --text-secondary: #666666;
    --accent: #c0392b;
    --accent-muted: rgba(192, 57, 43, 0.1);
    --card-bg: #ffffff;
    --border: #e0dcd4;
    --chat-bg: #ffffff;
    --chat-border: #e0dcd4;
}
```

**Signature Elements:**
- Drop caps on first paragraph of each finding section (`:first-letter` pseudo-element)
- Elegant horizontal rules between sections (CSS-drawn ornamental: circle-line-circle)
- Large serif quotation marks on pull quotes
- Cream/white alternating section backgrounds for rhythm
- Red accent for key data points and statistics
- Small caps for section labels

---

### 5. Signal Report

**Vibe:** Modern, clean, business intelligence

**Layout:** White card-based layout. Colored severity badges. Data-forward with large metric numbers.

**Typography:**
- Display: `Outfit` (600/700)
- Body: `Outfit` (400/500)

**Font Link:**
```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap">
```

**Colors:**
```css
:root {
    --bg-primary: #ffffff;
    --bg-section: #ffffff;
    --bg-section-alt: #f7f8fc;
    --text-primary: #1a1a2e;
    --text-secondary: #64748b;
    --accent: #4361ee;
    --accent-success: #10b981;
    --accent-warning: #f59e0b;
    --accent-danger: #ef4444;
    --card-bg: #ffffff;
    --border: #e2e8f0;
    --chat-bg: #ffffff;
    --chat-border: #e2e8f0;
}
```

**Signature Elements:**
- Clean card-based layout with subtle shadows
- Colored severity/category badges (blue, green, amber, red pills)
- Metric cards with oversized numbers and small labels below
- Left-border colored cards for key findings (4px solid accent border)
- Minimal decoration — data speaks
- Breadcrumb-style section navigation

---

## Specialty Theme

### 6. Neon Dispatch

**Vibe:** Futuristic, investigative, cutting-edge

**Layout:** Deep navy with cyan/magenta neon accents. Grid pattern overlay. Glow effects on stat cards.

**Typography:**
- Display: `Clash Display` (600/700) — Fontshare
- Body: `Satoshi` (400/500) — Fontshare

**Font Link:**
```html
<link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=clash-display@600,700&f[]=satoshi@400,500&display=swap">
```

**Colors:**
```css
:root {
    --bg-primary: #0a0f1c;
    --bg-section: #111827;
    --bg-section-alt: #0a0f1c;
    --text-primary: #e0e7ff;
    --text-secondary: #6b7280;
    --accent: #00ffcc;
    --accent-secondary: #ff00aa;
    --accent-muted: rgba(0, 255, 204, 0.1);
    --card-bg: rgba(255, 255, 255, 0.03);
    --border: rgba(0, 255, 204, 0.15);
    --chat-bg: #111827;
    --chat-border: rgba(0, 255, 204, 0.2);
}
```

**Signature Elements:**
- Cyan and magenta neon accent colors
- Subtle grid pattern background (CSS linear-gradient)
- Glow effects on stat cards (`box-shadow` with accent color)
- Scan-line CSS animation on hero section
- Data visualized with horizontal colored bars
- `CLASSIFIED` / `DISPATCH` labels in monospace

---

## Style Mood Mapping

When choosing a preset based on the research topic, use this guide:

| Research Topic Mood | Primary Preset | Alternatives |
|---------------------|---------------|-------------|
| Academic / Scientific | Scholarly Dusk | Research Lab, Paper Trail |
| Business / Market Analysis | Signal Report | Research Lab, Scholarly Dusk |
| Cultural / Social / History | Paper Trail | Midnight Journal, Scholarly Dusk |
| Technology / Innovation | Research Lab | Neon Dispatch, Signal Report |
| Investigative / Deep Dive | Midnight Journal | Neon Dispatch, Paper Trail |
| Futuristic / Speculative | Neon Dispatch | Research Lab, Midnight Journal |

---

## Font Pairing Quick Reference

| Preset | Display Font | Body Font | Source |
|--------|-------------|-----------|--------|
| Scholarly Dusk | Newsreader | Source Sans 3 | Google |
| Research Lab | Space Grotesk | IBM Plex Sans | Google |
| Midnight Journal | Playfair Display | Lora | Google |
| Paper Trail | Fraunces | Literata | Google |
| Signal Report | Outfit | Outfit | Google |
| Neon Dispatch | Clash Display | Satoshi | Fontshare |

---

## DO NOT USE (Generic AI Patterns)

**Fonts:** Inter, Roboto, Arial, system fonts as display

**Colors:** `#6366f1` (generic indigo), purple gradients on white, generic blue (#3b82f6) without context

**Layouts:** Everything centered, identical card grids, generic hero sections

**Decorations:** Realistic illustrations, gratuitous glassmorphism, drop shadows without purpose

---

## CSS Gotchas

### Negating CSS Functions

**WRONG — silently ignored by browsers (no console error):**
```css
right: -clamp(28px, 3.5vw, 44px);   /* Browser ignores this */
```

**CORRECT — wrap in `calc()`:**
```css
right: calc(-1 * clamp(28px, 3.5vw, 44px));  /* Works */
```
