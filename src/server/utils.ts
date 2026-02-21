import { randomBytes } from 'crypto';
import { config } from '../config';

/**
 * Generates a random, URL-safe string of a given length.
 * @param length The desired length of the string.
 * @returns A random string.
 */
export function generateRandomString(length: number): string {
  return randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
}

