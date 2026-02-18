export const ToolCard = ({ id, icon, title, description, action }) => {
    return `
        <div class="tool-card">
            <div class="tool-icon">${icon}</div>
            <h3>${title}</h3>
            <p>${description}</p>
            <button class="btn-secondary open-tool-btn" data-tool="${id}">${action}</button>
        </div>
    `;
};
