---
name: impress-me-skill
description: Perform deep web research on any topic, compile findings into structured markdown, and generate a beautiful interactive HTML research page with scroll-snap sections, rich typography, and a built-in select-to-chat feature powered by Claude Agent SDK. This skill should be used when the user wants to research a topic thoroughly, create an interactive research report, or build a research presentation with AI-powered Q&A. Triggers on requests like "research X", "deep dive into Y", "create a research page about Z".
---

# Deep Research

Perform deep web-based research on any topic and generate an aesthetically pleasing, interactive HTML research page with a built-in AI chat assistant.

## Core Principles

1. **Deep, Verified Research** — Gather information from multiple credible web sources. Minimum 8 sources for any research.
2. **Beautiful, Anti-AI-Slop Design** — Every research page must feel custom-crafted. Distinctive typography, rich animations, no generic aesthetics.
3. **Hybrid Scroll-Snap Layout** — Sections snap into view for impact, but long-form analysis sections scroll naturally for reading comfort.
4. **Zero-Dependency HTML** — Single HTML file with all CSS/JS inline. A companion Node.js server enables the chat feature.
5. **Interactive Chat** — Select any text on the page, click to open a chat panel, ask follow-up questions powered by Claude Agent SDK.

## Design Aesthetics

Create distinctive, custom-crafted research pages. Avoid generic "AI slop" aesthetics:
- **Typography:** Choose distinctive fonts from Fontshare or Google Fonts. Never use Inter, Roboto, Arial, or system fonts.
- **Color & Theme:** Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents.
- **Motion:** CSS-only animations via Intersection Observer. Staggered reveals on scroll create more delight than scattered micro-interactions.
- **Backgrounds:** Create atmosphere — layer CSS gradients, use geometric patterns, add contextual effects.
- **CSS Gotcha:** Never negate CSS functions directly (`-clamp()` is silently ignored). Use `calc(-1 * clamp(...))` instead.

## Supporting Files

| File | Purpose | When to Read |
|------|---------|-------------|
| [STYLE_PRESETS.md](STYLE_PRESETS.md) | 6 research-specific visual presets | Phase 3 (style selection) |
| [references/research-methodology.md](references/research-methodology.md) | Search strategy, source evaluation, compilation | Phase 2 (research execution) |
| [references/chat-integration.md](references/chat-integration.md) | Text selection, chat panel, SSE client patterns | Phase 4 & 5 (generation) |
| [assets/html-template.html](assets/html-template.html) | HTML structure with scroll-snap + chat UI | Phase 4 (page generation) |
| [assets/viewport-research.css](assets/viewport-research.css) | Mandatory responsive CSS base | Phase 4 (page generation) |
| [assets/server-template.js](assets/server-template.js) | Node.js chat server template | Phase 5 (server generation) |
| [assets/package-template.json](assets/package-template.json) | npm package.json template | Phase 5 (server generation) |

## Output Structure

All research output goes into a single folder:

```
{topic}/
├── index.html          # Self-contained research page (inline CSS/JS + chat UI)
├── server.js           # Node.js server (serves page + chat API)
├── package.json        # @anthropic-ai/claude-agent-sdk dependency
├── research/
│   ├── summary.md      # Executive summary (~300-500 words)
│   ├── detailed.md     # Full research organized by theme
│   ├── sources.md      # All sources with URLs + credibility
│   └── raw/            # Raw fetched content snippets
```

---

## Phase 0: Detect Mode

Determine the user's intent:

- **Mode A: New Research** — User provides a topic. Proceed to Phase 1.
- **Mode B: Enhancement** — Research folder already exists. Update or expand existing research, then regenerate the page.
- **Mode C: Presentation Only** — Research markdown files already exist. Skip to Phase 3 to generate the HTML page.

---

## Phase 1: Research Planning

Ask the user with a single AskUserQuestion call (up to 4 questions):

1. **Topic** (header: "Topic"): What topic to research? (Only ask if not already clear from the user's request)
2. **Depth** (header: "Depth"): Options: Quick overview (5-8 sources) / Standard research (10-15 sources) / Deep dive (15-25 sources)
3. **Focus** (header: "Focus"): Any specific angles or sub-topics to prioritize? Options: Let me decide / specific options based on topic
4. **Style** (header: "Style"): Options: Show me options (Recommended) / Pick from presets

Skip questions where the answer is already clear from context.

---

## Phase 2: Research Execution

**Before starting, read [references/research-methodology.md](references/research-methodology.md) for detailed guidelines.**

Execute research in rounds:

### Round 1: Broad Search
- Search the topic with 2-3 varied phrasings using `mcp__searxng__searxng_web_search`
- Identify major themes and key sources

### Round 2: Deep Reading
- For each quality source, fetch full content using `mcp__searxng__web_url_read` or `WebFetch`
- Extract: key claims, data points, quotes, dates

### Round 3: Sub-topic & Recency Searches
- Based on emerging themes, search for specific sub-topics
- Search with recency modifiers for the latest information

### Round 4: Counter-Perspective
- Search for criticism, limitations, or alternative viewpoints
- Ensures balanced, credible research

### Compile Research Artifacts

Create the research folder with these files (formats documented in research-methodology.md):
- `research/summary.md` — Executive summary with key findings and statistics
- `research/detailed.md` — Full research organized by theme with quotes and data
- `research/sources.md` — All sources with URLs, credibility ratings, and usage notes
- `research/raw/` — Relevant content snippets saved per source

---

## Phase 3: Style Discovery

**Read [STYLE_PRESETS.md](STYLE_PRESETS.md) for available presets.**

### If user chose "Show me options":
1. Based on the research topic mood, consult the Style Mood Mapping table in STYLE_PRESETS.md
2. Generate 3 distinct single-section HTML previews (~80-120 lines each)
3. Save to `.claude-design/research-previews/` as `style-a.html`, `style-b.html`, `style-c.html`
4. Open each preview in the browser automatically
5. Ask user to pick via AskUserQuestion (options: Style A / Style B / Style C / Mix elements)

### If user chose "Pick from presets":
- Present the 6 presets by name with their vibe descriptions via AskUserQuestion
- User selects directly

---

## Phase 4: Generate Research Page

**Before generating, read these files:**
- [assets/html-template.html](assets/html-template.html) — HTML architecture and section structure
- [assets/viewport-research.css](assets/viewport-research.css) — Mandatory responsive CSS (include FULL contents inline)
- [references/chat-integration.md](references/chat-integration.md) — Chat UI and SSE client implementation

### Generate `index.html`

Create a single self-contained HTML file with ALL CSS and JS inline:

1. **Font link** from chosen preset (Fontshare or Google Fonts)
2. **CSS custom properties** from chosen preset
3. **Full viewport-research.css** pasted inline
4. **Preset-specific styles** (signature elements from STYLE_PRESETS.md)
5. **Sections** based on research content:
   - Hero/title section (`.snap-tight`) — topic, key stat, date, source count
   - Executive summary (`.snap-tight`) — key findings as stat cards
   - Key findings (`.snap-flow`) — one section per theme, with analysis, quotes, data callouts
   - Data/statistics section (`.snap-tight`) — if research has quantitative data
   - Sources/bibliography (`.snap-flow`) — all cited sources with links
6. **Chat UI** — popover + right-side slide-in panel (from html-template.html)
7. **JavaScript** — reveals, progress bar, nav dots, counters, text selection, chat panel, SSE client

### Content Organization Rules

- Hero section: 1 heading + 1 subtitle + meta bar (date, sources, reading time)
- Summary section: heading + up to 6 stat cards in grid
- Finding sections: heading + section number + paragraphs + optional pull quote + optional data callout
- If a finding section exceeds ~800 words, split into multiple sections
- Sources section: all cited sources as a list with links

### Viewport Rules

- `.snap-tight` sections: `height: 100vh; height: 100dvh; overflow: hidden;`
- `.snap-flow` sections: `min-height: 100vh;` (no max-height, content flows)
- ALL font sizes use `clamp(min, preferred, max)` — never fixed px/rem
- Include `prefers-reduced-motion` support
- Test mental model: content must fit at 1280x720 for tight sections

---

## Phase 5: Generate Server

**Read [assets/server-template.js](assets/server-template.js) as the foundation.**

### Generate `server.js`

Copy the server template and customize:
- Research context is loaded from `research/summary.md` and `research/detailed.md` on startup
- System prompt incorporates the full research context so Claude can answer accurately
- SSE streaming endpoint at `POST /chat`
- Serves `index.html` at `/`
- Port 3737 (configurable via `PORT` env var)

### Generate `package.json`

From [assets/package-template.json](assets/package-template.json), replace:
- `TOPIC_SLUG` with a kebab-case version of the topic
- `TOPIC_NAME` with the readable topic name

### Auth Configuration

The Claude Agent SDK reads auth from environment variables automatically:
- **Amazon Bedrock:** `CLAUDE_CODE_USE_BEDROCK=1` + AWS credentials
- **Google Vertex AI:** `CLAUDE_CODE_USE_VERTEX=1` + Google Cloud credentials
- **Direct API:** `ANTHROPIC_API_KEY` environment variable

No code changes needed — the SDK detects the provider automatically.

---

## Phase 6: Delivery

1. Clean up `.claude-design/research-previews/` if it exists
2. Open `index.html` in the browser
3. Tell the user:
   - Output folder location and file list
   - **To start the chat server:**
     ```
     cd {topic}
     npm install
     node server.js
     ```
   - Server runs at `http://localhost:3737`
   - **Navigation:** scroll through sections (scroll-snap) or use nav dots on the right
   - **Chat:** select any text on the page, click "Ask about this", ask follow-up questions
   - **Auth:** set `CLAUDE_CODE_USE_BEDROCK=1` + AWS credentials (or `ANTHROPIC_API_KEY` for direct API)
   - **Customization:** edit `:root` CSS variables in `index.html` for colors, swap font links for typography
   - Style name, section count, source count
