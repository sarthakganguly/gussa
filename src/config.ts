/**
 * Application Configuration
 */

export const config = {
  // The number of log messages to display on the Dash at one time.
  dashMessageCount: 10,

  // Toggles detailed logging for debugging purposes.
  debugMode: process.env.DEBUG_MODE === 'true',

  // The length of the randomly generated username for new users.
  randomUsernameLength: 12,

  // JWT configuration
  jwtSecret: process.env.JWT_SECRET || 'a-very-strong-fallback-secret-for-development-only-1234567890',
  jwtExpiresIn: '1d',
};
