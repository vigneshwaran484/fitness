# 🏋️ FitBot — AI Fitness & Nutrition Expert

FitBot is a premium, AI-powered fitness chatbot that exclusively answers health-related questions. Built with a stunning dark glassmorphism theme, it runs on both **Web** and **Mobile** (React Native Expo).

## 🚀 Key Features

- **Strict Fitness Focus**: Exclusively answers questions about fitness, nutrition, workouts, and health. Politely declines off-topic queries (e.g., dating advice, politics).
- **Smart Nutrition Lookup**: Ask for any food (e.g., "chicken biryani") and get instant calorie/macro breakdowns by default (recipe only on request).
- **Premium UI**: Dark mode, glassmorphism design, animated gradient backgrounds, and smooth transitions.
- **Cross-Platform**:
  - **Web**: HTML/CSS/JS (Single Page App)
  - **Mobile**: React Native (Expo) for iOS & Android
- **Markdown Support**: Bot responses use rich text formatting (bold, lists, etc.).

## 🛠️ Tech Stack

- **AI Engine**: Groq API (`llama-3.3-70b-versatile`)
- **Web App**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Mobile App**: React Native, Expo, TypeScript, `react-native-reanimated`
- **Styling**: Custom CSS (Web), `StyleSheet` & `expo-linear-gradient` (Mobile)

## 📦 Installation & Setup

### 1. Web Version
Run the web app locally using `http-server` (or any static server):

```bash
# Install http-server if needed
npm install -g http-server

# Run the server
npx http-server . -p 8080 -c-1
```
Open **[http://127.0.0.1:8080](http://127.0.0.1:8080)** in your browser.

### 2. Mobile App (Expo)
Run the React Native app on your device or emulator:

```bash
# Navigate to mobile directory
cd mobile

# Install dependencies
npm install

# Start Expo server
npx expo start
```
- Scan the QR code with **Expo Go** (Android/iOS).
- Press `a` to run on Android Emulator.
- Press `i` to run on iOS Simulator (macOS only).

### 3. Android Native Build
To run the native Android build (required for some keyboard features):

```bash
cd mobile
npx expo run:android
```

## 🛡️ Safety Guardrails

FitBot includes strict system-level instructions to ensure safety and relevance:
- **Forbidden Topics**: Evolutionary psychology, dating strategies, social dominance, PUA tactics.
- **Medical Disclaimer**: Always advises consulting professionals for medical issues.
- **Food Queries**: Default to nutritional facts (Calories, Protein, Carbs, Fat) rather than recipes.

## 📁 Project Structure

```
fitness/
├── index.html          # Web App Entry
├── style.css           # Web Styles (Dark Glass Theme)
├── app.js              # Web Logic & Groq API Integration
├── README.md           # Documentation
└── mobile/             # React Native App
    ├── App.tsx         # Mobile Entry Point
    ├── app.json        # Expo Config
    └── src/
        ├── components/ # UI Components (ChatBubble, TypingIndicator, etc.)
        ├── screens/    # Screens (ChatScreen.tsx)
        ├── services/   # API Logic (groqApi.ts)
        └── theme.ts    # Design Tokens
```

---

