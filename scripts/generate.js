#!/usr/bin/env node
/**
 * Research Page Generator
 *
 * Takes a research-config.json and outputs a ready-to-serve project folder
 * with index.html, server.js, and package.json.
 *
 * Usage:
 *   node generate.js <config.json> <output-dir>
 *
 * The config.json schema is documented in assets/config-schema.json.
 */

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Style Presets (embedded from STYLE_PRESETS.md)
// ---------------------------------------------------------------------------

const PRESETS = {
    'scholarly-dusk': {
        fontLink: 'https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,700;1,400&family=Source+Sans+3:wght@400;600&display=swap',
        fontDisplay: "'Newsreader', serif",
        fontBody: "'Source Sans 3', sans-serif",
        fontMono: "'IBM Plex Mono', monospace",
        colors: {
            '--bg-primary': '#1a1a2e', '--bg-section': '#16213e', '--bg-section-alt': '#1a1a2e',
            '--text-primary': '#e8e6e3', '--text-secondary': '#8b8fa3',
            '--accent': '#e2b714', '--accent-muted': 'rgba(226, 183, 20, 0.15)',
            '--card-bg': 'rgba(255, 255, 255, 0.04)', '--border': 'rgba(255, 255, 255, 0.08)',
            '--chat-bg': '#16213e', '--chat-border': 'rgba(226, 183, 20, 0.2)',
        },
    },
    'research-lab': {
        fontLink: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=IBM+Plex+Sans:wght@400;500&family=IBM+Plex+Mono:wght@400&display=swap',
        fontDisplay: "'Space Grotesk', sans-serif",
        fontBody: "'IBM Plex Sans', sans-serif",
        fontMono: "'IBM Plex Mono', monospace",
        colors: {
            '--bg-primary': '#0d1117', '--bg-section': '#161b22', '--bg-section-alt': '#0d1117',
            '--text-primary': '#c9d1d9', '--text-secondary': '#8b949e',
            '--accent': '#58a6ff', '--accent-muted': 'rgba(88, 166, 255, 0.1)',
            '--card-bg': '#21262d', '--border': '#30363d',
            '--chat-bg': '#161b22', '--chat-border': '#30363d',
        },
    },
    'midnight-journal': {
        fontLink: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Lora:ital,wght@0,400;0,500;1,400&display=swap',
        fontDisplay: "'Playfair Display', serif",
        fontBody: "'Lora', serif",
        fontMono: "'IBM Plex Mono', monospace",
        colors: {
            '--bg-primary': '#0f0f0f', '--bg-section': '#1a1a1a', '--bg-section-alt': '#141414',
            '--text-primary': '#e8e4df', '--text-secondary': '#9a9590',
            '--accent': '#d4a574', '--accent-muted': 'rgba(212, 165, 116, 0.15)',
            '--card-bg': 'rgba(255, 255, 255, 0.03)', '--border': 'rgba(255, 255, 255, 0.06)',
            '--chat-bg': '#1a1a1a', '--chat-border': 'rgba(212, 165, 116, 0.2)',
        },
    },
    'paper-trail': {
        fontLink: 'https://fonts.googleapis.com/css2?family=Fraunces:wght@700;900&family=Literata:ital,wght@0,400;0,500;1,400&display=swap',
        fontDisplay: "'Fraunces', serif",
        fontBody: "'Literata', serif",
        fontMono: "'IBM Plex Mono', monospace",
        colors: {
            '--bg-primary': '#faf8f5', '--bg-section': '#faf8f5', '--bg-section-alt': '#f0ece4',
            '--text-primary': '#2c2c2c', '--text-secondary': '#666666',
            '--accent': '#c0392b', '--accent-muted': 'rgba(192, 57, 43, 0.1)',
            '--card-bg': '#ffffff', '--border': '#e0dcd4',
            '--chat-bg': '#ffffff', '--chat-border': '#e0dcd4',
        },
    },
    'signal-report': {
        fontLink: 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap',
        fontDisplay: "'Outfit', sans-serif",
        fontBody: "'Outfit', sans-serif",
        fontMono: "'IBM Plex Mono', monospace",
        colors: {
            '--bg-primary': '#ffffff', '--bg-section': '#ffffff', '--bg-section-alt': '#f7f8fc',
            '--text-primary': '#1a1a2e', '--text-secondary': '#64748b',
            '--accent': '#4361ee', '--accent-muted': 'rgba(67, 97, 238, 0.1)',
            '--card-bg': '#ffffff', '--border': '#e2e8f0',
            '--chat-bg': '#ffffff', '--chat-border': '#e2e8f0',
        },
    },
    'neon-dispatch': {
        fontLink: 'https://api.fontshare.com/v2/css?f[]=clash-display@600,700&f[]=satoshi@400,500&display=swap',
        fontDisplay: "'Clash Display', sans-serif",
        fontBody: "'Satoshi', sans-serif",
        fontMono: "'IBM Plex Mono', monospace",
        colors: {
            '--bg-primary': '#0a0f1c', '--bg-section': '#111827', '--bg-section-alt': '#0a0f1c',
            '--text-primary': '#e0e7ff', '--text-secondary': '#6b7280',
            '--accent': '#00ffcc', '--accent-muted': 'rgba(0, 255, 204, 0.1)',
            '--card-bg': 'rgba(255, 255, 255, 0.03)', '--border': 'rgba(0, 255, 204, 0.15)',
            '--chat-bg': '#111827', '--chat-border': 'rgba(0, 255, 204, 0.2)',
        },
    },
};

// ---------------------------------------------------------------------------
// HTML Escaping
// ---------------------------------------------------------------------------

function esc(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// ---------------------------------------------------------------------------
// Section Generators
// ---------------------------------------------------------------------------

function renderStats(stats) {
    if (!stats || stats.length === 0) return '';
    return stats.map(s =>
        `                    <div class="stat-card">
                        <div class="stat-number counter-animate" data-target="${esc(s.value)}">0</div>
                        <div class="stat-label">${esc(s.label)}</div>
                    </div>`
    ).join('\n');
}

function renderFinding(finding, index) {
    const num = String(index + 1).padStart(2, '0');
    const paragraphs = (finding.paragraphs || [])
        .map(p => `                <p>${esc(p)}</p>`)
        .join('\n');

    let quote = '';
    if (finding.quote && finding.quote.text) {
        quote = `
            <blockquote class="pull-quote reveal" style="margin-top: var(--content-gap);">
                ${esc(finding.quote.text)}
                <cite>${esc(finding.quote.author)}, ${esc(finding.quote.source)}</cite>
            </blockquote>`;
    }

    let callout = '';
    if (finding.dataCallout) {
        callout = `
            <div class="data-callout reveal" style="margin-top: var(--content-gap);">
                ${esc(finding.dataCallout)}
            </div>`;
    }

    let subFindings = '';
    if (finding.subFindings && finding.subFindings.length > 0) {
        subFindings = finding.subFindings.map(sf =>
            `
            <div class="finding-card reveal" style="margin-top: var(--content-gap);">
                <h3>${esc(sf.title)}</h3>
                <p style="margin-top: 0.5rem;">${esc(sf.detail)}</p>
            </div>`
        ).join('');
    }

    return `
    <section class="research-section snap-flow" data-section="finding-${index + 1}" data-label="${esc(finding.title)}">
        <span class="section-number">${num}</span>
        <div class="section-content">
            <h2 class="reveal">${esc(finding.title)}</h2>
            <div class="reveal" style="margin-top: var(--content-gap);">
${paragraphs}
            </div>${quote}${callout}${subFindings}
        </div>
    </section>`;
}

function renderSources(sources) {
    if (!sources || sources.length === 0) return '';
    return sources.map(s => {
        const pill = (s.credibility || 'Medium').toLowerCase() === 'high' ? 'positive'
            : (s.credibility || 'Medium').toLowerCase() === 'low' ? 'caution' : 'info';
        return `                <div class="source-item">
                    <a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.title)}</a>
                    <div class="source-meta">${esc(s.author)} &middot; ${esc(s.date)} &middot; <span class="status-pill ${pill}">${esc(s.credibility || 'Medium')}</span></div>
                </div>`;
    }).join('\n');
}

// ---------------------------------------------------------------------------
// Main Generator
// ---------------------------------------------------------------------------

function generate(config, outputDir) {
    const skillDir = path.resolve(__dirname, '..');
    const assetsDir = path.join(skillDir, 'assets');

    // Resolve style
    const presetName = (config.style && config.style.preset) || 'research-lab';
    const preset = PRESETS[presetName];
    if (!preset) {
        console.error(`Unknown preset: ${presetName}. Available: ${Object.keys(PRESETS).join(', ')}`);
        process.exit(1);
    }

    const fontLink = (config.style && config.style.fontLink) || preset.fontLink;
    const colors = { ...preset.colors, ...(config.style && config.style.colors) };

    // Read base CSS
    const viewportCSS = fs.readFileSync(path.join(assetsDir, 'viewport-research.css'), 'utf-8');

    // Build CSS variables
    const cssVars = Object.entries(colors)
        .map(([k, v]) => `            ${k}: ${v};`)
        .join('\n');

    // Build findings sections
    const findingsHTML = (config.findings || [])
        .map((f, i) => renderFinding(f, i))
        .join('\n');

    // Build data section (only if stats exist)
    const hasDataStats = config.stats && config.stats.length > 0;
    const dataSection = hasDataStats ? `
    <section class="research-section snap-tight" data-section="data" data-label="Data">
        <div class="section-content wide">
            <h2 class="reveal">Key Data Points</h2>
            <div class="stats-grid reveal-stagger" style="margin-top: var(--content-gap);">
${renderStats(config.stats)}
            </div>
        </div>
    </section>` : '';

    // Read the JS from the template (lines 370-689 are pure boilerplate)
    const templateHTML = fs.readFileSync(path.join(assetsDir, 'html-template.html'), 'utf-8');
    const jsMatch = templateHTML.match(/<script>\s*([\s\S]*?)\s*<\/script>/);
    const jsCode = jsMatch ? jsMatch[1] : '';

    // Assemble full HTML
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${esc(config.title)}</title>
    <link rel="stylesheet" href="${esc(fontLink)}">
    <style>
        :root {
${cssVars}
            --font-display: ${preset.fontDisplay};
            --font-body: ${preset.fontBody};
            --font-mono: ${preset.fontMono};
        }

${viewportCSS}

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            background: var(--bg-primary);
            color: var(--text-primary);
            font-family: var(--font-body);
            -webkit-font-smoothing: antialiased;
        }

        h1, h2, h3 {
            font-family: var(--font-display);
            line-height: var(--heading-line-height);
        }

        a { color: var(--accent); text-decoration: none; }
        a:hover { text-decoration: underline; }

        .status-pill { display: inline-block; padding: 2px 10px; border-radius: 12px; font-size: var(--small-size); font-weight: 500; }
        .status-pill.info { background: rgba(88, 166, 255, 0.15); color: var(--accent); }
        .status-pill.positive { background: rgba(63, 185, 80, 0.15); color: #3fb950; }
        .status-pill.caution { background: rgba(210, 153, 34, 0.15); color: #d29922; }
        .status-pill.critical { background: rgba(248, 81, 73, 0.15); color: #f85149; }

        .data-callout { font-family: var(--font-mono); font-size: var(--mono-size); padding: clamp(0.75rem, 2vw, 1.25rem); background: var(--card-bg); border-left: 3px solid var(--accent); border-radius: 0 8px 8px 0; }

        .hero-section {
            background:
                radial-gradient(ellipse at 20% 50%, rgba(88, 166, 255, 0.08) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 20%, rgba(63, 185, 80, 0.05) 0%, transparent 50%),
                var(--bg-section);
        }

        .research-section:nth-child(even) { background: var(--bg-section-alt); }
        .research-section:nth-child(odd) { background: var(--bg-section); }

        .stat-card { background: var(--card-bg); border: 1px solid var(--border); border-top: 3px solid var(--accent); border-radius: 8px; padding: clamp(1rem, 2.5vw, 1.75rem); text-align: center; }
        .stat-number { font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 700; color: var(--accent); line-height: 1; }
        .stat-label { font-size: var(--small-size); color: var(--text-secondary); margin-top: 0.5rem; }

        .finding-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 8px; padding: clamp(1rem, 2.5vw, 2rem); margin-bottom: var(--element-gap); }

        .pull-quote { border-left: 3px solid var(--accent); padding-left: clamp(1rem, 2vw, 1.5rem); font-style: italic; color: var(--text-secondary); }
        .pull-quote cite { display: block; margin-top: 0.5rem; font-size: var(--small-size); font-style: normal; color: var(--accent); }

        .source-item { padding: clamp(0.5rem, 1.5vw, 1rem) 0; border-bottom: 1px solid var(--border); }
        .source-item:last-child { border-bottom: none; }
        .source-item a { font-weight: 500; display: block; margin-bottom: 4px; }
        .source-meta { font-size: var(--small-size); color: var(--text-secondary); }

        .scroll-indicator { position: absolute; bottom: clamp(1rem, 3vh, 2.5rem); left: 50%; transform: translateX(-50%); font-size: 1.5rem; color: var(--text-secondary); animation: bounce 2s ease-in-out infinite; }
        @keyframes bounce { 0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); } 40% { transform: translateX(-50%) translateY(-8px); } 60% { transform: translateX(-50%) translateY(-4px); } }

        .meta { display: flex; gap: clamp(0.75rem, 2vw, 1.5rem); font-size: var(--small-size); color: var(--text-secondary); flex-wrap: wrap; }
        .meta span { display: flex; align-items: center; gap: 4px; }
    </style>
</head>
<body>
    <div class="reading-progress" id="readingProgress"></div>
    <nav class="nav-dots" id="navDots" aria-label="Section navigation"></nav>

    <section class="research-section snap-tight hero-section" data-section="hero" data-label="Hero">
        <div class="section-content">
            <span class="section-label reveal">RESEARCH REPORT</span>
            <h1 class="reveal" style="margin-top: var(--element-gap);">${esc(config.title)}</h1>
            <p class="reveal" style="font-size: clamp(1rem, 2vw, 1.35rem); color: var(--text-secondary); margin-top: var(--element-gap); max-width: 50ch;">
                ${esc(config.subtitle)}
            </p>
            <div class="meta reveal" style="margin-top: var(--content-gap);">
                <span>${esc(config.date)}</span>
                <span>${config.sourceCount || (config.sources || []).length} sources</span>
                <span>${config.readingTime || '?'} min read</span>
            </div>
        </div>
        <div class="scroll-indicator reveal">&#8595;</div>
    </section>

    <section class="research-section snap-tight" data-section="summary" data-label="Summary">
        <div class="section-content">
            <h2 class="reveal">Executive Summary</h2>
            <div class="reveal" style="margin-top: var(--content-gap);">
                <div class="stats-grid reveal-stagger" style="margin-top: var(--content-gap);">
${renderStats(config.stats)}
                </div>
            </div>
        </div>
    </section>
${findingsHTML}
${dataSection}

    <section class="research-section snap-flow" data-section="sources" data-label="Sources">
        <div class="section-content">
            <h2 class="reveal">Sources &amp; References</h2>
            <div class="source-list reveal" style="margin-top: var(--content-gap);">
${renderSources(config.sources)}
            </div>
        </div>
    </section>

    <div class="chat-popover" id="chatPopover" style="display: none;">
        <button class="chat-popover-btn" id="chatPopoverBtn">Ask about this &#8594;</button>
    </div>

    <div class="chat-panel" id="chatPanel">
        <div class="chat-header">
            <h3>Research Assistant</h3>
            <button class="chat-close" id="chatClose" aria-label="Close chat">&times;</button>
        </div>
        <div class="chat-context" id="chatContext" style="display: none;">
            <div class="chat-context-label">Selected context</div>
            <div class="chat-context-text" id="chatContextText"></div>
        </div>
        <div class="chat-messages" id="chatMessages"></div>
        <div class="chat-input-area">
            <textarea id="chatInput" placeholder="Ask a follow-up question..." rows="1"></textarea>
            <button class="chat-send" id="chatSend" aria-label="Send message">Send</button>
        </div>
    </div>

    <script>
${jsCode}
    </script>
</body>
</html>`;

    // Create output directory
    fs.mkdirSync(outputDir, { recursive: true });
    fs.mkdirSync(path.join(outputDir, 'research'), { recursive: true });

    // Write index.html
    fs.writeFileSync(path.join(outputDir, 'index.html'), html, 'utf-8');

    // Copy server.js verbatim
    fs.copyFileSync(
        path.join(assetsDir, 'server-template.js'),
        path.join(outputDir, 'server.js')
    );

    // Generate package.json
    const slug = (config.title || 'research')
        .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const pkgTemplate = fs.readFileSync(path.join(assetsDir, 'package-template.json'), 'utf-8');
    const pkg = pkgTemplate
        .replace('TOPIC_SLUG', slug)
        .replace('TOPIC_NAME', config.title || 'Research');
    fs.writeFileSync(path.join(outputDir, 'package.json'), pkg, 'utf-8');

    console.log(`\n  Generated research page in: ${outputDir}/`);
    console.log(`  Files: index.html, server.js, package.json, research/\n`);
    console.log(`  To start:`);
    console.log(`    cd ${outputDir}`);
    console.log(`    npm install`);
    console.log(`    node server.js\n`);
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
if (args.length < 2) {
    console.error('Usage: node generate.js <config.json> <output-dir>');
    process.exit(1);
}

const configPath = path.resolve(args[0]);
const outputDir = path.resolve(args[1]);

if (!fs.existsSync(configPath)) {
    console.error(`Config file not found: ${configPath}`);
    process.exit(1);
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
generate(config, outputDir);
