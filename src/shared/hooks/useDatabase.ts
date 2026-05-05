import { useState, useEffect } from 'react';
import { RxDatabase } from 'rxdb';
import { initDatabase } from '../../core/db';

export const useDatabase = () => {
  const [db, setDb] = useState<RxDatabase | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    initDatabase()
      .then((database) => {
        if (mounted) {
          setDb(database);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { db, error, loading };
};
