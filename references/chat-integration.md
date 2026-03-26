# Chat Integration Reference

Architecture and implementation patterns for the select-to-chat feature. Read this reference during Phase 4 (Generate Research Page) and Phase 5 (Generate Server).

## Architecture Overview

```
User selects text on page
    ↓
Chat popover appears near selection
    ↓
User clicks "Ask about this"
    ↓
Right-side chat panel slides open
    ↓
Selected text shown as context
    ↓
User types question → POST /chat (SSE)
    ↓
Server streams response via Claude Agent SDK
    ↓
Response renders in real-time in chat panel
```

## 1. Text Selection Detection

```javascript
// Track current selection for popover positioning
let currentSelection = null;

document.addEventListener('mouseup', (e) => {
    // Ignore clicks inside chat panel
    if (e.target.closest('.chat-panel') || e.target.closest('.chat-popover')) return;

    const selection = window.getSelection();
    const text = selection.toString().trim();

    if (text.length > 5) {
        currentSelection = text;
        showPopover(selection.getRangeAt(0));
    } else {
        hidePopover();
        currentSelection = null;
    }
});

// Hide popover when selection is cleared
document.addEventListener('selectionchange', () => {
    const selection = window.getSelection();
    if (!selection.toString().trim()) {
        hidePopover();
    }
});
```

## 2. Popover Positioning

```javascript
function showPopover(range) {
    const rect = range.getBoundingClientRect();
    const popover = document.getElementById('chatPopover');

    // Position above the selection, centered
    let top = rect.top - popover.offsetHeight - 8 + window.scrollY;
    let left = rect.left + (rect.width / 2) - (popover.offsetWidth / 2);

    // Viewport boundary checks
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Keep within horizontal bounds
    left = Math.max(8, Math.min(left, vw - popover.offsetWidth - 8));

    // If not enough space above, position below
    if (rect.top < popover.offsetHeight + 16) {
        top = rect.bottom + 8 + window.scrollY;
    }

    popover.style.top = top + 'px';
    popover.style.left = left + 'px';
    popover.style.display = 'block';
}

function hidePopover() {
    document.getElementById('chatPopover').style.display = 'none';
}
```

## 3. Chat Panel State Management

```javascript
const chatState = {
    open: false,
    selectedText: '',
    conversationHistory: [],
    isStreaming: false
};

function openChat(selectedText) {
    chatState.open = true;
    chatState.selectedText = selectedText;
    // Reset conversation for new context
    chatState.conversationHistory = [];

    const panel = document.getElementById('chatPanel');
    panel.classList.add('open');

    // Show context
    const contextEl = document.getElementById('chatContext');
    if (selectedText) {
        contextEl.style.display = 'block';
        contextEl.querySelector('.chat-context-text').textContent = selectedText;
    } else {
        contextEl.style.display = 'none';
    }

    // Clear previous messages
    document.getElementById('chatMessages').innerHTML = '';

    // Focus input
    document.getElementById('chatInput').focus();

    // Trap focus in panel for accessibility
    panel.addEventListener('keydown', handlePanelKeydown);
}

function closeChat() {
    chatState.open = false;
    document.getElementById('chatPanel').classList.remove('open');
    document.getElementById('chatPanel').removeEventListener('keydown', handlePanelKeydown);
}

function handlePanelKeydown(e) {
    if (e.key === 'Escape') {
        closeChat();
    }
}
```

## 4. SSE Streaming Client

```javascript
async function sendMessage(question) {
    if (chatState.isStreaming) return;
    chatState.isStreaming = true;

    // Add user message to UI
    appendMessage('user', question);

    // Add to history
    chatState.conversationHistory.push({ role: 'user', content: question });

    // Create assistant message placeholder
    const assistantEl = appendMessage('assistant', '');

    // Disable send button
    document.getElementById('chatSend').disabled = true;

    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                selectedText: chatState.selectedText,
                question: question,
                conversationHistory: chatState.conversationHistory.slice(0, -1)
            })
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullResponse = '';
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
                if (!line.startsWith('data: ')) continue;
                const data = line.slice(6);

                if (data === '[DONE]') break;

                try {
                    const parsed = JSON.parse(data);
                    if (parsed.error) {
                        assistantEl.textContent = `Error: ${parsed.error}`;
                        break;
                    }
                    if (parsed.text) {
                        fullResponse += parsed.text;
                        assistantEl.innerHTML = renderMarkdownLite(fullResponse);
                        // Auto-scroll to bottom
                        const messagesEl = document.getElementById('chatMessages');
                        messagesEl.scrollTop = messagesEl.scrollHeight;
                    }
                } catch (e) { /* skip malformed JSON */ }
            }
        }

        // Add assistant response to history
        chatState.conversationHistory.push({ role: 'assistant', content: fullResponse });

    } catch (err) {
        assistantEl.textContent = `Connection error: ${err.message}. Is the server running?`;
    } finally {
        chatState.isStreaming = false;
        document.getElementById('chatSend').disabled = false;
    }
}
```

## 5. Markdown-Lite Rendering

Lightweight markdown rendering for chat messages (no external library needed):

```javascript
function renderMarkdownLite(text) {
    return text
        // Code blocks (triple backtick)
        .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
        // Inline code
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        // Bold
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        // Italic
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        // Links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
        // Line breaks
        .replace(/\n/g, '<br>');
}
```

## 6. Message Rendering Helper

```javascript
function appendMessage(role, content) {
    const messagesEl = document.getElementById('chatMessages');
    const msgEl = document.createElement('div');
    msgEl.className = `chat-message ${role}`;
    msgEl.innerHTML = content ? renderMarkdownLite(content) : '';
    messagesEl.appendChild(msgEl);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return msgEl;
}
```

## 7. Input Handling

```javascript
// Send on Enter (Shift+Enter for newline)
document.getElementById('chatInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
});

document.getElementById('chatSend').addEventListener('click', handleSend);

function handleSend() {
    const input = document.getElementById('chatInput');
    const question = input.value.trim();
    if (!question || chatState.isStreaming) return;
    input.value = '';
    input.style.height = 'auto';
    sendMessage(question);
}

// Auto-resize textarea
document.getElementById('chatInput').addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 120) + 'px';
});
```

## 8. Graceful Degradation

When the chat server is not running, the page should still render and be fully readable. Only the chat feature degrades:

```javascript
// On chat error, show helpful message
function showChatUnavailable(assistantEl) {
    assistantEl.innerHTML = renderMarkdownLite(
        '**Chat is unavailable.** Start the server to enable AI chat:\n\n' +
        '```\ncd ' + window.location.pathname.split('/')[0] + '\nnpm install\nnode server.js\n```'
    );
}
```

## 9. Accessibility

- Chat panel traps focus when open (Escape to close)
- Chat popover is focusable via keyboard
- Chat messages have appropriate `role` attributes
- Send button has aria-label
- Textarea has placeholder text as label fallback
