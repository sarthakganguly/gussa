Current Task Context
====================

**Objective:** Project Initialization & Scaffolding **Status:** Not Started

Description
-----------

Set up the initial React 19 + Vite project with Tailwind CSS and Capacitor 7.0. Establish the directory structure as defined in `docs/gemini.md`.

Constraints & Requirements
--------------------------

-   Do not install any backend libraries (e.g., Firebase, Supabase).
The Sovereign Vault: Project Roadmap
====================================

Update this file by changing `[ ]` to `[x]` as tasks are completed.

Phase 1: The Android "Sovereign" MVP
------------------------------------

-   [x] Initialize React/Vite + Capacitor environment inside Docker.

-   [x] Configure Tailwind CSS with "Sovereign Hearth" color palette.

-   [x] Build the "Anti-App" HUD (Main Dashboard).


-   [x] Setup RxDB Local Database and schemas.

-   [x] Implement Emergency SOS breathing pacer.

-   [x] Implement Micro-Journaling (Mood + Activities).

-   [ ] Integrate Android AICore (Gemini Nano) for CBT Coach.

-   [ ] Build "Unsupported Device" fallback/gate.

-   [x] Implement Clinical Baseline module (PHQ-9 / GAD-7).

Phase 2: Retention & Media
--------------------------

-   [ ] Implement Procedural Soundscapes (Web Audio API).

-   [ ] Build offline Gamification Engine (Streaks/Badges).

-   [ ] Develop Pattern Discovery logic (Mood vs. Activities).

-   [ ] Implement Local device notifications.

Phase 3: Platform Expansion
---------------------------

-   [ ] Capacitor iOS Configuration & Build pipeline.

-   [ ] Audio Content Engine for guided tracks.

-   [ ] Integrate text/audio Structured Packs.

-   [ ] Implement "Pro" license key unlock mechanism.

Phase 4: Sovereignty 2.0
------------------------

-   [ ] Develop Peer-to-Peer (P2P) sync engine.

-   [ ] Implement Biometric Vault Lock (FaceID/Fingerprint).
-   Use `pnpm` or `npm` strictly inside the Docker container.

-   Configure `tailwind.config.js` with the "Sovereign Hearth" palette (Soft Parchment, Deep Walnut, Morning Sage, Terracotta Dust).

-   Ensure `src/` follows the feature-sliced architecture.

Next Steps Upon Completion
--------------------------

Once scaffolding and Tailwind configuration are verified, update this file to focus on "RxDB Setup & Schema Initialization".
