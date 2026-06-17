# PitchSync

**Turn any GitHub repo into a stunning investor pitch deck in seconds.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org)

---

## The Problem

Building a pitch deck from scratch takes days. Founders spend more time in PowerPoint than talking to customers. Investors miss great projects because the presentation looks amateur.

## The Solution

PitchSync analyzes your GitHub repository — README, code structure, language stats, topics, stars — and generates a professional 10-slide pitch deck automatically. No design skills required.

```
Paste a GitHub URL -> Get a pitch deck in seconds
```

---

## Features

- **Instant Generation** — Paste any public GitHub repo URL and get a complete pitch deck in under 10 seconds
- **10 Smart Slides** — Title, Problem, Solution, How It Works, Tech Stack, Market, Traction, Roadmap, Team, Ask
- **5 Themes** — Dark, Ocean, Forest, Sunset, Light
- **Smart Analysis** — Extracts problem/solution from README, detects tech stack, pulls GitHub metrics (stars, forks, language)
- **Live Polling** — Deck updates in real-time while generating (2s interval)
- **Share Links** — Public decks get a shareable slug URL
- **Explore Gallery** — Browse community pitch decks for inspiration
- **Regenerate** — Re-analyze any time to refresh content
- **JWT Auth** — Secure accounts with access + refresh token pair

---

## Architecture

```
pitchsync/
+-- backend/          # Node.js 20 + Express 4 API (port 5001)
|   +-- src/
|   |   +-- config/   # Environment config
|   |   +-- models/   # Mongoose schemas (User, Pitch)
|   |   +-- routes/   # REST endpoints (auth, pitches)
|   |   +-- services/ # githubService, analyzerService, slideGenerator, tokenService
|   |   +-- middleware/
|   +-- Dockerfile
+-- frontend/         # React 18 + TypeScript + Vite + Tailwind (port 5174)
|   +-- src/
|   |   +-- pages/    # Dashboard, Pitches, NewPitch, PitchDetail, Explore
|   |   +-- components/ # Layout, SlideViewer
|   |   +-- lib/api.ts
|   |   +-- store/auth.ts
|   +-- Dockerfile
+-- docker-compose.yml
+-- .github/workflows/ci.yml
```

---

## Quick Start

### Docker (recommended)

```bash
git clone https://github.com/avase33/pitchsync
cd pitchsync
cp .env.example .env
docker compose up
```

App: http://localhost:5174 | API: http://localhost:5001

### Manual

```bash
# Backend
cd backend && npm install
cp ../.env.example .env
npm run dev        # starts on :5001

# Frontend (new terminal)
cd frontend && npm install
npm run dev        # starts on :5174
```

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login -> JWT pair |
| POST | `/api/auth/refresh` | Refresh access token |
| GET  | `/api/auth/me` | Get current user |
| GET  | `/api/pitches` | List my pitch decks |
| POST | `/api/pitches` | Generate pitch from repo URL |
| GET  | `/api/pitches/public` | Browse public pitches |
| GET  | `/api/pitches/:id` | Get pitch details |
| PATCH | `/api/pitches/:id` | Update pitch (title, slides, theme) |
| DELETE | `/api/pitches/:id` | Delete pitch |
| POST | `/api/pitches/:id/like` | Like a pitch |
| POST | `/api/pitches/:id/regenerate` | Re-analyze and regenerate slides |
| GET  | `/api/pitches/slug/:slug` | Get public pitch by share slug |

---

## How Slide Generation Works

1. **Fetch** — GitHub API pulls repo metadata, README, package.json, language stats, topics
2. **Analyze** — Section extraction (problem/solution/roadmap headers), tech stack detection across 8 categories, feature bullet parsing
3. **Generate** — 10-slide deck with smart fallbacks for any repo type
4. **Store** — MongoDB with async background generation (202 Accepted pattern)

No external AI API required — pure heuristic analysis that works on any public repo.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 20 + ES Modules |
| Backend | Express 4, Mongoose, JWT, bcryptjs |
| Database | MongoDB 7 |
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| State | Zustand, TanStack React Query |
| GitHub | node-fetch + GitHub REST API v3 |
| Infra | Docker, Docker Compose, GitHub Actions |

---

## Roadmap

- [ ] PDF export (Puppeteer headless render)
- [ ] Slide editor (inline edit each slide's text)
- [ ] Custom slides (add/remove/reorder)
- [ ] Team pitch collaboration (multiple editors)
- [ ] AI-enhanced analysis (GPT-4o-mini for richer content)
- [ ] Private repo support (GitHub OAuth)
- [ ] Embed widget (iframe shareable slide)
- [ ] PowerPoint export

---

## License

MIT (c) Akhil Vase 2026
