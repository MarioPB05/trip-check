# Performance & Security — Trip Check

## Performance

- **Avoid memory leaks**: Unsubscribe from Observables using `takeUntilDestroyed`, the `async` pipe, or explicit cleanup in `ngOnDestroy`. Release all resources when components are destroyed.
- **Change detection**: Prefer Signals and `OnPush` change detection to minimise unnecessary re-renders.
- **Lazy loading**: Keep feature routes and standalone components lazy-loaded via Angular routing (e.g., `loadChildren`, `loadComponent`). Avoid eagerly importing heavy dependencies.
- **Efficient DB access**: On **Web**, all DB writes and reads go through `DatabaseService`'s wrapped `conn.run`, `conn.execute`, and `conn.query` methods (patched by `wrapForAutoPersist()` at startup), which apply the internal lock and schedule auto-persist. On **native**, repositories use `db.withConn(...)` and call `conn.query` / `conn.run` directly as there is no auto-persist layer. Do not add extra locking on native. For batched writes, add or reuse a `DatabaseService` helper that wraps `executeSet` behind the same locking/auto-persist logic instead of calling `executeSet` directly. In all cases, avoid redundant queries.
- **Scalability**: Design services and repositories so that adding new data or features does not require rewriting existing logic.

## Security

- **No secrets in source code**: Never commit API keys, tokens, credentials, or other sensitive values. Store them in git-ignored files and, on devices, use platform-secure storage (OS keychain/keystore or a secure storage plugin) for secrets. Use `@capacitor/preferences` only for non-secret configuration data.
- **SQL injection prevention**: Always use parameterised queries (pass values as an array) in SQLite operations — never concatenate user input directly into SQL strings.
- **Input validation**: Validate and sanitise all user-provided input before processing or persisting it.
- **Dependency hygiene**: When adding or updating packages, verify there are no known vulnerabilities before committing.
