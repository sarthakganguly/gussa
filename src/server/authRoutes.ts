import { Router } from 'express';

const router = Router();

import bcrypt from 'bcrypt';
import { query } from './db';
import { generateRandomString } from './utils';
import { sendEmail } from './email';

const BCRYPT_SALT_ROUNDS = 10;

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required.' });
    }

    // Check for existing user
    const existingUser = await query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: 'Username or email already exists.' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    // Create user
    const newUserResult = await query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id',
      [username, email, passwordHash]
    );
    const userId = newUserResult.rows[0].id;

    // Create verification token
    const verificationToken = generateRandomString(32);
    const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await query(
      'INSERT INTO email_verification_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [userId, verificationToken, tokenExpires]
    );

    // Send verification email
    const verificationUrl = `${process.env.APP_URL}/verify-email?token=${verificationToken}`;
    const emailPreviewUrl = await sendEmail({
      to: email,
      subject: 'Verify Your Email Address',
      text: `Please verify your email by clicking this link: ${verificationUrl}`,
      html: `<p>Please verify your email by clicking this link: <a href="${verificationUrl}">${verificationUrl}</a></p>`,
    });

    res.status(201).json({
      message: 'User created successfully. Please check your email to verify your account.',
      emailPreviewUrl, // For development/testing
    });

  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'An error occurred during signup.' });
  }
});

import jwt from 'jsonwebtoken';

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body; // Using email or username

    if (!email || !password) {
      return res.status(400).json({ message: 'Email/Username and password are required.' });
    }

    // Find user by email or username
    const userResult = await query(
      'SELECT * FROM users WHERE email = $1 OR username = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const user = userResult.rows[0];

    // Check if verified
    if (!user.is_verified) {
      return res.status(403).json({ message: 'Please verify your email before logging in.' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET || 'your_default_secret',
      { expiresIn: '1d' } // Token expires in 1 day
    );

    res.status(200).json({ token, user: { id: user.id, username: user.username } });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'An error occurred during login.' });
  }
});

// POST /api/auth/verify-email
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Verification token is required.' });
    }

    // Find token
    const tokenResult = await query('SELECT * FROM email_verification_tokens WHERE token = $1', [token]);
    if (tokenResult.rows.length === 0) {
      return res.status(404).json({ message: 'Invalid or expired verification token.' });
    }

    const dbToken = tokenResult.rows[0];

    // Check if expired
    if (new Date(dbToken.expires_at) < new Date()) {
      // Clean up expired token
      await query('DELETE FROM email_verification_tokens WHERE token = $1', [token]);
      return res.status(410).json({ message: 'Verification token has expired.' });
    }

    // Update user
    await query('UPDATE users SET is_verified = true WHERE id = $1', [dbToken.user_id]);

    // Delete token
    await query('DELETE FROM email_verification_tokens WHERE token = $1', [token]);

    res.status(200).json({ message: 'Email verified successfully. You can now log in.' });

  } catch (error) {
    console.error('Email Verification Error:', error);
    res.status(500).json({ message: 'An error occurred during email verification.' });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email address is required.' });
    }

    const userResult = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length > 0) {
      const user = userResult.rows[0];
      const resetToken = generateRandomString(32);
      const tokenExpires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

      await query(
        'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
        [user.id, resetToken, tokenExpires]
      );

      const resetUrl = `${process.env.APP_URL}/reset-password?token=${resetToken}`;
      await sendEmail({
        to: email,
        subject: 'Password Reset Request',
        text: `You requested a password reset. Click this link to reset your password: ${resetUrl}`,
        html: `<p>You requested a password reset. Click this link to reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`,
      });
    }

    // Always send a success-like message to prevent user enumeration
    res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });

  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({ message: 'An error occurred.' });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ message: 'Token and new password are required.' });
    }

    const tokenResult = await query('SELECT * FROM password_reset_tokens WHERE token = $1', [token]);
    if (tokenResult.rows.length === 0) {
      return res.status(404).json({ message: 'Invalid or expired password reset token.' });
    }

    const dbToken = tokenResult.rows[0];

    if (new Date(dbToken.expires_at) < new Date()) {
      await query('DELETE FROM password_reset_tokens WHERE token = $1', [token]);
      return res.status(410).json({ message: 'Password reset token has expired.' });
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    await query('UPDATE users SET password_hash = $1 WHERE id = $2', [passwordHash, dbToken.user_id]);
    await query('DELETE FROM password_reset_tokens WHERE token = $1', [token]);

    res.status(200).json({ message: 'Password has been reset successfully.' });

  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({ message: 'An error occurred during password reset.' });
  }
});

export default router;
