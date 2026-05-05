Technical Architecture & Style Guide
====================================

1\. The Sovereign Stack
-----------------------

-   **Frontend:** React 19 + Vite + TypeScript (Strict Mode)

-   **Native Bridge:** Capacitor 7.0

-   **Local Database:** RxDB (with Dexie storage adapter)

-   **AI Engine:** Android AICore (Gemini Nano) via custom Capacitor plugin/bridge.

-   **Styling:** Tailwind CSS (Utility-first, bound to `tailwind.config.js` theme).

2\. Development Workflow (Docker-to-Device Bridge)
--------------------------------------------------

-   **Host:** ThinkPad Server running Docker (`node:22-alpine` container running Vite).

-   **Workstation:** Runs Android Studio for native binary builds.

-   **Device:** Physical Android phone connected via USB/Network ADB.

-   **Tunnel Command:** `adb reverse tcp:5173 tcp:5173` for live reload without an emulator.

3\. Directory Structure (Feature-Sliced)
----------------------------------------

```
src/
├── core/           # Database (RxDB), AI Bridge, Encryption logic
├── features/       # Modular features (sos/, journal/, ai-coach/)
│   ├── [feature]/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── types.ts
├── shared/         # Common UI components (buttons, cards)
└── theme/          # Design system tokens (colors, fonts)

```

4\. Coding Style & Standards
----------------------------

-   **Language:** TypeScript only. No `any`. Explicit return types.

-   **Components:** Functional Components + Hooks. Logic lives in custom hooks (`useJournal`, `useAI`), never in the UI component.

-   **Naming Conventions:** `kebab-case` for files, `PascalCase` for components, `camelCase` for functions/variables.

-   **Optimistic UI:** Database writes should immediately update the local state without loading spinners.

5\. Logging Protocol
--------------------

-   **No Cloud Loggers allowed.**

-   **Local Mirroring:** Wrap `console.log` into a local `Logger` service. In production/device testing, mirror `ERROR` and `WARN` to an internal RxDB `app_logs` collection.

-   **Privacy:** Never log PII, journal contents, or AI chat strings. Log events only (e.g., "Journal saved", "AI Core Init Failed").
