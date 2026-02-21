import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';

import authRoutes from './src/server/authRoutes';
import logRoutes from './src/server/logRoutes';
import { initializeDatabase } from './src/server/db';

async function createServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

// Initialize the database tables
initializeDatabase();

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/logs', logRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve the built React app
    const __dirname = path.dirname(new URL(import.meta.url).pathname);
    app.use(express.static(path.join(__dirname, 'dist')));

    // Fallback to index.html for client-side routing
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

createServer();
