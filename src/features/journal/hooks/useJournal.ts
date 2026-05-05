import { useState, useCallback } from 'react';
import { getDatabase } from '../../../core/db';
import { generateUUID } from '../../../shared/utils/uuid';

export const useJournal = () => {
  const [isSaving, setIsSaving] = useState(false);

  const saveEntry = useCallback(async (entry: {
    mood: { score: number; label: string };
    activities: string[];
    note: string;
    tags: string[];
  }) => {
    setIsSaving(true);
    try {
      const db = await getDatabase();
      console.log('[Journal] Saving entry to local vault...');
      
      await db.daily_logs.insert({
        _id: generateUUID(),
        timestamp: new Date().toISOString(),
        mood: entry.mood,
        activities: entry.activities,
        note_encrypted: entry.note, // RxDB will encrypt this automatically based on schema
        tags: entry.tags
      });

      // Update system_meta for streaks
      const metaDoc = await db.system_meta.findOne('user_preferences').exec();
      const today = new Date().toISOString().split('T')[0];
      
      if (metaDoc) {
        const lastActivity = metaDoc.streaks.last_activity;
        let newStreak = metaDoc.streaks.current;
        
        if (lastActivity !== today) {
          // Simplistic streak logic: if yesterday, increment. If older, reset to 1.
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];
          
          if (lastActivity === yesterdayStr) {
            newStreak += 1;
          } else {
            newStreak = 1;
          }
          
          await metaDoc.patch({
            streaks: {
              ...metaDoc.streaks,
              current: newStreak,
              longest: Math.max(newStreak, metaDoc.streaks.longest),
              last_activity: today
            }
          });
        }
      } else {
        // First entry ever
        await db.system_meta.insert({
          _id: 'user_preferences',
          encryption_salt: generateUUID(),
          theme: 'sovereign_warm',
          streaks: {
            current: 1,
            longest: 1,
            last_activity: today
          }
        });
      }

      console.log('[Journal] Entry saved securely.');
      return true;
    } catch (err) {
      console.error('[Journal] Save failed:', err);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, []);

  return { saveEntry, isSaving };
};
