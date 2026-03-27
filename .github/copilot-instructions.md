# Copilot Coding Agent Instructions — Trip Check

## Project Overview

Trip Check is a mobile/web application built with **Angular 21**, **Ionic 8**, and **Capacitor 8** that helps users manage their trips and packing. Users can create trips, organise items by location, use packing templates, and track item usage, losses, and additions during travel. Data is stored locally via **SQLite** (Capacitor SQLite plugin on native, `jeep-sqlite`/`sql.js` on web).

## Tech Stack

| Layer           | Technology                                                     |
| --------------- | -------------------------------------------------------------- |
| Framework       | Angular 21 (standalone components)                             |
| UI              | Ionic 8                                                        |
| Mobile bridge   | Capacitor 8                                                    |
| Language        | TypeScript 5.9, SCSS                                           |
| Icons           | `lucide-angular`, `ionicons`                                   |
| Database        | SQLite via `@capacitor-community/sqlite` + `jeep-sqlite` (web) |
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

## Code Quality Standards

### Senior Developer Mindset

When generating or reviewing code for this project, apply the standards of a senior developer:

- **Clean code**: Keep functions and classes small, focused, and easy to understand. Favour readability over cleverness.
- **Well-structured**: Follow the project's [layered architecture](#layered-architecture). Place every piece of code in the correct layer.
- **Descriptive naming**: Use clear, self-documenting names for variables, functions, classes, and files. Avoid abbreviations unless widely understood (e.g., `id`, `url`, `db`).
- **Comments**: Add comments only when they explain _why_ something is done, not _what_ it does. Complex logic, non-obvious decisions, or workarounds warrant a brief explanation.
- **Framework conventions**: Follow Angular, Ionic, TypeScript, and RxJS idioms as they apply to the versions used in this project.

### Version Awareness

Always consult `package.json` and use features appropriate to the versions in use. Do not suggest patterns, APIs, or workarounds that are deprecated or superseded by the versions listed below.

| Package        | Version | Key modern features to use                                                                                           |
| -------------- | ------- | -------------------------------------------------------------------------------------------------------------------- |
| Angular        | ^21     | Signals (`signal`, `computed`, `effect`), standalone components, `inject()`, built-in control flow (`@if`, `@for`)  |
| TypeScript     | ~5.9    | Strict mode, template literal types, `satisfies` operator, `using` keyword for resource management                  |
| RxJS           | ~7.8    | Pipeable operators, `takeUntilDestroyed`, avoid deprecated patterns (e.g., `toPromise()`)                           |
| Ionic          | ^8      | Current component APIs; avoid deprecated Ionic 4/5 patterns                                                         |
| Capacitor      | ^8      | Current plugin APIs; always handle the web fallback                                                                  |
| ESLint         | ^9      | Using legacy `.eslintrc.json` config; ESLint 9 supports flat config but this project hasn't migrated yet — Copilot should not suggest adding `eslint.config.*` by default |

### Performance & Security

Keep the following in mind when writing or reviewing code.

#### Performance

- **Avoid memory leaks**: Unsubscribe from Observables using `takeUntilDestroyed`, the `async` pipe, or explicit cleanup in `ngOnDestroy`. Release all resources when components are destroyed.
- **Change detection**: Prefer Signals and `OnPush` change detection to minimise unnecessary re-renders.
- **Lazy loading**: Keep feature routes and standalone components lazy-loaded via Angular routing (e.g., `loadChildren`, `loadComponent`). Avoid eagerly importing heavy dependencies.
- **Efficient DB access**: Always go through `DatabaseService` public methods that are wrapped with its internal lock and web auto-persist; if you need batched writes, use a `DatabaseService` helper that safely wraps `executeSet` (rather than calling it directly) so locking and persistence guarantees are preserved; avoid redundant queries.
- **Scalability**: Design services and repositories so that adding new data or features does not require rewriting existing logic.

#### Security

- **No secrets in source code**: Never commit API keys, tokens, credentials, or other sensitive values. Store them in git-ignored environment files and, on devices, use platform-secure storage (OS keychain/keystore or a secure storage plugin) for secrets. Use `@capacitor/preferences` only for non-secret configuration data.
- **SQL injection prevention**: Always use parameterised queries (pass values as an array) in SQLite operations — never concatenate user input directly into SQL strings.
- **Input validation**: Validate and sanitise all user-provided input before processing or persisting it.
- **Dependency hygiene**: When adding or updating packages, verify there are no known vulnerabilities before committing.

## Project Structure

```
src/
├── app/
│   ├── core/                    # Business logic layer
│   │   ├── consts/              # Constant values and configuration objects
│   │   ├── interfaces/          # TypeScript interfaces for shared contracts
│   │   ├── models/              # Data model interfaces and types
│   │   ├── repositories/        # Data-access layer (SQL queries)
│   │   ├── services/            # Application services (business-logic facades)
│   │   ├── types/               # Shared TypeScript type definitions
│   │   └── utilities/           # Helper/utility functions
│   ├── features/                # Feature pages (lazy-loaded)
│   │   ├── tabs/                # Tab navigation shell and routing
│   │   ├── home-tab/            # Home/dashboard page
│   │   ├── item-tab/            # Items management page
│   │   ├── template-tab/        # Templates browsing page
│   │   ├── manage-template/     # Template creation/editing page
│   │   └── <feature>/           # Each feature may also contain:
│   │       ├── components/      # Components used only within this feature
│   │       └── services/        # Feature-specific services (call core repositories)
│   ├── shared/                  # Reusable UI components
│   │   └── components/          # Shared standalone components
│   ├── app.component.ts         # Root component (initialises DB)
│   ├── app.module.ts            # Root NgModule
│   └── app-routing.module.ts    # Root routing (lazy-loads tabs)
├── assets/
│   └── db/migrations/           # Numbered SQL migration scripts (001_*.sql, 002_*.sql, etc.)
├── theme/                       # Ionic theme variables and custom SCSS
├── global.scss
├── index.html
├── main.ts
└── polyfills.ts
```

## Architecture & Patterns

### Layered Architecture

Follow this strict layering when adding code:

1. **Models / Interfaces** (`core/models/`, `core/interfaces/`) — Pure TypeScript interfaces, enums, constants, and utility functions. No dependencies on services or repositories.
2. **Repositories** (`core/repositories/`) — Data-access classes that run SQL against `DatabaseService`. Inject `DatabaseService`.
3. **Services** (`core/services/`) — Business-logic facades. Inject repositories, never run SQL directly.
4. **Features** (`features/`) — Page-level components. Inject services. Each feature may contain its own `components/` subfolder for components used only within that feature, and a `services/` subfolder for feature-specific services that call core repositories.
5. **Shared** (`shared/components/`) — Reusable UI components with `@Input`/`@Output` bindings, no service injection.

### Database

- **`DatabaseService`** manages the SQLite connection, migrations, locking, and web-platform auto-persist.
- Migrations live in `src/assets/db/migrations/` as numbered `.sql` files (`001_init.sql`, `002_seed_default_items.sql`, etc.).
- To add a new migration: create the next numbered file and increment `dbVersion` in `database.service.ts`.
- The service uses a lock (`withLock`) to serialise concurrent DB operations and tracks transaction depth.

### Routing

- Feature routes are lazy-loaded. The root route loads `tabs-routing.module.ts`, which defines child routes for each tab.
- Each feature page is a standalone Angular component.

## Coding Conventions

### Component Naming

- **Tab components** (e.g., `home-tab`, `item-tab`) use the `.component.ts` suffix and the `Component` class suffix.
- **Non-tab pages** (e.g., `manage-template`) use the `.component.ts` suffix and the `Component` class suffix.
- **Component selectors** must use the `app-` prefix in kebab-case (e.g., `app-home-tab`, `app-trip-button`).
- **Directive selectors** must use the `app` prefix in camelCase.

### Angular Patterns

- All feature and shared components are **standalone** (no NgModules inside features/shared).
- Use `inject()` function for dependency injection instead of constructor injection.
- Use Angular **Signals** for reactive state where applicable.
- Lazy-load feature routes with `loadChildren` / `loadComponent`.

### TypeScript

- **Strict mode** is enabled (`strict: true`, `noImplicitOverride`, `noPropertyAccessFromIndexSignature`, `noImplicitReturns`, `noFallthroughCasesInSwitch`).
- Use path aliases for imports:
  - `@app/*` → `src/app/*`
  - `@core/*` → `src/app/core/*`
  - `@features/*` → `src/app/features/*`
  - `@shared/*` → `src/app/shared/*`
  - `@environments/*` → `src/environments/*`
  - `@assets/*` → `src/assets/*`

### Language

- **Code is written in English**: all identifiers (variables, functions, classes, files, selectors, etc.) must use English.
- **Comments are written in Spanish**: inline comments, block comments, and JSDoc must be in Spanish.

```typescript
// ✅ Correcto
// Calcula el total de artículos en la ubicación actual
const totalItems = locationItems.length;

// ❌ Incorrecto — comentario en inglés
// Calculate total items in the current location
const totalItems = locationItems.length;
```

### Formatting

- **Prettier** is the formatter (auto-runs on save via VSCode settings).
- Single quotes, semicolons, 2-space indentation, trailing commas, 100-char print width.
- Run `npm run format:fix` to format all files.

### Styling

- Use **SCSS** for component styles.
- Use **Ionic CSS custom properties** (`--ion-color-*`) for theming.
- Custom theme variables are defined in `src/theme/variables.scss`.

## Testing

- **No testing framework is currently configured.** Tests are explicitly skipped via `"skipTests": true` in Angular schematics.
- Do not add test files unless setting up the testing infrastructure first.

## Mobile / Capacitor

- **Android project** lives in `android/`. Sync with `npx cap sync android`.
- **Capacitor config** is in `capacitor.config.ts`. App ID: `com.app.tripcheck`, web dir: `www`.
- The `sql-wasm.wasm` file from `sql.js` is copied to `www/assets/` during build (configured in `angular.json` assets).

## Environment Files

- Environment files (`src/environments/`) are git-ignored. They are not checked in.
- If the app requires environment-specific config, create `src/environments/environment.ts` and `environment.prod.ts` locally.

## Commit Messages

This project uses **[gitmoji](https://gitmoji.dev/)** for commit messages. Each commit starts with a relevant emoji followed by a short, concise description.

### Common gitmoji used in this project

| Emoji | Code                     | Use for                              |
| ----- | ------------------------ | ------------------------------------ |
| ✨    | `:sparkles:`             | New feature                          |
| 🐛    | `:bug:`                  | Bug fix                              |
| 🚑️    | `:ambulance:`            | Critical hotfix                      |
| ♻️    | `:recycle:`              | Refactor code                        |
| 🎨    | `:art:`                  | Improve code structure or formatting |
| 🚧    | `:construction:`         | Work in progress                     |
| ⚡️    | `:zap:`                  | Improve performance                  |
| 🔥    | `:fire:`                 | Remove code or files                 |
| 💄    | `:lipstick:`             | UI or style changes                  |
| ✏️    | `:pencil2:`              | Fix typos                            |
| 🚸    | `:children_crossing:`    | Improve UX or usability              |
| 📱    | `:iphone:`               | Mobile responsive or device fixes    |
| 📝    | `:memo:`                 | Documentation                        |
| 🔒️    | `:lock:`                 | Security fix                         |
| 🔧    | `:wrench:`               | Configuration changes                |
| 📦️    | `:package:`              | Build artifacts or packages          |
| 🗃️    | `:card_file_box:`        | Database or storage changes          |
| ⬆️    | `:arrow_up:`             | Upgrade dependencies                 |
| ⬇️    | `:arrow_down:`           | Downgrade dependencies               |
| ➕    | `:heavy_plus_sign:`      | Add dependency                       |
| ➖    | `:heavy_minus_sign:`     | Remove dependency                    |
| 🚚    | `:truck:`                | Move or rename files                 |
| 🔊    | `:loud_sound:`           | Add or update logs                   |
| 🔇    | `:mute:`                 | Remove logs                          |
| 🌐    | `:globe_with_meridians:` | Internationalisation                 |
| 💥    | `:boom:`                 | Breaking changes                     |
| 🥅    | `:goal_net:`             | Catch errors                         |
| 💫    | `:dizzy:`                | Animations and transitions           |
| 🧱    | `:bricks:`               | Infrastructure                       |
| 🧑‍💻    | `:technologist:`         | Developer experience                 |
| 🦺    | `:safety_vest:`          | Validation                           |
| ✈️    | `:airplane:`             | Offline support                      |

### Format

```
<gitmoji> <Short imperative description>
```

### Examples from this project

```
✨ Add template application flow to trip creation
🐛 Fix item quantity reset on location change
💄 Update tab bar icons and styling
🗃️ Add trip location schema migration
♻️ Refactor item repository queries
🔧 Configure Angular schematics to skip test generation
🚚 Move shared components to correct folder
```

Keep messages **short and concise** — describe _what_ was done, not _how_.

## Pull Request Titles

Pull Request titles on GitHub follow the **same gitmoji convention** as commit messages: start with the relevant emoji, followed by a short imperative description in English.

### Format

```
<gitmoji> <Short imperative description>
```

### Examples

```
✨ Add packing template creation flow
🐛 Fix item loss tracking on trip completion
♻️ Refactor trip repository queries
💄 Update home tab card layout
🗃️ Add location items migration
```

## Branch Naming

Use a prefix that reflects the type of work, followed by a **concise** kebab-case name.

| Prefix      | Use for                       |
| ----------- | ----------------------------- |
| `feature/`  | New functionalities           |
| `bugfix/`   | Bug fixes                     |
| `hotfix/`   | Urgent production fixes       |
| `refactor/` | Code refactoring              |
| `docs/`     | Documentation updates         |
| `test/`     | Tests and test improvements   |
| `chore/`    | Maintenance and general tasks |

### Format

```
<prefix>/<concise-name>
```

### Examples

```
feature/add-template-import
bugfix/item-quantity-reset
hotfix/db-crash-on-startup
refactor/trip-service-optimisation
docs/readme-update
chore/update-dependencies
```

## Generating New Code

When scaffolding new components or pages, use the Angular/Ionic CLI:

```bash
# New standalone component (tests are skipped by default via angular.json)
npx ng generate component shared/components/my-component --standalone

# New feature tab component
npx ng generate component features/my-feature-tab --standalone

# New non-tab feature page
npx ng generate component features/my-feature --standalone

# New feature-specific component (only used within that feature)
npx ng generate component features/my-feature-tab/components/my-widget --standalone

# New feature-specific service (calls core repositories)
npx ng generate service features/my-feature-tab/services/my-service

# New core service
npx ng generate service core/services/my-service

# New interface/model
npx ng generate interface core/models/my-model model
```
