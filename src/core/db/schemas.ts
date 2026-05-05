import { RxJsonSchema } from 'rxdb';

// Daily Logs: Mood, Activities, and Encrypted Notes
export const dailyLogsSchema: RxJsonSchema<any> = {
  title: 'daily_logs schema',
  version: 0,
  description: 'Stores daily check-ins, mood, and deep journaling',
  primaryKey: '_id',
  type: 'object',
  properties: {
    _id: {
      type: 'string',
      maxLength: 100
    },
    timestamp: {
      type: 'string',
      format: 'date-time'
    },
    mood: {
      type: 'object',
      properties: {
        score: { type: 'number', minimum: 0, maximum: 10 },
        label: { type: 'string' }
      }
    },
    activities: {
      type: 'array',
      items: { type: 'string' }
    },
    note_encrypted: {
      type: 'string'
    },
    tags: {
      type: 'array',
      items: { type: 'string' }
    }
  },
  required: ['_id', 'timestamp', 'mood'],
  encrypted: ['note_encrypted']
};

// Clinical Vault: Assessments (PHQ-9, GAD-7)
export const clinicalVaultSchema: RxJsonSchema<any> = {
  title: 'clinical_vault schema',
  version: 0,
  description: 'Stores standardized assessments',
  primaryKey: '_id',
  type: 'object',
  properties: {
    _id: { type: 'string', maxLength: 100 },
    type: { type: 'string' }, // 'assessment'
    category: { type: 'string' }, // 'GAD-7', 'PHQ-9'
    score: { type: 'number' },
    data: { type: 'object' },
    timestamp: { type: 'string', format: 'date-time' }
  },
  required: ['_id', 'type', 'category', 'score', 'timestamp']
};

// Conversations: AI CBT Reframing Sessions
export const conversationsSchema: RxJsonSchema<any> = {
  title: 'conversations schema',
  version: 0,
  description: 'Stores AI CBT reframing sessions',
  primaryKey: '_id',
  type: 'object',
  properties: {
    _id: { type: 'string', maxLength: 100 },
    title_encrypted: { type: 'string' },
    messages: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          role: { type: 'string' }, // 'user', 'assistant'
          content: { type: 'string' },
          timestamp: { type: 'string', format: 'date-time' },
          metadata: { type: 'object' }
        }
      }
    },
    context_snapshot: { type: 'object' }
  },
  required: ['_id', 'messages'],
  encrypted: ['title_encrypted', 'messages']
};

// System Meta: User preferences and encryption salt
export const systemMetaSchema: RxJsonSchema<any> = {
  title: 'system_meta schema',
  version: 0,
  description: 'Tracks app state and settings',
  primaryKey: '_id',
  type: 'object',
  properties: {
    _id: { type: 'string', maxLength: 100 },
    encryption_salt: { type: 'string' },
    theme: { type: 'string' },
    streaks: {
      type: 'object',
      properties: {
        current: { type: 'number' },
        longest: { type: 'number' },
        last_activity: { type: 'string' }
      }
    }
  },
  required: ['_id']
};

// SOS Logs (Requested in CURRENT.md)
export const sosLogsSchema: RxJsonSchema<any> = {
  title: 'sos_logs schema',
  version: 0,
  description: 'Logs of emergency SOS sessions',
  primaryKey: '_id',
  type: 'object',
  properties: {
    _id: { type: 'string', maxLength: 100 },
    timestamp: { type: 'string', format: 'date-time' },
    duration_seconds: { type: 'number' },
    intensity_before: { type: 'number' },
    intensity_after: { type: 'number' }
  },
  required: ['_id', 'timestamp']
};
