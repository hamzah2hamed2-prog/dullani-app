import { getDb } from "./db";
import {
  ratings,
  notifications,
  searchHistory,
  type InsertRating,
  type InsertNotification,
  type InsertSearchHistory,
} from "../drizzle/schema";
import { eq, desc } from "drizzle-orm";

// Ratings functions
export async function createRating(data: InsertRating) {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not initialized");
    const result = await db.insert(ratings).values(data);
    return { success: true, id: (result as any)[0]?.insertId };
  } catch (error) {
    console.error("Error creating rating:", error);
    throw error;
  }
}

export async function getRatingsByProduct(productId: number) {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not initialized");
    const result = await db
      .select()
      .from(ratings)
      .where(eq(ratings.productId, productId))
      .orderBy(desc(ratings.createdAt));
    return result;
  } catch (error) {
    console.error("Error getting ratings by product:", error);
    throw error;
  }
}

export async function getRatingsByStore(storeId: number) {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not initialized");
    const result = await db
      .select()
      .from(ratings)
      .where(eq(ratings.storeId, storeId))
      .orderBy(desc(ratings.createdAt));
    return result;
  } catch (error) {
    console.error("Error getting ratings by store:", error);
    throw error;
  }
}

export async function getAverageRating(productId: number) {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not initialized");
    const result = await db
      .select()
      .from(ratings)
      .where(eq(ratings.productId, productId));

    if (result.length === 0) return 0;

    const sum = result.reduce((acc: number, r: any) => acc + r.rating, 0);
    return sum / result.length;
  } catch (error) {
    console.error("Error getting average rating:", error);
    throw error;
  }
}

export async function createNotification(data: InsertNotification) {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not initialized");
    const result = await db.insert(notifications).values(data);
    return { success: true, id: (result as any)[0]?.insertId };
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
}

export async function getNotifications(userId: number) {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not initialized");
    const result = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
    return result;
  } catch (error) {
    console.error("Error getting notifications:", error);
    throw error;
  }
}

export async function markNotificationAsRead(notificationId: number) {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not initialized");
    await db
      .update(notifications)
      .set({ read: 1 })
      .where(eq(notifications.id, notificationId));
    return { success: true };
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
}

export async function addSearchHistory(data: InsertSearchHistory) {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not initialized");
    const result = await db.insert(searchHistory).values(data);
    return { success: true, id: (result as any)[0]?.insertId };
  } catch (error) {
    console.error("Error adding search history:", error);
    throw error;
  }
}

export async function getSearchHistory(userId: number) {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not initialized");
    const result = await db
      .select()
      .from(searchHistory)
      .where(eq(searchHistory.userId, userId))
      .orderBy(desc(searchHistory.createdAt));
    return result;
  } catch (error) {
    console.error("Error getting search history:", error);
    throw error;
  }
}
