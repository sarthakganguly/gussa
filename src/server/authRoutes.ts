import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from './db';
import { generateRandomString } from './utils';
import { config } from '../config';
import { authMiddleware, AuthenticatedRequest } from './authMiddleware';

const router = Router();
const BCRYPT_SALT_ROUNDS = 10;

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Validation Error', message: 'Username, email, and password are required.' });
    }

    // Check for existing user
    const existingUser = await query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);
    if (existingUser.rows.length > 0) {
      const conflictField = existingUser.rows[0].username === username ? 'Username' : 'Email';
      return res.status(409).json({ error: 'Conflict Error', message: `${conflictField} already exists.` });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    // Generate Recovery Code (12 characters)
    const recoveryCode = generateRandomString(12).toUpperCase();

    // Create user
    await query(
      'INSERT INTO users (username, email, password_hash, recovery_code) VALUES ($1, $2, $3, $4)',
      [username, email, passwordHash, recoveryCode]
    );

    res.status(201).json({
      message: 'User created successfully. Please SAVE your recovery key.',
      recoveryCode,
    });

  } catch (error: any) {
    console.error('Signup Error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: config.debugMode ? error.message : 'An error occurred during signup.' 
    });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Validation Error', message: 'Email/Username and password are required.' });
    }

    const userResult = await query(
      'SELECT id, username, email, password_hash, recovery_code FROM users WHERE email = $1 OR username = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Invalid credentials.' });
    }

    const user = userResult.rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Invalid credentials.' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    res.status(200).json({ 
      token, 
      user: { 
        id: user.id, 
        username: user.username,
        recoveryCode: user.recovery_code 
      } 
    });

  } catch (error: any) {
    console.error('Login Error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: config.debugMode ? error.message : 'An error occurred during login.' 
    });
  }
});

// POST /api/auth/restore-password
router.post('/restore-password', async (req, res) => {
  try {
    const { identifier, recoveryCode } = req.body;

    if (!identifier || !recoveryCode) {
      return res.status(400).json({ error: 'Validation Error', message: 'Username/Email and Recovery Code are required.' });
    }

    const userResult = await query(
      'SELECT id, recovery_code FROM users WHERE email = $1 OR username = $1',
      [identifier]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Not Found', message: 'User not found.' });
    }

    const user = userResult.rows[0];

    if (!user.recovery_code) {
       return res.status(400).json({ error: 'Bad Request', message: 'No recovery code set for this user.' });
    }

    if (recoveryCode.toUpperCase() !== user.recovery_code) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Invalid recovery code.' });
    }

    // Code is valid, generate a reset token
    const resetToken = generateRandomString(32);
    const tokenExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await query(
      'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [user.id, resetToken, tokenExpires]
    );

    res.status(200).json({ 
      message: 'Recovery code verified.', 
      resetToken 
    });

  } catch (error: any) {
    console.error('Restore Password Error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: config.debugMode ? error.message : 'An error occurred during restoration.' 
    });
  }
});

// POST /api/auth/regenerate-recovery-key
router.post('/regenerate-recovery-key', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.userId;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Validation Error', message: 'Password is required to regenerate recovery key.' });
    }

    const userResult = await query('SELECT password_hash FROM users WHERE id = $1', [userId]);
    const user = userResult.rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Invalid password.' });
    }

    const newRecoveryCode = generateRandomString(12).toUpperCase();
    await query('UPDATE users SET recovery_code = $1 WHERE id = $2', [newRecoveryCode, userId]);

    res.status(200).json({ 
      message: 'Recovery key regenerated successfully.', 
      recoveryCode: newRecoveryCode 
    });

  } catch (error: any) {
    console.error('Regenerate Key Error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: config.debugMode ? error.message : 'An error occurred during regeneration.' 
    });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ error: 'Validation Error', message: 'Token and new password are required.' });
    }

    const tokenResult = await query('SELECT * FROM password_reset_tokens WHERE token = $1', [token]);
    if (tokenResult.rows.length === 0) {
      return res.status(404).json({ error: 'Not Found', message: 'Invalid or expired password reset token.' });
    }

    const dbToken = tokenResult.rows[0];

    if (new Date(dbToken.expires_at) < new Date()) {
      await query('DELETE FROM password_reset_tokens WHERE token = $1', [token]);
      return res.status(410).json({ error: 'Gone', message: 'Password reset token has expired.' });
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    await query('UPDATE users SET password_hash = $1 WHERE id = $2', [passwordHash, dbToken.user_id]);
    await query('DELETE FROM password_reset_tokens WHERE token = $1', [token]);

    res.status(200).json({ message: 'Password has been reset successfully.' });

  } catch (error: any) {
    console.error('Reset Password Error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: config.debugMode ? error.message : 'An error occurred during password reset.' 
    });
  }
});

export default router;
