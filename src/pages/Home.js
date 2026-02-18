import { Navbar } from '../components/Navbar.js';

export const Home = {
    render: async () => {
        return `
            ${Navbar.render()}
            <header class="hero">
                <div class="hero-content">
                    <h1>Your AI Fitness & Nutrition Assistant</h1>
                    <p>Get personalized workout plans, calculate your macros, and chat with an expert AI coach instantly.</p>
                    <div class="hero-actions">
                        <a href="#/chat" class="btn-primary">Open Chat</a>
                        <a href="#/tools" class="btn-secondary">Explore Tools</a>
                    </div>
                </div>
            </header>
            
            <section class="features">
                <div class="feature-card">
                    <div class="icon">💬</div>
                    <h3>AI Coach</h3>
                    <p>Chat with FitBot for instant advice on training and diet.</p>
                </div>
                <div class="feature-card">
                    <div class="icon">📊</div>
                    <h3>Smart Tools</h3>
                    <p>Calculate BMI, TDEE, Macros, and hydration needs.</p>
                </div>
                <div class="feature-card">
                    <div class="icon">🔒</div>
                    <h3>Safe & Focused</h3>
                    <p>Strictly fitness-focused with verified nutritional data.</p>
                </div>
            </section>
        `;
    },
    afterRender: async () => {
        // No specific logic needed for Home yet
    }
};
