import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export const query = (text: string, params: any[]) => pool.query(text, params);

export async function initializeDatabase() {
  let client;
  let retries = 5;

  while (retries > 0) {
    try {
      client = await pool.connect();
      break; // Success!
    } catch (err) {
      retries -= 1;
      console.log(`Database connection failed. Retrying... (${retries} attempts left)`);
      if (retries === 0) {
        console.error('Could not connect to the database after multiple attempts:', err);
        return;
      }
      // Wait for 2 seconds before retrying
      await new Promise(res => setTimeout(res, 2000));
    }
  }

  try {
    // Users Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        recovery_code VARCHAR(255),
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Password Reset Tokens Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        token VARCHAR(255) NOT NULL,
        expires_at TIMESTAMPTZ NOT NULL,
        PRIMARY KEY (user_id, token)
      );
    `);

    // Logs Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Database tables initialized successfully.');

  } catch (err) {
    console.error('Error initializing database tables:', err);
  } finally {
    if (client) client.release();
  }
}
