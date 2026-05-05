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

-   [ ] Initialize React/Vite + Capacitor environment inside Docker.

-   [ ] Configure Tailwind CSS with "Sovereign Hearth" color palette.

-   [ ] Build the "Anti-App" HUD (Main Dashboard).

-   [ ] Setup RxDB Local Database and schemas.

-   [ ] Implement Emergency SOS breathing pacer.

-   [ ] Implement Micro-Journaling (Mood + Activities).

-   [ ] Integrate Android AICore (Gemini Nano) for CBT Coach.

-   [ ] Build "Unsupported Device" fallback/gate.

-   [ ] Implement Clinical Baseline module (PHQ-9 / GAD-7).

Phase 2: Retention & Media
--------------------------

-   [ ] Implement Procedural Soundscapes (Web Audio API).

-   [ ] Build offline Gamification Engine (Streaks/Badges).

-   [ ] Develop Pattern Discovery logic (Mood vs. Activities).

-   [ ] Implement Local device notifications.

Phase 3: Platform Expansion
---------------------------

-   [ ] Capacitor iOS Configuration & Build pipeline.
Local Security & Encryption Protocol
====================================

Because the Sovereign Vault promises zero data exfiltration, the local device is the only attack vector we must defend against.

1\. Key Generation & Derivation
-------------------------------

-   **The "Sovereign Salt":** On first launch, a random cryptographic salt is generated and saved in the `system_meta` collection.

-   **Key Derivation Function (KDF):** We use `PBKDF2` (via the Web Crypto API) combining the Sovereign Salt with either the Device Biometric token or a user-defined Vault PIN to derive a 256-bit AES key.

-   **Volatility:** The AES master key is kept **only in RAM (memory)** and is wiped when the app goes into the background or is closed.

2\. Data at Rest (RxDB)
-----------------------

-   Only highly sensitive fields (`note_encrypted`, `messages.content_encrypted`) are encrypted.

-   **Algorithm:** `AES-GCM` with a 96-bit Initialization Vector (IV). The IV must be generated fresh for every single database write and prepended to the ciphertext.

-   Dates, scores, and activity IDs remain plaintext to allow RxDB indexing and charting without decrypting the entire database.

3\. AI Data Sovereignty
-----------------------

-   **AICore Constraint:** When passing data to the Android Gemini Nano instance, ensure system-level logging is disabled (e.g., `store_history: false`).

-   **Zero-Trace Memory:** Upon navigating away from the AI Coach view, trigger a React cleanup function that explicitly clears the conversation array from the application's React state.

4\. Export & Portability
------------------------

-   When the user requests a data export, the app decrypts the NoSQL records in memory and generates a standard JSON or Markdown file.

-   This file is then saved to the device's public `Downloads` folder via the Capacitor Filesystem API.
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
