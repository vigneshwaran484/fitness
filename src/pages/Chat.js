import { Navbar } from '../components/Navbar.js';
import { sendMessageToGroq, addToConversation, getHistory, clearConversation } from '../services/groqApi.js';

export const Chat = {
    render: async () => {
        return `
            ${Navbar.render()}
            <div class="chat-wrapper">
                <div class="chat-container">
                    <div class="chat-header">
                        <div class="chat-header-info">
                            <span class="chat-bot-avatar">🤖</span>
                            <div class="chat-bot-meta">
                                <h3>FitBot</h3>
                                <div class="chat-status">
                                    <span class="status-dot"></span>
                                    <span>AI Fitness Coach</span>
                                </div>
                            </div>
                        </div>
                        <button id="clearChat" class="clear-btn" title="Clear Conversation">
                            <span class="clear-icon">🗑️</span> Clear Chat
                        </button>
                    </div>
                    <div id="messagesArea" class="messages-area">
                        <!-- Welcome State (Visible when empty) -->
                        <div id="chatWelcome" class="chat-welcome">
                            <div class="welcome-icon">⚡</div>
                            <h2>Unleash Your Potential</h2>
                            <p>I am your dedicated coach for workout plans, macro breakdowns, and fitness motivation. What are we training today?</p>
                            <div class="suggestion-chips">
                                <button class="chip" data-query="Give me a 30-minute HIIT workout">⏱️ 30-min HIIT</button>
                                <button class="chip" data-query="High protein breakfast ideas">🍳 High Protein Breakfast</button>
                                <button class="chip" data-query="Explain progressive overload">📈 Progressive Overload</button>
                                <button class="chip" data-query="How much water should I drink?">💧 Hydration Tips</button>
                            </div>
                        </div>
                    </div>
                    <div class="input-area">
                        <textarea id="userInput" placeholder="Ask Coach FitBot about workouts, diet, or recipes..." rows="1"></textarea>
                        <button id="sendBtn" class="send-btn" disabled>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
    },
    afterRender: async () => {
        const messagesArea = document.getElementById('messagesArea');
        const chatWelcome = document.getElementById('chatWelcome');
        const userInput = document.getElementById('userInput');
        const sendBtn = document.getElementById('sendBtn');
        const clearBtn = document.getElementById('clearChat');

        // Toggle Welcome Screen
        const toggleWelcome = (show) => {
            if (show) {
                chatWelcome.classList.remove('hidden');
                chatWelcome.style.display = 'flex'; // Ensure flex layout
            } else {
                chatWelcome.classList.add('hidden');
                chatWelcome.style.display = 'none';
            }
        };

        // Handle Chip Clicks
        document.querySelectorAll('.chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const query = chip.getAttribute('data-query');
                userInput.value = query;
                sendMessage();
            });
        });

        // Render existing history
        const history = getHistory();
        if (history.length > 1) {
            toggleWelcome(false);
            history.slice(1).forEach(msg => appendMessage(msg.role, msg.content));
        } else {
            toggleWelcome(true);
        }

        // Check for context param
        const hash = window.location.hash;
        if (hash.includes('?context=')) {
            toggleWelcome(false);
            const context = decodeURIComponent(hash.split('?context=')[1]);
            userInput.value = context;
            userInput.style.height = 'auto'; // Reset height
            userInput.style.height = userInput.scrollHeight + 'px'; // Expand
            sendBtn.disabled = false;
        }

        // Logic (similar to old app.js)
        userInput.addEventListener('input', () => {
            userInput.style.height = 'auto';
            userInput.style.height = Math.min(userInput.scrollHeight, 120) + 'px';
            sendBtn.disabled = userInput.value.trim() === '';
        });

        userInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        sendBtn.addEventListener('click', sendMessage);

        clearBtn.addEventListener('click', () => {
            messagesArea.innerHTML = '';
            clearConversation();
            toggleWelcome(true);
        });

        async function sendMessage() {
            const text = userInput.value.trim();
            if (!text) return;

            toggleWelcome(false); // Hide welcome screen immediately

            appendMessage('user', text);
            userInput.value = '';
            userInput.style.height = 'auto';
            sendBtn.disabled = true;

            // Show typing
            const typingInd = showTypingIndicator();

            try {
                const response = await sendMessageToGroq(text);
                removeTypingIndicator(typingInd);
                appendMessage('assistant', response);
            } catch (err) {
                removeTypingIndicator(typingInd);
                appendMessage('assistant', `⚠️ Error: ${err.message}`);
            }
        }

        function appendMessage(role, content) {
            const msgDiv = document.createElement('div');
            msgDiv.className = `message ${role === 'user' ? 'user' : 'bot'}`;
            msgDiv.innerHTML = `
                <div class="message-avatar">${role === 'user' ? '🧑' : '🤖'}</div>
                <div class="message-content">${role === 'assistant' ? markdownToHTML(content) : content}</div>
            `;
            messagesArea.appendChild(msgDiv);
            messagesArea.scrollTop = messagesArea.scrollHeight;
        }

        function showTypingIndicator() {
            const div = document.createElement('div');
            div.className = 'typing-indicator';
            div.innerHTML = '<span>.</span><span>.</span><span>.</span>';
            messagesArea.appendChild(div);
            return div;
        }

        function removeTypingIndicator(el) {
            if (el) el.remove();
        }

        // Helper markdown function (simplified)
        function markdownToHTML(text) {
            return text
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\n/g, '<br>');
        }
    }
};
