# Database — Trip Check

## DatabaseService

`DatabaseService` manages the SQLite connection, migrations, locking, and web-platform auto-persist. It is the single point of entry for all database operations.

### Web vs Native behaviour

| Concern         | Web                                                                                                                                                                     | Native                                                                         |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Auto-persist    | `wrapForAutoPersist()` patches `conn.run`, `conn.execute`, and `conn.query` at startup to apply the internal lock and schedule a debounced `saveToStore()` after writes | No wrapping; data is persisted by the SQLite plugin itself                     |
| Locking         | Enforced automatically by the patched methods on Web                                                                                                                    | Not applied; avoid adding manual locking on native                             |
| Calling pattern | Repositories call `db.withConn(fn)` — the wrapped methods guarantee locking/persist transparently                                                                       | Repositories call `db.withConn(fn)` and use `conn.query` / `conn.run` directly |

### Rules for repositories

- Always obtain a connection via `db.withConn(fn)` — never access the raw connection directly.
- Do not call `conn.executeSet` directly. If you need batched writes, add or reuse a `DatabaseService` helper that wraps `executeSet` behind the same locking/auto-persist logic.
- Never run SQL directly from a service; SQL belongs exclusively in repositories.
- Always use **parameterised queries** (values passed as an array) — never concatenate user input into SQL strings.

### Migrations

- Migration files live in `src/assets/db/migrations/` as numbered `.sql` files (`001_init.sql`, `002_seed_default_items.sql`, …).
- To add a new migration:
  1. Create the next numbered `.sql` file in `src/assets/db/migrations/`.
  2. Add a corresponding entry to the `migrations` array in `database.service.ts`.
  3. If `database.service.ts` defines a schema version constant (e.g., `dbVersion`), ensure its value and any related logic remain consistent with the migrations list; the numbered SQL files and `migrations` array are the source of truth for schema evolution.
- **Do not** include `BEGIN` / `COMMIT` / `ROLLBACK` statements in migration scripts — the service handles transactionality internally.
