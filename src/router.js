export class Router {
    constructor(routes, rootElementId) {
        this.routes = routes;
        this.root = document.getElementById(rootElementId);
        window.addEventListener('hashchange', () => this.handleRoute());
    }

    init() {
        this.handleRoute();
    }

    async handleRoute() {
        const hash = window.location.hash.slice(1) || '/';

        // Find matching route
        const page = this.routes[hash] || this.routes['/'];

        if (page) {
            // Render basic HTML
            this.root.innerHTML = await page.render();

            // Execute after-render logic (listeners, etc.)
            if (page.afterRender) {
                await page.afterRender();
            }
        } else {
            this.root.innerHTML = `
                <div class="container" style="text-align: center; padding-top: 50px;">
                    <h1>404</h1>
                    <p>Page not found</p>
                    <a href="#/" class="btn-primary">Go Home</a>
                </div>
            `;
        }

        // Update active nav state
        this.updateNav(hash);
    }

    updateNav(hash) {
        document.querySelectorAll('.nav-link').forEach(link => {
            // Normalize href which might be full URL or just hash
            const href = link.getAttribute('href');
            // Check if href ends with the hash
            const isActive = href === `#${hash}` || (hash === '/' && href === '#/');

            if (isActive) link.classList.add('active');
            else link.classList.remove('active');
        });
    }

    static navigate(path) {
        window.location.hash = path;
    }
}
