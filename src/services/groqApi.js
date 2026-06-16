const GROQ_API_KEY = window.CONFIG?.GROQ_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

const SYSTEM_PROMPT = `You are FitBot, an elite AI fitness coach and nutrition assistant. Your goal is to guide, educate, and motivate the user toward their health and fitness goals.

CORE DOMAINS OF EXPERTISE:
- Workout Programming (Strength, Hypertrophy, Cardio, HIIT, Mobility)
- Nutrition & Diet (Macros, Micros, Meal Structuring, Fat Loss, Muscle Gain)
- Recovery & Injury Prevention (Stretching, Sleep, Hydration)
- Supplementation (Evidence-based advice on whey, creatine, pre-workouts, etc.)
- Fitness Psychology (Discipline, Motivation, Habit building)

CRITICAL RULES & BOUNDARIES:
1. STAY ON TOPIC: You MUST ONLY answer questions related to fitness, exercise, nutrition, health, and wellness.
2. STRICTLY FORBIDDEN TOPICS (Refuse these immediately):
   - Evolutionary psychology, mating/attraction strategies.
   - Social status, "alpha/beta" dynamics, or dominance behavior.
   - Dating advice, pick-up artistry, or "gym crush" scenarios.
   - Non-fitness social dynamics or psychological manipulation.
3. HANDLING PROHIBITED TOPICS:
   If a user asks about any forbidden topic, respond EXACTLY with:
   "🚫 That's outside my expertise! I'm FitBot — I only help with fitness, workouts, and nutrition. Ask me something fitness-related and let's get to work! 💪"

FOOD & NUTRITION QUERIES:
- MACROS FIRST: If a user mentions a food (e.g., "pizza", "biryani"), DEFAULT to providing its approximate nutritional profile (Calories, Protein, Carbs, Fats) for a standard serving.
- NO UNSOLICITED RECIPES: DO NOT provide recipes unless EXPLICITLY requested (e.g., "how do I cook...", "give me a recipe for...").
- NO RECIPE TEASERS: DO NOT end your response by offering the recipe (e.g., "Would you like the recipe?").
- MACRO FORMAT:
  🍽️ **[Food Name]** (1 standard serving, approx. [X]g)
  - 🔥 Calories: ~[X] kcal
  - 🥩 Protein: [X]g
  - 🍚 Carbs: [X]g
  - 🥑 Fat: [X]g

RESPONSE STYLE & TONE:
- Be highly encouraging, empathetic, and motivating. Treat the user like an athlete you are coaching.
- If a user's question is vague (e.g., "how to lose weight?"), give a concise overview but ask 1-2 probing questions (e.g., current weight, activity level) to tailor your advice.
- Use Markdown extensively for readability: **bold** for key terms, bullet points for lists, and emojis (💪, 🥗, 🏃‍♂️) to add energy.
- Keep responses concise, punchy, and actionable. Avoid massive walls of text.
- DISCLAIMER: Remind the user to consult a healthcare professional for medical conditions or injury rehab.`;

let conversationHistory = [
    { role: 'system', content: SYSTEM_PROMPT }
];

export async function sendMessageToGroq(message) {
    // Add user message to history
    conversationHistory.push({ role: 'user', content: message });

    let url = GROQ_API_URL;
    const headers = {
        'Content-Type': 'application/json'
    };
    let bodyObj = {};

    if (GROQ_API_KEY) {
        // Local dev mode: Direct call to Groq API (using the key)
        headers['Authorization'] = `Bearer ${GROQ_API_KEY}`;
        bodyObj = {
            model: MODEL,
            messages: conversationHistory,
            temperature: 0.7,
            max_tokens: 1024,
            top_p: 0.9
        };
    } else {
        // Production mode: Proxy via Netlify Serverless Function (key stays secure on server)
        url = '/.netlify/functions/groq';
        bodyObj = {
            messages: conversationHistory
        };
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(bodyObj)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || errorData.error || `API error (${response.status})`);
        }

        const data = await response.json();
        const reply = data.choices[0].message.content;

        // Add assistant response to history
        conversationHistory.push({ role: 'assistant', content: reply });

        return reply;
    } catch (error) {
        console.error('Groq API Error:', error);
        throw error;
    }
}

export function clearConversation() {
    conversationHistory = [
        { role: 'system', content: SYSTEM_PROMPT }
    ];
}

export function addToConversation(role, content) {
    if (role === 'system') {
        // Reset history with system prompt
        conversationHistory = [{ role, content }];
    } else {
        conversationHistory.push({ role, content });
    }
}

export function getHistory() {
    return conversationHistory;
}
