import { useEffect, useState } from 'react';
import { config } from '../config';

interface Log {
  id: string;
  content: string;
  created_at: string;
  username: string;
}

export default function DashboardPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch(`/api/logs?limit=${config.dashMessageCount}`);
        if (!response.ok) {
          throw new Error('Failed to fetch logs.');
        }
        const data = await response.json();
        setLogs(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dash</h1>
      {isLoading && <p className="text-gray-400">Loading logs...</p>}
      {error && <p className="text-red-400">{error}</p>}
      <div className="space-y-4">
        {logs.map((log) => (
          <div key={log.id} className="bg-gray-800 p-4 rounded-lg shadow-md">
            <p className="text-white">{log.content}</p>
            <div className="text-xs text-gray-400 mt-2 flex justify-between">
              <span>by @{log.username}</span>
              <span>{new Date(log.created_at).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
