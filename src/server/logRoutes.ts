import { Router } from 'express';
import { authMiddleware, AuthenticatedRequest } from './authMiddleware';
import { query } from './db';

const router = Router();

// GET /api/logs - Fetch latest logs
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const logsResult = await query(
      `SELECT l.id, l.content, l.created_at, u.username
       FROM logs l
       JOIN users u ON l.user_id = u.id
       ORDER BY l.created_at DESC
       LIMIT $1`,
      [limit]
    );
    res.status(200).json(logsResult.rows);
  } catch (error) {
    console.error('Fetch Logs Error:', error);
    res.status(500).json({ message: 'Failed to fetch logs.' });
  }
});

// POST /api/logs - Create a new log entry
router.post('/', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const { content } = req.body;
    const userId = req.user?.userId;

    if (!content) {
      return res.status(400).json({ message: 'Log content cannot be empty.' });
    }

    const newLogResult = await query(
      'INSERT INTO logs (user_id, content) VALUES ($1, $2) RETURNING id, created_at',
      [userId, content]
    );

    res.status(201).json({
      message: 'Log created successfully.',
      log: {
        id: newLogResult.rows[0].id,
        content,
        created_at: newLogResult.rows[0].created_at,
        username: req.user?.username,
      },
    });
  } catch (error) {
    console.error('Create Log Error:', error);
    res.status(500).json({ message: 'Failed to create log entry.' });
  }
});

export default router;
