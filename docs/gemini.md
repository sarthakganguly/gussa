# Sovereign Vault (Gussa) - AI Engineering Directives

## 1. Core Mandates (Absolute Rules)
- **Zero-Cloud Policy:** NEVER introduce external network requests, third-party analytics, cloud logging (e.g., Firebase, Sentry), or external APIs.
- **Offline-First:** All features must work completely offline. Data never leaves the device.
- **Local AI Only:** AI features must strictly use Android AICore (Gemini Nano) via the custom Capacitor bridge. Do NOT use external LLM APIs (OpenAI, Anthropic, etc.).

## 2. Tech Stack Constraints
- **Frontend:** React 19 + Vite + TypeScript (Strict Mode).
- **Native Bridge:** Capacitor 7.0.
- **Database:** RxDB with Dexie storage adapter (NoSQL).
- **Styling:** Tailwind CSS using the "Sovereign Hearth" palette.

## 3. Architecture & State Management
- **Feature-Sliced Design:** Maintain strict boundaries. Code lives in `src/core/`, `src/features/`, `src/shared/`, or `src/theme/`.
- **Logic Separation:** UI components must be functional and purely presentational. All business logic and database interactions MUST be encapsulated in custom hooks (e.g., `useJournal`, `useAI`).
- **Optimistic UI:** Database writes should immediately update local state. Avoid loading spinners for local actions.

## 4. Security & Privacy
- **Encryption:** All sensitive database fields MUST be encrypted using AES-GCM with PBKDF2 key derivation (Sovereign Salt).
- **Logging:** Wrap all `console.log` calls in the local `Logger` service. NEVER log PII, journal contents, or AI chat strings. Mirror `ERROR` and `WARN` to the internal RxDB `app_logs` collection.

## 5. Coding Standards
- **TypeScript:** No `any`. Enforce explicit return types for all functions and hooks.
- **Naming Conventions:** `kebab-case` for files, `PascalCase` for React components, `camelCase` for functions/variables.
