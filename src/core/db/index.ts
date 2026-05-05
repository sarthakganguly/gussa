import { createRxDatabase, addRxPlugin, RxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { wrappedKeyEncryptionCryptoJsStorage } from 'rxdb/plugins/encryption-crypto-js';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';

import {
  dailyLogsSchema,
  clinicalVaultSchema,
  conversationsSchema,
  systemMetaSchema,
  sosLogsSchema
} from './schemas';

// Add DevMode plugin in development
if (import.meta.env.DEV) {
  addRxPlugin(RxDBDevModePlugin);
}

// Database instance singleton
let dbPromise: Promise<RxDatabase> | null = null;

export const initDatabase = async () => {
  if (dbPromise) return dbPromise;

  console.log('[DB] Starting initialization...');
  dbPromise = (async () => {
    try {
      // Wrap Dexie storage with Encryption
      const encryptedStorage = wrappedKeyEncryptionCryptoJsStorage({
        storage: getRxStorageDexie()
      });

      const db = await createRxDatabase({
        name: import.meta.env.VITE_RXDB_NAME || 'gussa_vault',
        storage: encryptedStorage,
        password: import.meta.env.VITE_RXDB_PASSWORD_SEED || 'sovereign_fallback_seed_32_chars_!!',
        multiInstance: false,
        eventReduce: true
      });

      console.log('[DB] Database created. Adding collections...');

      await db.addCollections({
        daily_logs: { schema: dailyLogsSchema },
        clinical_vault: { schema: clinicalVaultSchema },
        conversations: { schema: conversationsSchema },
        system_meta: { schema: systemMetaSchema },
        sos_logs: { schema: sosLogsSchema }
      });

      console.log('[DB] Collections added. Database ready.');
      return db;
    } catch (err) {
      console.error('[DB] Initialization failed:', err);
      dbPromise = null;
      throw err;
    }
  })();

  return dbPromise;
};

export const getDatabase = async () => {
  if (!dbPromise) return initDatabase();
  return dbPromise;
};
