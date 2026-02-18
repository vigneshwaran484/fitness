import { Navbar } from '../components/Navbar.js';
import { calculateBMI, calculateCalories, calculateMacros, calculateWater } from '../services/calculators.js';

export const ToolsHub = {
    render: async () => {
        return `
            ${Navbar.render()}
            <div class="container tools-container">
                <h2>Fitness Tools</h2>
                <div class="tools-grid">
                    
                    <!-- BMI Card -->
                    <div class="tool-card" id="card-bmi">
                        <div class="tool-icon">⚖️</div>
                        <h3>BMI Calculator</h3>
                        <p>Discover your Body Mass Index and weight category.</p>
                        <button class="btn-secondary open-tool" data-tool="bmi">Open</button>
                    </div>

                    <!-- Calories Card -->
                    <div class="tool-card" id="card-calories">
                        <div class="tool-icon">🔥</div>
                        <h3>Calorie Needs</h3>
                        <p>Calculate your TDEE based on activity level.</p>
                        <button class="btn-secondary open-tool" data-tool="calories">Open</button>
                    </div>

                    <!-- Macros Card -->
                    <div class="tool-card" id="card-macros">
                        <div class="tool-icon">🥩</div>
                        <h3>Macro Split</h3>
                        <p>Custom protein, fat, and carb breakdown for your goals.</p>
                        <button class="btn-secondary open-tool" data-tool="macros">Open</button>
                    </div>

                    <!-- Water Card -->
                    <div class="tool-card" id="card-water">
                        <div class="tool-icon">💧</div>
                        <h3>Hydration</h3>
                        <p>Daily water intake based on weight and activity.</p>
                        <button class="btn-secondary open-tool" data-tool="water">Open</button>
                    </div>

                </div>
            </div>

            <!-- Modal Container -->
            <div id="tool-modal" class="modal hidden">
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <div id="modal-body"></div>
                </div>
            </div>
        `;
    },

    afterRender: async () => {
        const modal = document.getElementById('tool-modal');
        const modalBody = document.getElementById('modal-body');
        const closeBtn = document.querySelector('.close-modal');

        // Close modal logic
        const closeModal = () => {
            modal.classList.add('hidden');
            modalBody.innerHTML = '';
        };
        closeBtn.onclick = closeModal;
        window.onclick = (e) => {
            if (e.target === modal) closeModal();
        };

        // Open Modal Handler
        document.querySelectorAll('.open-tool').forEach(btn => {
            btn.addEventListener('click', () => {
                const tool = btn.getAttribute('data-tool');
                modalBody.innerHTML = getToolForm(tool);
                modal.classList.remove('hidden');
                attachFormListener(tool, modalBody);
            });
        });
    }
};

// Returns HTML string for specific tool form
function getToolForm(tool) {
    if (tool === 'bmi') {
        return `
            <h3>BMI Calculator</h3>
            <form id="bmi-form">
                <div class="form-group">
                    <label>Weight (kg)</label>
                    <input type="number" id="weight" required placeholder="e.g. 70">
                </div>
                <div class="form-group">
                    <label>Height (cm)</label>
                    <input type="number" id="height" required placeholder="e.g. 175">
                </div>
                <button type="submit" class="btn-primary">Calculate</button>
            </form>
            <div id="result-area" class="hidden"></div>
        `;
    }
    if (tool === 'calories') {
        return `
            <h3>Daily Calories (TDEE)</h3>
            <form id="calories-form">
                <div class="form-group">
                    <label>Weight (kg)</label>
                    <input type="number" id="weight" required>
                </div>
                <div class="form-group">
                    <label>Height (cm)</label>
                    <input type="number" id="height" required>
                </div>
                <div class="form-group">
                    <label>Age</label>
                    <input type="number" id="age" required>
                </div>
                <div class="form-group">
                    <label>Gender</label>
                    <select id="gender">
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Activity Level</label>
                    <select id="activity">
                        <option value="1.2">Sedentary</option>
                        <option value="1.375">Light Activity</option>
                        <option value="1.55">Moderate Activity</option>
                        <option value="1.725">Very Active</option>
                        <option value="1.9">Extra Active</option>
                    </select>
                </div>
                <button type="submit" class="btn-primary">Calculate</button>
            </form>
            <div id="result-area" class="hidden"></div>
        `;
    }
    // Add Macros and Water similarly...
    // For brevity, I'll add simple placeholder logic for now or full if space permits.
    // Let's do full for Macros and Water.
    if (tool === 'macros') {
        return `
            <h3>Macro Split</h3>
            <form id="macros-form">
                <div class="form-group">
                    <label>Daily Calories (TDEE)</label>
                    <input type="number" id="tdee" required placeholder="e.g. 2500">
                </div>
                <div class="form-group">
                    <label>Goal</label>
                    <select id="goal">
                        <option value="lose">Weight Loss</option>
                        <option value="maintain">Maintenance</option>
                        <option value="gain">Muscle Gain</option>
                    </select>
                </div>
                <button type="submit" class="btn-primary">Calculate</button>
            </form>
            <div id="result-area" class="hidden"></div>
        `;
    }
    if (tool === 'water') {
        return `
            <h3>Water Intake</h3>
            <form id="water-form">
                <div class="form-group">
                    <label>Weight (kg)</label>
                    <input type="number" id="weight" required>
                </div>
                <div class="form-group">
                    <label>Daily Activity (minutes)</label>
                    <input type="number" id="activity" required placeholder="e.g. 30">
                </div>
                <button type="submit" class="btn-primary">Calculate</button>
            </form>
            <div id="result-area" class="hidden"></div>
        `;
    }
}

// Logic to handle form submission and calculation
function attachFormListener(tool, container) {
    const form = container.querySelector('form');
    const resultArea = container.querySelector('#result-area');

    form.onsubmit = (e) => {
        e.preventDefault();
        let resultHTML = '';
        let contextText = '';

        if (tool === 'bmi') {
            const w = parseFloat(document.getElementById('weight').value);
            const h = parseFloat(document.getElementById('height').value);
            const { bmi, category } = calculateBMI(w, h);
            resultHTML = `<p>Your BMI is <strong>${bmi}</strong> (${category})</p>`;
            contextText = `My BMI is ${bmi} (${category}). Advice?`;
        }

        if (tool === 'calories') {
            const w = parseFloat(document.getElementById('weight').value);
            const h = parseFloat(document.getElementById('height').value);
            const a = parseFloat(document.getElementById('age').value);
            const g = document.getElementById('gender').value;
            const act = parseFloat(document.getElementById('activity').value);
            const cals = calculateCalories(w, h, a, g, act);
            resultHTML = `<p>Daily Needs: <strong>${cals} Calories</strong></p>`;
            contextText = `My TDEE is ${cals} calories. Meal plan?`;
        }

        if (tool === 'macros') {
            const tdee = parseFloat(document.getElementById('tdee').value);
            const goal = document.getElementById('goal').value;
            const macros = calculateMacros(tdee, goal);
            resultHTML = `
                <p>Calories: <strong>${macros.calories}</strong></p>
                <ul>
                    <li>Attributes: <strong>${macros.protein}g</strong> Protein</li>
                    <li>Carbs: <strong>${macros.carbs}g</strong></li>
                    <li>Fats: <strong>${macros.fats}g</strong></li>
                </ul>
            `;
            contextText = `My macros: ${macros.protein}g P, ${macros.carbs}g C, ${macros.fats}g F. Recipe ideas?`;
        }

        if (tool === 'water') {
            const w = parseFloat(document.getElementById('weight').value);
            const act = parseFloat(document.getElementById('activity').value);
            const liters = calculateWater(w, act);
            resultHTML = `<p>Drink: <strong>${liters} Liters</strong> / day</p>`;
            contextText = `I need ${liters}L water daily. Hydration tips?`;
        }

        // Display Result + Chat Button
        resultArea.innerHTML = `
            <div class="result-box">
                ${resultHTML}
                <button class="btn-secondary ask-fitbot" style="margin-top:1rem;">Ask FitBot About This</button>
            </div>
        `;
        resultArea.classList.remove('hidden');

        // "Ask FitBot" Listener
        resultArea.querySelector('.ask-fitbot').onclick = () => {
            // Use hash param to pass context
            window.location.hash = `#/chat?context=${encodeURIComponent(contextText)}`;
        };
    };
}
