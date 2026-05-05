Current Task Context
====================

**Objective:** Android AICore (Gemini Nano) Integration **Status:** In Progress

Description
-----------

Integrate the local AI CBT Coach using Android AICore (Gemini Nano). This involves setting up the Capacitor bridge (or simulated bridge for web testing) and implementing the chat interface.

Constraints & Requirements
--------------------------

-   Strictly local inference. No external API calls.
-   Store chat sessions in the encrypted `conversations` collection.
-   Implement the "CBT Reframing" prompt engineering logic locally.
-   Provide a fallback/gate for devices that do not support AICore.

Next Steps Upon Completion
--------------------------
Once AI integration is verified, update this file to focus on "Unsupported Device Fallback & Daily Mental Health Card".
