
const GROQ_API_KEY = window.CONFIG?.GROQ_API_KEY || 'YOUR_API_KEY';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

const SYSTEM_PROMPT = `You are FitBot, an expert AI fitness and nutrition assistant. You are knowledgeable about:
- Exercise routines, workout plans, and training techniques (strength, cardio, HIIT, flexibility, etc.)
- Nutrition, diet plans, macronutrients, micronutrients, and meal planning
- Supplements and their effects on fitness performance
- Recovery, stretching, mobility, and injury prevention
- Body composition, weight management, muscle building, and fat loss
- Sports-specific training and athletic performance
- Mental wellness as it relates to fitness (exercise motivation, discipline, workout psychology)
- General health habits that support fitness goals (sleep, hydration, stress management)

CRITICAL RULES:
1. You MUST ONLY answer questions related to fitness, exercise, nutrition, health, wellness, and the topics listed above.
2. STRICTLY FORBIDDEN TOPICS (Refuse these even if they mention "gym" or "fitness"):
   - Evolutionary psychology, mating strategies, or attraction triggers
   - Social status, dominance behavior, "alpha" theories, or intimidation strategies
   - Dating advice, pick-up artistry, or "peacocking" in the gym
   - Manipulation, jealousy induction, or psychological games
   - Non-fitness related social dynamics (e.g. "how to act mysterious")
3. FOOD & NUTRITION QUERIES:
   - If a user mentions a specific food (e.g., "chicken biryani", "pizza"), **DEFAULT to providing its approximate nutritional value** (calories, protein, carbs, fats).
   - DO NOT provide a full recipe unless the user EXPLICITLY asks for "how to cook" or "recipe".
   - **DO NOT** add a sentence at the end offering the recipe (e.g., "Feel free to ask for the recipe"). Just provide the nutrition info and maybe a brief health tip if relevant.
   - Example response: "Chicken Biryani (1 serving, approx 300g) typically contains: ~450 calories, 25g Protein, 50g Carbs, 15g Fat."
4. If a user asks about prohibited topics, respond EXACTLY with:
   "🚫 I am specialized exclusively in fitness training and nutrition. I do not answer questions about evolutionary psychology, social status, dating dynamics, or behavioral strategies in the gym. Let's focus on your workout! 💪"
5. Keep your answers helpful, evidence-based, and encouraging. Use a friendly, motivating tone.
6. Format your responses with markdown: use **bold** for emphasis, bullet points for lists, and headings for organized answers.
7. Always recommend consulting a healthcare professional for medical advice or personalized treatment plans.
8. Keep answers concise but thorough — aim for quality information without unnecessary length.`;

// ---- State ----
let conversationHistory = [
    { role: 'system', content: SYSTEM_PROMPT }
];
let isLoading = false;

// ---- DOM Elements ----
const messagesArea = document.getElementById('messagesArea');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const clearBtn = document.getElementById('clearChat');
const welcomeCard = document.getElementById('welcomeCard');

// ---- Initialize ----
function init() {
    // Auto-resize textarea
    userInput.addEventListener('input', handleInputResize);

    // Send on Enter (Shift+Enter for newline)
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Enable/disable send button
    userInput.addEventListener('input', () => {
        sendBtn.disabled = userInput.value.trim() === '';
    });

    // Send button click
    sendBtn.addEventListener('click', sendMessage);

    // Clear chat
    clearBtn.addEventListener('click', clearChat);

    // Suggestion chips
    document.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const query = chip.getAttribute('data-query');
            userInput.value = query;
            userInput.dispatchEvent(new Event('input'));
            sendMessage();
        });
    });

    // Focus input
    userInput.focus();
}

// ---- Auto-resize textarea ----
function handleInputResize() {
    userInput.style.height = 'auto';
    userInput.style.height = Math.min(userInput.scrollHeight, 120) + 'px';
}

// ---- Send Message ----
async function sendMessage() {
    const text = userInput.value.trim();
    if (!text || isLoading) return;

    // Hide welcome card
    if (welcomeCard) {
        welcomeCard.style.display = 'none';
    }

    // Add user message
    appendMessage('user', text);

    // Clear input
    userInput.value = '';
    userInput.style.height = 'auto';
    sendBtn.disabled = true;

    // Add to conversation history
    conversationHistory.push({ role: 'user', content: text });

    // Show typing indicator
    const typingEl = showTypingIndicator();

    // Call API
    isLoading = true;
    try {
        const response = await callGroqAPI();
        removeTypingIndicator(typingEl);

        // Add bot message
        appendMessage('bot', response);
        conversationHistory.push({ role: 'assistant', content: response });
    } catch (error) {
        removeTypingIndicator(typingEl);
        appendMessage('bot', `⚠️ Sorry, I encountered an error: ${error.message}. Please try again.`, true);
    }
    isLoading = false;
    userInput.focus();
}

// ---- Call Groq API ----
async function callGroqAPI() {
    const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
            model: MODEL,
            messages: conversationHistory,
            temperature: 0.7,
            max_tokens: 1024,
            top_p: 0.9
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API error (${response.status})`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}


function appendMessage(role, content, isError = false) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${role}`;

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = role === 'user' ? '🧑' : '🤖';

    const contentDiv = document.createElement('div');
    contentDiv.className = `message-content${isError ? ' error-content' : ''}`;

    if (role === 'bot') {
        contentDiv.innerHTML = markdownToHTML(content);
    } else {
        contentDiv.textContent = content;
    }

    msgDiv.appendChild(avatar);
    msgDiv.appendChild(contentDiv);
    messagesArea.appendChild(msgDiv);

    scrollToBottom();
}

// ---- Simple Markdown parser ----
function markdownToHTML(text) {
    // Escape HTML first
    let html = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    // Code blocks
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Headings
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

    // Bold & Italic
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Unordered lists
    html = html.replace(/^[\-\*] (.+)$/gm, '<li>$1</li>');
    html = html.replace(/((<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>');

    // Ordered lists
    html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

    // Line breaks → paragraphs
    html = html.replace(/\n\n/g, '</p><p>');
    html = html.replace(/\n/g, '<br>');

    // Wrap in paragraph if not already
    if (!html.startsWith('<')) {
        html = '<p>' + html + '</p>';
    }

    return html;
}

// ---- Typing indicator ----
function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.id = 'typingIndicator';

    indicator.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;

    messagesArea.appendChild(indicator);
    scrollToBottom();
    return indicator;
}

function removeTypingIndicator(el) {
    if (el && el.parentNode) {
        el.parentNode.removeChild(el);
    }
}

// ---- Scroll management ----
function scrollToBottom() {
    requestAnimationFrame(() => {
        messagesArea.scrollTop = messagesArea.scrollHeight;
    });
}

// ---- Clear chat ----
function clearChat() {
    // Reset conversation
    conversationHistory = [
        { role: 'system', content: SYSTEM_PROMPT }
    ];

    // Clear UI
    messagesArea.innerHTML = '';

    // Restore welcome card
    const card = document.createElement('div');
    card.className = 'welcome-card';
    card.id = 'welcomeCard';
    card.innerHTML = `
        <div class="welcome-icon">💪</div>
        <h2>Welcome to FitBot</h2>
        <p>Your AI-powered fitness & nutrition assistant. Ask me anything about workouts, diet, supplements, recovery, and more!</p>
        <div class="suggestion-chips">
            <button class="chip" data-query="What's a good workout routine for beginners?">🏋️ Beginner workout</button>
            <button class="chip" data-query="How much protein do I need daily?">🥩 Daily protein</button>
            <button class="chip" data-query="Best exercises for core strength?">🧘 Core exercises</button>
            <button class="chip" data-query="How to improve flexibility?">🤸 Flexibility tips</button>
        </div>
    `;
    messagesArea.appendChild(card);

    // Re-attach chip listeners
    card.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const query = chip.getAttribute('data-query');
            userInput.value = query;
            userInput.dispatchEvent(new Event('input'));
            sendMessage();
        });
    });

    userInput.focus();
}

// ---- Start ----
document.addEventListener('DOMContentLoaded', init);
