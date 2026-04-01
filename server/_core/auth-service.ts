/**
 * Authentication Service
 * Handles password hashing, validation, and token generation
 */

import crypto from "crypto";

/**
 * Hash a password using a simple algorithm
 * In production, use bcrypt or argon2
 */
export function hashPassword(password: string): string {
  // For production, use: bcrypt.hashSync(password, 10)
  // This is a simple implementation for development
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return `${salt}$${hash}`;
}

/**
 * Verify a password against a hash
 */
export function verifyPassword(password: string, hash: string): boolean {
  try {
    const [salt, storedHash] = hash.split("$");
    const computedHash = crypto
      .pbkdf2Sync(password, salt, 1000, 64, "sha512")
      .toString("hex");
    return computedHash === storedHash;
  } catch {
    return false;
  }
}

/**
 * Generate a random token for password reset
 */
export function generateResetToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function isValidPassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 6) {
    errors.push("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
  }

  // Optional: Add more requirements
  // if (!/[A-Z]/.test(password)) {
  //   errors.push("كلمة المرور يجب أن تحتوي على حرف كبير");
  // }
  // if (!/[a-z]/.test(password)) {
  //   errors.push("كلمة المرور يجب أن تحتوي على حرف صغير");
  // }
  // if (!/[0-9]/.test(password)) {
  //   errors.push("كلمة المرور يجب أن تحتوي على رقم");
  // }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Generate a session token (JWT-like)
 */
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Validate session token format
 */
export function isValidSessionToken(token: string): boolean {
  return token.length === 64 && /^[a-f0-9]{64}$/.test(token);
}
