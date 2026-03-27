# Impress Me Skill

A Claude Code skill that turns any topic into a deep-researched, beautifully designed interactive HTML page with a built-in AI chat assistant.

**Research. Present. Chat.**

---

## Data Flow

```
                         SKILL WORKFLOW
  ┌─────────────────────────────────────────────────────────┐
  │                                                         │
  │   "Research quantum computing"                          │
  │          │                                              │
  │          ▼                                              │
  │   ┌─────────────┐     ┌──────────────────────────┐     │
  │   │ Claude Code  │────▶│  Phase 1: Plan Research   │     │
  │   │ (SKILL.md)   │     │  - Topic, depth, style    │     │
  │   └─────────────┘     └──────────┬───────────────┘     │
  │                                  │                      │
  │                                  ▼                      │
  │                       ┌──────────────────────────┐      │
  │                       │  Phase 2: Web Research    │      │
  │                       │  - searxng / WebFetch     │      │
  │                       │  - 8-25 sources           │      │
  │                       └──────────┬───────────────┘      │
  │                                  │                      │
  │                                  ▼                      │
  │                       ┌──────────────────────────┐      │
  │                       │  research/                │      │
  │                       │  ├── summary.md           │      │
  │                       │  ├── detailed.md          │      │
  │                       │  └── sources.md           │      │
  │                       └──────────┬───────────────┘      │
  │                                  │                      │
  │                                  ▼                      │
  │   ┌──────────────┐    ┌──────────────────────────┐      │
  │   │ Style Preset  │───▶│  Phase 3: Style Pick     │      │
  │   │ (6 options)   │    │  - Preview & choose      │      │
  │   └──────────────┘    └──────────┬───────────────┘      │
  │                                  │                      │
  │                                  ▼                      │
  │   ┌──────────────┐    ┌──────────────────────────┐      │
  │   │ research-     │───▶│  Phase 4-5: Generate      │      │
  │   │ config.json   │    │  ┌────────────────────┐  │      │
  │   └──────────────┘    │  │  generate.js        │  │      │
  │                       │  │  (scripts/)         │  │      │
  │                       │  └────────┬───────────┘  │      │
  │                       └───────────┼──────────────┘      │
  │                                   │                     │
  └───────────────────────────────────┼─────────────────────┘
                                      │
                                      ▼
                           ┌─────────────────────┐
                           │  OUTPUT FOLDER       │
                           │  ├── index.html      │
                           │  ├── server.js       │
                           │  ├── package.json    │
                           │  └── research/       │
                           └──────────┬──────────┘
                                      │
                          ┌───────────┴───────────┐
                          │                       │
                          ▼                       ▼
                   ┌─────────────┐      ┌──────────────────┐
                   │  Browser    │      │  Node.js Server   │
                   │  index.html │◀────▶│  :3737            │
                   │             │ SSE  │  Claude Agent SDK │
                   │  ┌────────┐ │      │  /chat endpoint   │
                   │  │ Select │ │      │                    │
                   │  │ text   │ │      │  research/ loaded  │
                   │  │   ↓    │ │      │  as system prompt  │
                   │  │ Chat   │ │      │                    │
                   │  │ Panel  │ │      └──────────────────┘
                   │  └────────┘ │
                   └─────────────┘
```

---

## Architecture

The skill has three layers:

| Layer | What | Files |
|-------|------|-------|
| **Skill** | Claude Code reads SKILL.md to orchestrate the workflow | `SKILL.md`, `STYLE_PRESETS.md`, `references/` |
| **Generator** | Node.js script that takes config JSON and outputs a ready folder | `scripts/generate.js`, `assets/` |
| **Runtime** | Server serves the page + proxies chat to Claude Agent SDK | `server-template.js` (copied as `server.js`) |

---

## Install

### Option 1: Clone and symlink (recommended)

```bash
git clone git@github.com:NaichuanZhang/impress-me-skill.git
ln -s "$(pwd)/impress-me-skill" ~/.claude/skills/impress-me-skill
```

### Option 2: Copy to skills directory

```bash
git clone git@github.com:NaichuanZhang/impress-me-skill.git
cp -r impress-me-skill ~/.claude/skills/impress-me-skill
```

### Option 3: Download zip

```bash
unzip impress-me-skill.zip -d ~/.claude/skills/
```

---

## Quick Start (Generator)

If you already have research data, skip the Claude workflow and generate directly:

```bash
# 1. Create a config file (see Config Schema below)
# 2. Run the generator
node ~/.claude/skills/impress-me-skill/scripts/generate.js config.json ./my-research

# 3. Start the server
cd ./my-research
npm install
node server.js
# Open http://localhost:3737
```

---

## Usage

Once installed, the skill triggers automatically in Claude Code:

```
research quantum computing breakthroughs
```

```
deep dive into the current state of AI regulation in the EU
```

```
create a research page about renewable energy trends
```

### Phased Workflow

| Phase | What Happens |
|-------|-------------|
| **0. Detect** | Determine mode: new research, enhancement, or presentation-only |
| **1. Plan** | Confirm topic, depth (5-25 sources), focus angles, style preference |
| **2. Research** | Multi-round web search via searxng, source reading, compilation into markdown |
| **3. Style** | Preview 3 style options or pick from 6 presets |
| **4-5. Generate** | Build `research-config.json`, run generator, output `index.html` + `server.js` |
| **6. Deliver** | Open in browser, provide startup instructions |

---

## Style Presets

| Preset | Vibe | Fonts | Theme |
|--------|------|-------|-------|
| `scholarly-dusk` | Academic, authoritative | Newsreader + Source Sans 3 | Dark |
| `research-lab` | Technical, data-driven | Space Grotesk + IBM Plex Sans | Dark |
| `midnight-journal` | Contemplative, immersive | Playfair Display + Lora | Dark |
| `paper-trail` | Editorial, literary | Fraunces + Literata | Light |
| `signal-report` | Modern, business intel | Outfit | Light |
| `neon-dispatch` | Futuristic, investigative | Clash Display + Satoshi | Dark |

### Mood Mapping

| Topic Mood | Recommended |
|-----------|-------------|
| Academic / Scientific | `scholarly-dusk` |
| Business / Market | `signal-report` |
| Cultural / History | `paper-trail` |
| Technology / Innovation | `research-lab` |
| Investigative / Deep Dive | `midnight-journal` |
| Futuristic / Speculative | `neon-dispatch` |

---

## Config Schema

The generator (`scripts/generate.js`) takes a JSON config. Full schema at [`assets/config-schema.json`](assets/config-schema.json).

```json
{
  "title": "The Future of Quantum Computing",
  "subtitle": "How quantum supremacy is reshaping technology",
  "date": "March 2026",
  "readingTime": 12,
  "style": {
    "preset": "research-lab"
  },
  "stats": [
    { "value": "1200+", "label": "Qubits Achieved" },
    { "value": "$65B", "label": "Market by 2030" }
  ],
  "findings": [
    {
      "title": "Hardware Breakthroughs",
      "paragraphs": [
        "Recent advances in superconducting qubit technology...",
        "IBM and Google have demonstrated processors with 1000+ qubits..."
      ],
      "quote": {
        "text": "We are entering the era of quantum utility.",
        "author": "Dario Amodei",
        "source": "MIT Technology Review"
      },
      "dataCallout": "Google's Willow chip: 105 qubits with record-low error rates.",
      "subFindings": [
        { "title": "Error Correction", "detail": "Surface codes now achieve 99.5% fidelity." }
      ]
    }
  ],
  "sources": [
    {
      "title": "Quantum Computing Report 2026",
      "url": "https://example.com/report",
      "author": "MIT Technology Review",
      "date": "Jan 2026",
      "credibility": "High"
    }
  ]
}
```

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Research topic title |
| `subtitle` | string | Key finding or hook |
| `date` | string | Research date |
| `findings` | array | Key findings (1+ required) |
| `sources` | array | Cited sources (1+ required) |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `readingTime` | number | Estimated reading time (minutes) |
| `sourceCount` | number | Override source count (auto-calculated if omitted) |
| `style.preset` | string | Visual preset (defaults to `research-lab`) |
| `style.fontLink` | string | Override preset font URL |
| `style.colors` | object | Override individual CSS variables |
| `stats` | array | Key statistics for summary + data sections |

---

## Chat Server

### Setup

```bash
cd {output-folder}
npm install
node server.js
# Server runs at http://localhost:3737
```

### How Chat Works

1. Open the research page in your browser
2. Select any text on the page
3. A popover appears: **"Ask about this"**
4. Click it to open a right-side chat panel
5. The selected text is pre-loaded as context
6. Type a follow-up question
7. Claude streams a response via SSE, using the full research as context

### Auth

The Claude Agent SDK reads auth from environment variables:

| Provider | Environment Variables |
|----------|----------------------|
| Amazon Bedrock | `CLAUDE_CODE_USE_BEDROCK=1` + AWS credentials |
| Google Vertex AI | `CLAUDE_CODE_USE_VERTEX=1` + GCP credentials |
| Direct API | `ANTHROPIC_API_KEY=your-key` |

---

## File Structure

```
impress-me-skill/
│
├── SKILL.md                            # Main workflow (phases 0-6)
├── STYLE_PRESETS.md                    # 6 visual presets with CSS + fonts
├── README.md                           # This file
│
├── scripts/
│   └── generate.js                     # Config → ready output folder
│
├── assets/
│   ├── config-schema.json              # JSON schema for research-config
│   ├── html-template.html              # HTML template (used by generator)
│   ├── viewport-research.css           # Responsive CSS (auto-inlined)
│   ├── server-template.js              # Chat server (copied as-is)
│   └── package-template.json           # npm package template
│
├── references/
│   ├── research-methodology.md         # Search strategy, source evaluation
│   └── chat-integration.md             # Chat panel, SSE, text selection
│
└── impress-me-skill.zip                # Packaged distribution
```

### Generated Output

```
{topic}/
├── index.html          # Self-contained page (all CSS/JS inline + chat UI)
├── server.js           # Node.js server (serves page + /chat SSE endpoint)
├── package.json        # @anthropic-ai/claude-agent-sdk dependency
└── research/
    ├── summary.md      # Executive summary
    ├── detailed.md     # Full research by theme
    └── sources.md      # All sources with URLs
```

---

## How It Works

### Research Phase

Claude uses `mcp__searxng__searxng_web_search` for web queries and `WebFetch` to read sources. Research executes in rounds: broad search, deep reading, sub-topic refinement, and counter-perspective checks. Results compile into structured markdown.

### Generation Phase

The generator (`scripts/generate.js`):
1. Reads the config JSON
2. Resolves the style preset (fonts, colors, CSS variables)
3. Reads `html-template.html` and `viewport-research.css`
4. Inlines all CSS into the HTML
5. Populates sections from config data (stats, findings, sources)
6. Extracts the JavaScript from the template (chat, animations, navigation)
7. Writes `index.html`, copies `server.js`, generates `package.json`

### Chat Architecture

```
Browser                          Server (:3737)
  │                                │
  │  POST /chat                    │
  │  { selectedText, question,     │
  │    conversationHistory }       │
  │ ─────────────────────────────▶ │
  │                                │  Claude Agent SDK
  │  SSE: data: {"text": "..."}    │  query({ prompt, options })
  │ ◀───────────────────────────── │
  │  SSE: data: {"text": "..."}    │  Streaming response
  │ ◀───────────────────────────── │
  │  SSE: data: [DONE]             │
  │ ◀───────────────────────────── │
```

The server loads `research/summary.md` and `research/detailed.md` on startup as the system prompt, so Claude can answer questions with full research context.

---

## License

MIT
