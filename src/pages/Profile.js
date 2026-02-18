import { Navbar } from '../components/Navbar.js';

export const Profile = {
    render: async () => {
        return `
            ${Navbar.render()}
            <div class="profile-wrapper">
                <!-- Cover Banner -->
                <div class="profile-cover"></div>
                
                <div class="container profile-content">
                    <!-- Header Info -->
                    <div class="profile-header-card">
                        <div class="profile-avatar-large">👤</div>
                        <h2 class="profile-name">Athlete</h2>
                        <p class="profile-handle">@fitbot_user</p>
                        <p class="profile-bio">Consistency over intensity. 💪</p>
                        <button class="btn-secondary edit-profile-btn">Edit Profile</button>
                    </div>

                    <!-- Stats Grid -->
                    <div class="profile-grid">
                        <div class="stat-box">
                            <div class="stat-icon">⚖️</div>
                            <div class="stat-info">
                                <h3>Weight</h3>
                                <p>-- kg</p>
                            </div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-icon">🎯</div>
                            <div class="stat-info">
                                <h3>Goal</h3>
                                <p>Maintenance</p>
                            </div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-icon">🔥</div>
                            <div class="stat-info">
                                <h3>Streak</h3>
                                <p>0 Days</p>
                            </div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-icon">💬</div>
                            <div class="stat-info">
                                <h3>Chats</h3>
                                <p>Active</p>
                            </div>
                        </div>
                    </div>

                    <!-- Settings / Sections -->
                    <div class="profile-sections">
                        <div class="section-card">
                            <h3>⚙️ Settings</h3>
                            <ul class="settings-list">
                                <li>
                                    <span>🔔 Notifications</span>
                                    <span class="toggle">ON</span>
                                </li>
                                <li>
                                    <span>🌙 Dark Mode</span>
                                    <span class="toggle">ON</span>
                                </li>
                                <li>
                                    <span>🔒 Privacy</span>
                                    <span class="arrow">›</span>
                                </li>
                            </ul>
                        </div>

                        <div class="section-card">
                            <h3>🏆 Achievements</h3>
                            <div class="achievements-list">
                                <div class="achievement unlocked" title="First Login">🚀</div>
                                <div class="achievement" title="7 Day Streak">📅</div>
                                <div class="achievement" title="Weight Goal Met">⚖️</div>
                                <div class="achievement" title="Macro Master">🥑</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
};
