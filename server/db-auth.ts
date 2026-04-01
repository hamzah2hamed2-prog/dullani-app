/**
 * Database functions for email/password authentication
 */

import { eq } from "drizzle-orm";
import { userPasswords, users, InsertUser } from "../drizzle/schema";
import { getDb } from "./db";
import {
  hashPassword,
  verifyPassword,
  generateResetToken,
} from "./_core/auth-service";
import { drizzle } from "drizzle-orm/mysql2";

/**
 * Create a new user with email and password
 */
export async function createUserWithPassword(
  email: string,
  password: string,
  accountType: "consumer" | "merchant" = "consumer"
): Promise<{ user: any; sessionToken: string } | null> {
  const db = await getDb();
  if (!db) {
    console.error("[Auth] Database not available");
    return null;
  }

  try {
    // Generate a unique openId for the user
    const openId = `email-${email.replace(/[^a-z0-9]/gi, "-")}-${Date.now()}`;

    // Hash the password
    const passwordHash = hashPassword(password);

    // Create user record
    const userRecord: InsertUser = {
      openId,
      email,
      name: email.split("@")[0], // Use email prefix as initial name
      loginMethod: "email",
      accountType,
      lastSignedIn: new Date(),
    };

    // Insert user
    const userResult = await db.insert(users).values(userRecord);
    const userId = (userResult as any).insertId;

    if (!userId) {
      throw new Error("Failed to create user");
    }

    // Create password record
    await db.insert(userPasswords).values({
      userId,
      email,
      passwordHash,
    });

    // Fetch the created user
    const createdUser = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!createdUser.length) {
      throw new Error("Failed to fetch created user");
    }

    // Generate session token
    const sessionToken = `token-${userId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return {
      user: createdUser[0],
      sessionToken,
    };
  } catch (error) {
    console.error("[Auth] Failed to create user with password:", error);
    throw error;
  }
}

/**
 * Authenticate user with email and password
 */
export async function authenticateUserWithPassword(
  email: string,
  password: string
): Promise<{ user: any; sessionToken: string } | null> {
  const db = await getDb();
  if (!db) {
    console.error("[Auth] Database not available");
    return null;
  }

  try {
    // Find user password record
    const passwordRecords = await db
      .select()
      .from(userPasswords)
      .where(eq(userPasswords.email, email))
      .limit(1);

    if (!passwordRecords.length) {
      console.warn("[Auth] User not found:", email);
      return null;
    }

    const passwordRecord = passwordRecords[0];

    // Verify password
    if (!verifyPassword(password, passwordRecord.passwordHash)) {
      console.warn("[Auth] Invalid password for user:", email);
      return null;
    }

    // Fetch user record
    const userRecords = await db
      .select()
      .from(users)
      .where(eq(users.id, passwordRecord.userId))
      .limit(1);

    if (!userRecords.length) {
      console.error("[Auth] User record not found for password record");
      return null;
    }

    const user = userRecords[0];

    // Update last signed in
    await db
      .update(users)
      .set({ lastSignedIn: new Date() })
      .where(eq(users.id, user.id));

    // Generate session token
    const sessionToken = `token-${user.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return {
      user: { ...user, lastSignedIn: new Date() },
      sessionToken,
    };
  } catch (error) {
    console.error("[Auth] Failed to authenticate user:", error);
    throw error;
  }
}

/**
 * Check if email already exists
 */
export async function emailExists(email: string): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.error("[Auth] Database not available");
    return false;
  }

  try {
    const result = await db
      .select()
      .from(userPasswords)
      .where(eq(userPasswords.email, email))
      .limit(1);

    return result.length > 0;
  } catch (error) {
    console.error("[Auth] Failed to check email existence:", error);
    return false;
  }
}

/**
 * Request password reset
 */
export async function requestPasswordReset(
  email: string
): Promise<{ resetToken: string } | null> {
  const db = await getDb();
  if (!db) {
    console.error("[Auth] Database not available");
    return null;
  }

  try {
    const passwordRecords = await db
      .select()
      .from(userPasswords)
      .where(eq(userPasswords.email, email))
      .limit(1);

    if (!passwordRecords.length) {
      console.warn("[Auth] User not found for password reset:", email);
      return null;
    }

    const resetToken = generateResetToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await db
      .update(userPasswords)
      .set({
        passwordResetToken: resetToken,
        passwordResetExpiresAt: expiresAt,
      })
      .where(eq(userPasswords.email, email));

    return { resetToken };
  } catch (error) {
    console.error("[Auth] Failed to request password reset:", error);
    throw error;
  }
}

/**
 * Reset password with token
 */
export async function resetPasswordWithToken(
  resetToken: string,
  newPassword: string
): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.error("[Auth] Database not available");
    return false;
  }

  try {
    const passwordRecords = await db
      .select()
      .from(userPasswords)
      .where(eq(userPasswords.passwordResetToken, resetToken))
      .limit(1);

    if (!passwordRecords.length) {
      console.warn("[Auth] Invalid reset token");
      return false;
    }

    const passwordRecord = passwordRecords[0];

    // Check if token has expired
    if (
      passwordRecord.passwordResetExpiresAt &&
      passwordRecord.passwordResetExpiresAt < new Date()
    ) {
      console.warn("[Auth] Reset token expired");
      return false;
    }

    const passwordHash = hashPassword(newPassword);

    await db
      .update(userPasswords)
      .set({
        passwordHash,
        passwordResetToken: null,
        passwordResetExpiresAt: null,
      })
      .where(eq(userPasswords.id, passwordRecord.id));

    return true;
  } catch (error) {
    console.error("[Auth] Failed to reset password:", error);
    throw error;
  }
}

/**
 * Update user password
 */
export async function updateUserPassword(
  userId: number,
  currentPassword: string,
  newPassword: string
): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.error("[Auth] Database not available");
    return false;
  }

  try {
    const passwordRecords = await db
      .select()
      .from(userPasswords)
      .where(eq(userPasswords.userId, userId))
      .limit(1);

    if (!passwordRecords.length) {
      console.warn("[Auth] Password record not found for user:", userId);
      return false;
    }

    const passwordRecord = passwordRecords[0];

    // Verify current password
    if (!verifyPassword(currentPassword, passwordRecord.passwordHash)) {
      console.warn("[Auth] Invalid current password for user:", userId);
      return false;
    }

    const newPasswordHash = hashPassword(newPassword);

    await db
      .update(userPasswords)
      .set({ passwordHash: newPasswordHash })
      .where(eq(userPasswords.userId, userId));

    return true;
  } catch (error) {
    console.error("[Auth] Failed to update password:", error);
    throw error;
  }
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) {
    console.error("[Auth] Database not available");
    return null;
  }

  try {
    const passwordRecords = await db
      .select()
      .from(userPasswords)
      .where(eq(userPasswords.email, email))
      .limit(1);

    if (!passwordRecords.length) {
      return null;
    }

    const passwordRecord = passwordRecords[0];

    const userRecords = await db
      .select()
      .from(users)
      .where(eq(users.id, passwordRecord.userId))
      .limit(1);

    return userRecords.length > 0 ? userRecords[0] : null;
  } catch (error) {
    console.error("[Auth] Failed to get user by email:", error);
    return null;
  }
}
