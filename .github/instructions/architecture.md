# Architecture — Trip Check

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
│   │   ├── tabs/                # Tab navigation shell (NgModule-based)
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

## Layered Architecture

Follow this strict layering when adding code:

1. **Models / Interfaces** (`core/models/`, `core/interfaces/`) — Pure TypeScript interfaces, enums, constants, and utility functions. No dependencies on services or repositories.
2. **Repositories** (`core/repositories/`) — Data-access classes that run SQL against `DatabaseService`. Inject `DatabaseService`.
3. **Services** (`core/services/`) — Business-logic facades. Inject repositories, never run SQL directly.
4. **Features** (`features/`) — Page-level components. Inject services. Each feature may contain its own `components/` subfolder for components used only within that feature, and a `services/` subfolder for feature-specific services that call core repositories.
5. **Shared** (`shared/components/`) — Reusable UI components with `@Input`/`@Output` bindings. Avoid injecting app/core services; limited use of framework UI controllers (e.g., Ionic `ModalController` for error modals) is allowed and should be kept minimal and well-documented.

## Routing

- Feature routes are lazy-loaded. The root route lazy-loads `features/tabs/tabs.module.ts`, which in turn imports `tabs-routing.module.ts` to define child routes for each tab.
- Each feature page is a standalone Angular component.
- The tabs shell (`features/tabs/`) uses NgModules (`tabs.module.ts`, `tabs-routing.module.ts`) — do not convert these to standalone.

## Code Quality Standards

When generating or reviewing code for this project, apply the standards of a senior developer:

- **Clean code**: Keep functions and classes small, focused, and easy to understand. Favour readability over cleverness.
- **Well-structured**: Place every piece of code in the correct layer described above.
- **Descriptive naming**: Use clear, self-documenting names for variables, functions, classes, and files. Avoid abbreviations unless widely understood (e.g., `id`, `url`, `db`).
- **Comments**: Add comments only when they explain _why_ something is done, not _what_ it does. Complex logic, non-obvious decisions, or workarounds warrant a brief explanation.
- **Framework conventions**: Follow Angular, Ionic, TypeScript, and RxJS idioms as they apply to the versions used in this project.

## Version Awareness

Always consult `package.json` and use features appropriate to the versions in use. Do not suggest patterns, APIs, or workarounds that are deprecated or superseded by the versions listed below.

| Package    | Version | Key modern features to use                                                                                                                         |
| ---------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Angular    | ^21     | Signals (`signal`, `computed`, `effect`), standalone components, `inject()`, built-in control flow (`@if`, `@for`)                                 |
| TypeScript | ~5.9    | Strict mode, template literal types, `satisfies` operator, `using` keyword for resource management                                                 |
| RxJS       | ~7.8    | Pipeable operators, `takeUntilDestroyed`, avoid deprecated patterns (e.g., `toPromise()`)                                                          |
| Ionic      | ^8      | Current component APIs; avoid deprecated Ionic 4/5 patterns                                                                                        |
| Capacitor  | ^8      | Current plugin APIs; always handle the web fallback                                                                                                |
| ESLint     | ^9      | Using legacy `.eslintrc.json` config; ESLint 9 supports flat config but this project hasn't migrated yet — do not suggest adding `eslint.config.*` |
