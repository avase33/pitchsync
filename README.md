<div align="center">

```
 ___ _ _       _    ___
| _ (_) |_ ___| |_ / __|_  _ _ _  __
|  _/ |  _/ __| ' \\__ \ || | ' \/ _|
|_| |_|\__\___|_||_|___/\_, |_||_\__|
                         |__/
```

### **Repo to Pitch Deck Generator**

*Point it at your GitHub repo. Get investor-ready slides in minutes.*

<br/>

[![CI](https://github.com/avase33/pitchsync/actions/workflows/ci.yml/badge.svg)](https://github.com/avase33/pitchsync/actions/workflows/ci.yml)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![License](https://img.shields.io/badge/License-Proprietary-red)

<br/>

> **PitchSync** reads your GitHub repo -- architecture, README, tech stack, commit history, and structure -- and auto-generates a polished investor pitch deck that articulates the technical differentiation, business value, and team execution signal buried in your codebase.

</div>

---

## The Problem

Founders and engineers build impressive systems and then struggle to communicate their value in slides. Investors see hundreds of decks and miss the technical depth that actually matters. PitchSync bridges the gap: it reads your code the way a technical investor would, and turns it into slides that speak both languages.

---

## Feature Highlights

### Repo Analysis

- Connect any public or private GitHub repo via OAuth
- Parse README, package.json/requirements.txt, file structure, commit history
- Detect tech stack, frameworks, architecture patterns
- Extract key signals: test coverage, CI setup, contribution activity, code quality

### AI-Powered Slide Generation

- Generates a 10-12 slide deck in standard investor format
- Slides auto-populated from repo analysis:
  - **Problem** -- extracted from README problem statement
  - **Solution** -- product description and key features
  - **Tech Differentiation** -- what makes the architecture novel
  - **Traction** -- commit velocity, contributors, activity graph
  - **Team** -- inferred from contributor history
  - **Roadmap** -- extracted from TODO comments and issue tracker
- One-click regenerate individual slides

### Export

- Export as `.pptx` for PowerPoint editing
- Export as PDF for immediate sharing
- Shareable link with password protection

### Editor

- Drag-and-drop slide reorder
- Inline text editing on any generated slide
- Theme selection: dark, light, minimal, bold
- Logo and brand color injection

---

## Architecture

```
+--------------------------------------------------------------+
|                      CLIENT (Browser)                        |
|  React 18 - TypeScript - Slide Editor - Export Controls     |
+------------------------+-------------------------------------+
                         |
                         |  REST API
                         |
+------------------------v-------------------------------------+
|                    BACKEND (Node.js 20)                      |
|  Express 4 - ES Modules                                      |
|                                                              |
|  +-----------+  +----------+  +----------+  +----------+   |
|  |   GitHub  |  |   Repo   |  |   Slide  |  |  Export  |   |
|  |  OAuth    |  | Analyzer |  | Generator|  | Service  |   |
|  +-----------+  +----------+  +----------+  +----------+   |
|                      |              |                        |
|               AI API (LLM)    pptx / PDF libs              |
+------------------------+-------------------------------------+
                         |
+------------------------v-------------------------------------+
|                      MongoDB 7                               |
|  Users - Repos - Analyses - Decks - Slides                  |
+--------------------------------------------------------------+
```

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Runtime** | Node.js 20, TypeScript | Backend API |
| **Framework** | Express 4 | REST API routing |
| **Auth** | GitHub OAuth + JWT | Repo access + session |
| **Export** | pptxgenjs, puppeteer | PPTX and PDF export |
| **Frontend** | React 18, TypeScript | Slide editor UI |
| **Styling** | Tailwind CSS | Theme-aware design |
| **Database** | MongoDB 7, Mongoose | Deck and analysis storage |
| **CI** | GitHub Actions | Lint, type-check, build |

---

## Quick Start

### Option A: Docker

```bash
git clone https://github.com/avase33/pitchsync.git
cd pitchsync
cp .env.example .env
# Add GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET
docker compose up -d
```

| Service | URL |
|---|---|
| App | http://localhost:3000 |
| API | http://localhost:5000/api |

### Option B: Local Development

**Backend**

```bash
cd backend
npm install
cp ../.env.example .env
npm run dev
```

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

---

## Generated Slide Structure

| Slide | Content |
|---|---|
| 1. Cover | Project name, tagline, logo |
| 2. Problem | Pain point extracted from README |
| 3. Solution | Core product description and key value props |
| 4. Product Demo | Architecture diagram + screenshot placeholder |
| 5. Tech Differentiation | What makes your stack and approach novel |
| 6. Market | Category and positioning |
| 7. Traction | Commits, contributors, repo activity signals |
| 8. Business Model | Extracted from pricing/plans if present |
| 9. Roadmap | Next features from issues/TODO |
| 10. Team | Contributor profiles from GitHub |
| 11. Ask | Round size placeholder (editable) |
| 12. Contact | GitHub, email, links |

---

## Roadmap

- [ ] Direct Google Slides API export
- [ ] GitLab and Bitbucket support
- [ ] Pitch deck scoring: "How investor-ready is this deck?"
- [ ] Competitor comparison slide auto-generation
- [ ] Video walkthrough generation from deck
- [ ] Notion workspace integration
- [ ] Custom slide templates marketplace

---

## License

```
Copyright (c) 2026 Akhil Vase. All rights reserved.

This source code is the proprietary property of Akhil Vase.
Unauthorized copying, distribution, or modification is strictly prohibited.
```

---

<div align="center">

**Your code already tells the story. We just turn it into slides.**

*PitchSync -- From repo to raise-ready in minutes.*

</div>
