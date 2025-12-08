<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Flux | The Behavioral Architect

A psychological intervention designed to bridge the "Execution Gap"—the chasm between knowing what to do and actually doing it.

## Features

- 🧠 **Brain Dump Mode** - Capture tasks quickly with AI assistance
- ⚡ **Flow Mode** - Distraction-free task execution
- 📊 **Dashboard** - Energy-aware task management
- 🎯 **Smart Scheduling** - AI-powered task organization
- 🌊 **Calm Technology** - Beautiful, stress-reducing interface

## Run Locally

**Prerequisites:** Node.js 20+

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/flux.git
   cd flux
   ```

2. Install dependencies:
   ```bash
   npm install --include=dev
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local and add your Gemini API key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Deployment

### GitHub Pages (Automated)

1. Push your code to GitHub
2. Go to Settings > Pages > Source > GitHub Actions
3. Add your `GEMINI_API_KEY` in Settings > Secrets and variables > Actions
4. Push to `main` branch - deployment happens automatically!

### Vercel (One-Click)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/flux)

1. Click the deploy button
2. Add `GEMINI_API_KEY` environment variable
3. Deploy!

Or via CLI:
```bash
npm i -g vercel
vercel
```

## Tech Stack

- React 19
- TypeScript
- Vite
- Google Gemini AI
- Tailwind CSS

## License

MIT

---

View original in AI Studio: https://ai.studio/apps/drive/1eTwm2DHWaHdduGa9-0rYal4zKZhYd45t
