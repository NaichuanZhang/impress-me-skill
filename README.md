# Impress Me Skill

A Claude Code skill that performs deep web research on any topic, generates a beautiful interactive HTML research page, and includes a built-in AI chat assistant powered by Claude Agent SDK.

## What It Does

1. **Deep Research** - Searches the web using multiple queries, reads and evaluates sources, compiles structured findings into markdown
2. **Beautiful Presentation** - Generates a single-file HTML research page with scroll-snap sections, distinctive typography, CSS animations, and responsive design
3. **Interactive Chat** - Select any text on the page, click "Ask about this", and chat with an AI assistant that has full context of the research

## Features

- **Hybrid scroll-snap layout** - Key sections snap into view for impact; long-form analysis sections scroll naturally
- **6 curated style presets** - Scholarly Dusk, Research Lab, Midnight Journal, Paper Trail, Signal Report, Neon Dispatch
- **Zero-dependency HTML** - Single file with all CSS/JS inline, no build tools needed
- **Select-to-chat** - Right-side slide-in panel with streaming responses via SSE
- **Research artifacts** - Structured markdown files (summary, detailed notes, sources) alongside the presentation

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

Download `impress-me-skill.zip` from releases, then:

```bash
unzip impress-me-skill.zip -d ~/.claude/skills/
```

## Usage

Once installed, the skill triggers automatically in Claude Code when you ask to research a topic:

```
research quantum computing breakthroughs
```

```
deep dive into the current state of AI regulation in the EU
```

```
create a research page about renewable energy trends
```

The skill walks through a phased workflow:
1. **Research Planning** - Confirm topic, depth, and style preferences
2. **Research Execution** - Web search, source reading, compilation
3. **Style Discovery** - Preview and pick a visual style
4. **Page Generation** - Single-file HTML with inline CSS/JS + chat UI
5. **Server Generation** - Node.js chat server using Claude Agent SDK
6. **Delivery** - Open in browser, instructions for chat server

## Chat Server Setup

The generated research page includes a chat feature. To enable it:

```bash
cd {your-research-topic}/
npm install
node server.js
```

Open `http://localhost:3737` in your browser. Select any text and click "Ask about this".

### Auth Configuration

The Claude Agent SDK reads auth from environment variables:

- **Amazon Bedrock**: `export CLAUDE_CODE_USE_BEDROCK=1` + AWS credentials
- **Google Vertex AI**: `export CLAUDE_CODE_USE_VERTEX=1` + Google Cloud credentials
- **Direct API**: `export ANTHROPIC_API_KEY=your-key`

## File Structure

```
impress-me-skill/
├── SKILL.md                          # Main workflow (7 phases)
├── STYLE_PRESETS.md                  # 6 visual presets with CSS variables
├── references/
│   ├── research-methodology.md       # Search strategy, source evaluation
│   └── chat-integration.md           # Chat panel, SSE client patterns
├── assets/
│   ├── html-template.html            # HTML template with scroll-snap + chat UI
│   ├── viewport-research.css         # Responsive CSS base
│   ├── server-template.js            # Node.js chat server template
│   └── package-template.json         # npm dependencies
```

## License

MIT
