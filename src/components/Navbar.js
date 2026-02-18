export const Navbar = {
    render: () => {
        return `
            <nav class="navbar">
                <div class="nav-brand">
                    <span class="logo">🏋️</span> FitBot
                </div>
                <div class="nav-links">
                    <a href="#/" class="nav-link">Home</a>
                    <a href="#/tools" class="nav-link">Tools</a>
                    <a href="#/chat" class="nav-link">Chat</a>
                    <a href="#/profile" class="nav-link">Profile</a>
                </div>
            </nav>
        `;
    }
};
