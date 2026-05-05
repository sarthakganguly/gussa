Local Data Schema (RxDB Collections)
====================================

Our local-first database relies on NoSQL document collections. We use partial encryption: IDs and metadata remain unencrypted for fast querying, while sensitive user content is encrypted at rest.

1\. `daily_logs` Collection
---------------------------

Stores daily check-ins, mood, and deep journaling.

```
{
  "_id": "uuid-v4",
  "timestamp": "2026-04-26T07:45:00Z",
  "mood": {
    "score": 8,
    "label": "Grateful"
  },
  "activities": ["exercise", "deep_work"],
  "note_encrypted": "[ENCRYPTED_BLOB_OR_JWE]",
  "tags": ["health"]
}

```

2\. `clinical_vault` Collection
-------------------------------

Stores standardized assessments (PHQ-9, GAD-7).

```
{
  "_id": "uuid-v4",
  "type": "assessment",
  "category": "GAD-7",
  "score": 12,
  "data": {
    "q1": 2, "q2": 3, "q3": 1,
    "interpretation": "Moderate Anxiety"
  },
  "timestamp": "2026-04-25T20:00:00Z"
}

```

3\. `conversations` Collection
------------------------------

Stores the AI CBT reframing sessions.

```
{
  "_id": "uuid-v4",
  "title_encrypted": "[ENCRYPTED_STRING]",
  "messages": [
    {
      "role": "user",
      "content_encrypted": "[ENCRYPTED_STRING]",
      "timestamp": "2026-04-26T08:00:00Z"
    },
    {
      "role": "assistant",
      "content_encrypted": "[ENCRYPTED_STRING]",
      "metadata": {"framework": "CBT"}
    }
  ],
  "context_snapshot": { "recent_mood": 4 }
}

```

4\. `system_meta` Collection
----------------------------

Tracks app state, settings, and encryption setup.

```
{
  "_id": "user_preferences",
  "encryption_salt": "[LOCAL_ONLY_SALT_STRING]",
  "theme": "sovereign_warm",
  "streaks": {
    "current": 5,
    "longest": 12,
    "last_activity": "2026-04-26"
  }
}

```
