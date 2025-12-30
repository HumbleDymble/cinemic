# [1.0.0] - 2025-12-30

## 🚀 The "Production Ready" Update

> **Note:** This release marks the official transition from 0.1.0 to 1.0.0. The application structure has been
> completely
> rewritten using Feature-Sliced Design (FSD), and we have introduced a full suite of social and administrative
> features.

### ✨ New Features

* **Smart API Integration**: The app now dynamically sources data based on language:
    * `Kinopoisk API` for Russian (RU) users.
    * `IMDb API` for English (EN) users.
* **Social & Real-time**:
    * Implemented real-time notifications via `socket.io`.
    * **Friends System**: Users can add friends and manage **Privacy Settings**.
    * **Reviews**: Users can write reviews (requires **Moderator** approval before publishing).
* **New Pages**:
    * `Admin-panel` & `Moderator-panel` for management.
    * `User-profile` (private) & `Public-profile` (public view).
    * `TitleGuesser` (minigame) & `Random-title`.
    * `Review-thread`.
    * `isBanned` screen.
* **Account**: Users can now update their `username` and `password`.

### 🎨 UI/UX

* **Theming**: Added dynamic Dark/Light mode switcher.
* **Localization**: Full `i18n` support for **English (EN)** and **Russian (RU)**.
* **Layout**: Implemented global `Footer`.

### 🏗️ Architecture & DevEx

* **FSD Structure**: Complete codebase refactor to **Feature-Sliced Design**.
* **Performance**:
    * Migrated to `swc-loader` (2x faster compilation in Dev/Prod).
    * Replaced all `MUI` imports with default imports to optimize tree-shaking.
* **Type Safety & Validation**:
    * Implemented **Brand types** for strict type compatibility.
    * Integrated `Valibot` for strict `env` schema validation.
    * Added `tests` for User authorization cycles.
* **Tooling**:
    * Integrated `@dotenvx` for secure cross-platform env management.
    * Added `Madge` scripts (`npm run dep:cycles:client`) to detect circular dependencies.
    * Server and Client now run as separate **ESM** processes with distinct `tsconfig` files.

### 🐛 Fixes

* **Critical**: Fixed a security issue where users remained authorized after logout.
* Fixed circular dependencies across the application.
* Fixed `EsLint` configuration compatibility.
* Resolved layout issues where users could bypass the Banned screen.

---
*This release includes many other minor tweaks and structural changes made during the rewrite.*