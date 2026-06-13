import { Chat } from './pages/Chat.js';

async function init() {
    const root = document.getElementById('app-root');
    if (root) {
        root.innerHTML = await Chat.render();
        if (Chat.afterRender) {
            await Chat.afterRender();
        }
    }
    console.log('FitBot Web App Initialized');
}

// Boot application
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
