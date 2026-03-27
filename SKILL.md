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

## Quick Start (Generator)

To skip manual template work, build a `research-config.json` and run the generator:

```bash
node ~/.claude/skills/impress-me-skill/scripts/generate.js research-config.json ./output-folder
```

The generator:
- Reads the config, resolves the style preset, inlines all CSS/JS
- Outputs `index.html`, `server.js`, and `package.json` ready to serve
- Config schema: [assets/config-schema.json](assets/config-schema.json)

Then spin up:
```bash
cd ./output-folder && npm install && node server.js
```

## Supporting Files

| File | Purpose | When to Read |
|------|---------|-------------|
| [scripts/generate.js](scripts/generate.js) | Page generator — config in, ready folder out | Phase 4-5 (generation) |
| [assets/config-schema.json](assets/config-schema.json) | JSON schema for research-config.json | Phase 4 (building config) |
| [STYLE_PRESETS.md](STYLE_PRESETS.md) | 6 research-specific visual presets | Phase 3 (style selection) |
| [references/research-methodology.md](references/research-methodology.md) | Search strategy, source evaluation, compilation | Phase 2 (research execution) |
| [references/chat-integration.md](references/chat-integration.md) | Text selection, chat panel, SSE client patterns | Reference only |
| [assets/html-template.html](assets/html-template.html) | HTML structure reference (used by generator) | Reference only |
| [assets/viewport-research.css](assets/viewport-research.css) | Responsive CSS (auto-inlined by generator) | Reference only |
| [assets/server-template.js](assets/server-template.js) | Chat server (copied as-is by generator) | Reference only |
| [assets/package-template.json](assets/package-template.json) | npm package template | Reference only |

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

## Phase 4-5: Generate Research Page + Server

Build a `research-config.json` from the research artifacts and chosen style, then run the generator.

### Step 1: Build research-config.json

Create a JSON file following the schema in [assets/config-schema.json](assets/config-schema.json):

```json
{
  "title": "Topic Title",
  "subtitle": "Key finding or hook",
  "date": "March 2026",
  "readingTime": 12,
  "style": { "preset": "research-lab" },
  "stats": [
    { "value": "85%", "label": "Market Growth" }
  ],
  "findings": [
    {
      "title": "Finding Theme",
      "paragraphs": ["Analysis paragraph 1", "Analysis paragraph 2"],
      "quote": { "text": "Notable quote", "author": "Author", "source": "Source" },
      "dataCallout": "Key statistic or data point"
    }
  ],
  "sources": [
    { "title": "Source Title", "url": "https://...", "author": "Org", "date": "2026", "credibility": "High" }
  ]
}
```

Populate from:
- `research/summary.md` → `title`, `subtitle`, `stats`
- `research/detailed.md` → `findings` (one per theme, with quotes and data callouts)
- `research/sources.md` → `sources`
- Phase 3 style choice → `style.preset`

Available presets: `scholarly-dusk`, `research-lab`, `midnight-journal`, `paper-trail`, `signal-report`, `neon-dispatch`

### Step 2: Run the generator

```bash
node ~/.claude/skills/impress-me-skill/scripts/generate.js research-config.json ./{topic}
```

This outputs a ready-to-serve folder:
- `index.html` — fully populated, all CSS/JS inlined, chat UI included
- `server.js` — copied from template as-is (zero customization needed)
- `package.json` — dependencies configured
- `research/` — empty directory for research markdown files

### Step 3: Copy research files

Copy the research markdown files into the output folder's `research/` directory so the chat server can load them as context.

### Auth Configuration

The Claude Agent SDK reads auth from environment variables automatically:
- **Amazon Bedrock:** `CLAUDE_CODE_USE_BEDROCK=1` + AWS credentials
- **Google Vertex AI:** `CLAUDE_CODE_USE_VERTEX=1` + Google Cloud credentials
- **Direct API:** `ANTHROPIC_API_KEY` environment variable

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
