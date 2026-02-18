import { Router } from './router.js';
import { Home } from './pages/Home.js';
import { ToolsHub } from './pages/ToolsHub.js';
import { Chat } from './pages/Chat.js';
import { Profile } from './pages/Profile.js';

// Define routes
const routes = {
    '/': Home,
    '/tools': ToolsHub,
    '/chat': Chat,
    '/profile': Profile
};

// Initialize router on app-root div
const router = new Router(routes, 'app-root');
router.init();

// Log successful init
console.log('FitBot Web App Initialized');
