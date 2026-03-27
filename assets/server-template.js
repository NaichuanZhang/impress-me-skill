#!/usr/bin/env node
/**
 * Research Chat Server
 *
 * This file is used AS-IS. Copy directly as server.js — no customization needed.
 * It auto-loads research context from the research/ directory on startup.
 *
 * Usage:
 *   npm install
 *   node server.js
 *
 * Auth (one of these must be configured):
 *   - Bedrock: set CLAUDE_CODE_USE_BEDROCK=1 + AWS credentials
 *   - Vertex AI: set CLAUDE_CODE_USE_VERTEX=1 + Google Cloud credentials
 *   - Direct API: set ANTHROPIC_API_KEY
 *
 * The Agent SDK picks up auth from environment variables automatically.
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3737;

// ---------------------------------------------------------------------------
// Research Context Loading
// ---------------------------------------------------------------------------

function safeReadFile(filePath) {
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    return "";
  }
}

function loadResearchContext() {
  const dir = __dirname;
  return {
    summary: safeReadFile(path.join(dir, "research", "summary.md")),
    detailed: safeReadFile(path.join(dir, "research", "detailed.md")),
    sources: safeReadFile(path.join(dir, "research", "sources.md")),
  };
}

function buildSystemPrompt(context) {
  return [
    "You are a research assistant with deep knowledge of the following research.",
    "Answer questions accurately based on this research. Cite specific sources when possible.",
    "If the user selects text from the research page, use that as primary context.",
    "Be concise but thorough. Use markdown formatting in responses.",
    "",
    "## Research Summary",
    context.summary,
    "",
    "## Detailed Research",
    context.detailed,
    "",
    "## Sources",
    context.sources,
  ].join("\n");
}

// ---------------------------------------------------------------------------
// Claude Agent SDK Integration
// ---------------------------------------------------------------------------

let queryFn = null;

async function initSDK() {
  try {
    const sdk = require("@anthropic-ai/claude-agent-sdk");
    queryFn = sdk.query;
    console.log("  Using Claude Agent SDK");
  } catch {
    console.error("\n  ERROR: @anthropic-ai/claude-agent-sdk not found.");
    console.error("  Run: npm install\n");
    process.exit(1);
  }
}

async function streamChat(
  res,
  systemPrompt,
  selectedText,
  question,
  conversationHistory,
) {
  // Build the prompt for the Agent SDK
  const contextPart = selectedText
    ? `Context (selected text from research): "${selectedText}"\n\nQuestion: ${question}`
    : question;

  // Include conversation history as a formatted prompt
  let fullPrompt = systemPrompt + "\n\n";

  if (conversationHistory && conversationHistory.length > 0) {
    fullPrompt += "## Previous Conversation\n";
    for (const msg of conversationHistory) {
      const role = msg.role === "user" ? "Human" : "Assistant";
      fullPrompt += `${role}: ${msg.content}\n\n`;
    }
  }

  fullPrompt += `Human: ${contextPart}`;

  try {
    for await (const message of queryFn({
      prompt: fullPrompt,
      options: {
        allowedTools: [],
        maxTurns: 1,
      },
    })) {
      // The Agent SDK emits various message types
      // Look for assistant text content
      if (message.type === "assistant" && message.message) {
        // message.message contains the content blocks
        const content = message.message.content || [];
        for (const block of content) {
          if (block.type === "text") {
            res.write(`data: ${JSON.stringify({ text: block.text })}\n\n`);
          }
        }
      }
      // Handle result message (final output)
      if (message.type === "result" && message.result) {
        res.write(`data: ${JSON.stringify({ text: message.result })}\n\n`);
      }
    }
  } catch (err) {
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
  }

  res.write("data: [DONE]\n\n");
  res.end();
}

// ---------------------------------------------------------------------------
// HTTP Server
// ---------------------------------------------------------------------------

const MIME_TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
};

function serveStatic(res, filePath) {
  const ext = path.extname(filePath);
  const mime = MIME_TYPES[ext] || "application/octet-stream";
  try {
    const content = fs.readFileSync(filePath);
    res.writeHead(200, { "Content-Type": mime });
    res.end(content);
  } catch {
    res.writeHead(404);
    res.end("Not Found");
  }
}

async function startServer() {
  await initSDK();

  const context = loadResearchContext();
  const systemPrompt = buildSystemPrompt(context);

  if (!context.summary && !context.detailed) {
    console.warn("  Warning: No research files found in research/ directory.");
    console.warn("  Chat will work but without research context.\n");
  }

  const server = http.createServer(async (req, res) => {
    // CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    // Serve index.html
    if (
      req.method === "GET" &&
      (req.url === "/" || req.url === "/index.html")
    ) {
      serveStatic(res, path.join(__dirname, "index.html"));
      return;
    }

    // Chat endpoint — SSE streaming
    if (req.method === "POST" && req.url === "/chat") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", async () => {
        try {
          const { selectedText, question, conversationHistory } =
            JSON.parse(body);

          if (!question || typeof question !== "string") {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "question is required" }));
            return;
          }

          // SSE headers
          res.writeHead(200, {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          });

          await streamChat(
            res,
            systemPrompt,
            selectedText,
            question,
            conversationHistory,
          );
        } catch (err) {
          if (!res.headersSent) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: err.message }));
          } else {
            res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
            res.write("data: [DONE]\n\n");
            res.end();
          }
        }
      });
      return;
    }

    // 404 for everything else
    res.writeHead(404);
    res.end("Not Found");
  });

  server.listen(PORT, () => {
    console.log(`\n  Research server running at http://localhost:${PORT}\n`);
    console.log("  Open this URL in your browser to view the research.");
    console.log('  Select any text and click "Ask about this" to chat.\n');
    console.log("  Press Ctrl+C to stop.\n");
  });
}

startServer();
