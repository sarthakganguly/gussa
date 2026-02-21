import { config } from '../config';

/**
 * Generates a random, URL-safe string of a given length.
 * This implementation is safe for both browser and Node.js environments.
 * @param length The desired length of the string.
 * @returns A random string.
 */
export function generateRandomString(length: number): string {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

/**
 * Generates a random username based on the length specified in the config.
 * @returns A random username.
 */
export function generateRandomUsername(): string {
  return `user_${generateRandomString(config.randomUsernameLength - 5)}`;
}
