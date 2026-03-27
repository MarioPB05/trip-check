# Coding Conventions — Trip Check

## Component Naming

- **Tab components** (e.g., `home-tab`, `item-tab`) use the `.component.ts` suffix and the `Component` class suffix.
- **Non-tab pages** (e.g., `manage-template`) use the `.component.ts` suffix and the `Component` class suffix.
- **Component selectors** must use the `app-` prefix in kebab-case (e.g., `app-home-tab`, `app-trip-button`).
- **Directive selectors** must use the `app` prefix in camelCase.

## Angular Patterns

- Most feature and shared components are **standalone**. The tabs shell (`features/tabs/`) uses NgModules (`tabs.module.ts`, `tabs-routing.module.ts`) — do not convert these to standalone.
- Use the `inject()` function for dependency injection instead of constructor injection.
- Use Angular **Signals** for reactive state where applicable.
- Lazy-load feature routes with `loadChildren` / `loadComponent`.

## TypeScript

- **Strict mode** is enabled (`strict: true`, `noImplicitOverride`, `noPropertyAccessFromIndexSignature`, `noImplicitReturns`, `noFallthroughCasesInSwitch`).
- Use path aliases for imports:
  - `@app/*` → `src/app/*`
  - `@core/*` → `src/app/core/*`
  - `@features/*` → `src/app/features/*`
  - `@shared/*` → `src/app/shared/*`
  - `@environments/*` → `src/environments/*`
  - `@assets/*` → `src/assets/*`

## Language

- **Code is written in English**: all identifiers (variables, functions, classes, files, selectors, etc.) must use English.
- **Comments should be written in Spanish** for new code. The codebase contains a mix of Spanish and English comments due to historical reasons; when adding or editing code, prefer Spanish for new inline comments, block comments, and JSDoc.

```typescript
// ✅ Preferido para código nuevo
// Calcula el total de artículos en la ubicación actual
const totalItems = locationItems.length;

// ⚠️ Aceptable en contexto existente (inglés histórico)
// Calculate total items in the current location
const totalItems = locationItems.length;
```

## Formatting

- **Prettier** is the formatter (auto-runs on save via VSCode settings).
- Single quotes, semicolons, 2-space indentation, trailing commas, 100-char print width.
- Run `npm run format:fix` to format all files.

## Styling

- Use **SCSS** for component styles.
- Use **Ionic CSS custom properties** (`--ion-color-*`) for theming.
- Custom theme variables are defined in `src/theme/variables.scss`.

## Testing

- **No testing framework is currently configured.**
- Do not add test files unless setting up the testing infrastructure first.

## Environment Files

- Environment files (`src/environments/environment.ts`, `src/environments/environment.prod.ts`) are **tracked in git** and should not contain secrets or sensitive credentials.
- If the app requires additional environment-specific configs (e.g. staging), define new files under `src/environments/` and wire them up via Angular's `fileReplacements` in `angular.json` so the correct file is used per build configuration.

## Mobile / Capacitor

- **Android project** lives in `android/`. Sync with `npx cap sync android`.
- **Capacitor config** is in `capacitor.config.ts`. App ID: `com.app.tripcheck`, web dir: `www`.
- The `sql-wasm.wasm` file from `sql.js` is copied to `www/assets/` during build (configured in `angular.json` assets).
