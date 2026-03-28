# Git Conventions — Trip Check

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
