# Copilot Coding Agent Instructions — Trip Check

Trip Check is a mobile/web app built with **Angular 21**, **Ionic 8**, and **Capacitor 8** for managing trips and packing. Users create trips, organise items by location, use packing templates, and track item usage and losses. Data is stored locally via **SQLite** (Capacitor SQLite on native, `jeep-sqlite`/`sql.js` on web).

## Tech Stack

| Layer           | Technology                                                     |
| --------------- | -------------------------------------------------------------- |
| Framework       | Angular 21 (standalone components)                             |
| UI              | Ionic 8                                                        |
| Mobile bridge   | Capacitor 8                                                    |
| Language        | TypeScript 5.9, SCSS                                           |
| Icons           | `lucide-angular`, `ionicons`                                   |
| Database        | SQLite via `@capacitor-community/sqlite` + `jeep-sqlite`/`sql.js` (web) |
| Linter          | ESLint 9 + Angular ESLint + Prettier                           |
| Package manager | npm                                                            |

## Getting Started

```bash
npm install          # Install dependencies
npm run start        # Dev server at localhost:4200
npm run build        # Production build → output in www/
npm run lint         # Run ESLint + Prettier checks
npm run format:check # Check formatting with Prettier
npm run format:fix   # Auto-format all files with Prettier
```

## Detailed Guidelines

For in-depth guidance, consult the topic-specific files below — load only what is relevant to the task at hand:

| Topic | File |
| ----- | ---- |
| Project structure & layered architecture | [instructions/architecture.md](instructions/architecture.md) |
| Coding conventions (TypeScript, Angular, naming, formatting) | [instructions/coding-conventions.md](instructions/coding-conventions.md) |
| Performance & security | [instructions/performance-security.md](instructions/performance-security.md) |
| Database / SQLite / `DatabaseService` | [instructions/database.md](instructions/database.md) |
| Commit messages, PR titles & branch naming | [instructions/git-conventions.md](instructions/git-conventions.md) |
| Generating new components and services | [instructions/scaffolding.md](instructions/scaffolding.md) |
