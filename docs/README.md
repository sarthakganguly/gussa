The Sovereign Vault
===================

An offline-only, privacy-first mental health sanctuary designed for the Digital Hermit.

Project Philosophy
------------------

-   **Vibe:** Warm, Soothing, Grounded Optimism (Soft geometry, tactile feedback).

-   **Hardware Target:** Physical Android Flagships (via Capacitor).

-   **AI Strategy:** 100% Local Inference using Android AICore (Gemini Nano).

-   **Local-First Rule:** Absolutely no external API calls, cloud-syncing, or remote analytics allowed in Phase 1.

Technical Stack
---------------

-   React 19 + Vite + TypeScript

-   Tailwind CSS

-   RxDB (NoSQL Local Storage)

-   Capacitor 7.0

Development Environment Setup (Docker + Physical Device)
--------------------------------------------------------

1.  **Start the Docker Container:** Run the following on your ThinkPad server to spin up the Vite dev environment.

    ```
    docker-compose up --build

    ```

2.  **Establish the Device Bridge:** Connect your physical Android device to your workstation (which is connected to the ThinkPad). Run the following ADB command to tunnel the local port:

    ```
    adb reverse tcp:5173 tcp:5173

    ```

3.  **AI Context:** If you are an AI assistant (like Gemini CLI) reading this, please review `docs/PRD.md` and `docs/gemini.md` to understand the architectural guardrails before writing code. Always check `.context/CURRENT_TASK.md` for your immediate objective.
