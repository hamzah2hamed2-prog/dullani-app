import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ==================== PRODUCTS ====================

export async function getProducts(limit: number = 20, offset: number = 0) {
  const db = await getDb();
  if (!db) return [];

  const { products, stores } = await import("../drizzle/schema");
  const { eq } = await import("drizzle-orm");

  const results = await db
    .select({
      id: products.id,
      storeId: products.storeId,
      name: products.name,
      description: products.description,
      price: products.price,
      image: products.image,
      category: products.category,
      inStock: products.inStock,
      storeName: stores.name,
    })
    .from(products)
    .leftJoin(stores, eq(products.storeId, stores.id))
    .limit(limit)
    .offset(offset);

  return results;
}

export async function getProductsByStore(storeId: number) {
  const db = await getDb();
  if (!db) return [];

  const { products } = await import("../drizzle/schema");
  return db
    .select()
    .from(products)
    .where(eq(products.storeId, storeId));
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const { products } = await import("../drizzle/schema");
  const result = await db
    .select()
    .from(products)
    .where(eq(products.id, id));

  return result[0] || null;
}

export async function createProduct(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { products } = await import("../drizzle/schema");
  const result = await db.insert(products).values(data);
  return (result as any).insertId || 0;
}

export async function updateProduct(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { products } = await import("../drizzle/schema");
  await db.update(products).set(data).where(eq(products.id, id));
}

export async function deleteProduct(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { products } = await import("../drizzle/schema");
  await db.delete(products).where(eq(products.id, id));
}

// ==================== STORES ====================

export async function getStores(limit: number = 20, offset: number = 0) {
  const db = await getDb();
  if (!db) return [];

  const { stores } = await import("../drizzle/schema");
  return db
    .select()
    .from(stores)
    .limit(limit)
    .offset(offset);
}

export async function getStoreById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const { stores } = await import("../drizzle/schema");
  const result = await db
    .select()
    .from(stores)
    .where(eq(stores.id, id));

  return result[0] || null;
}

export async function getStoreByUserId(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const { stores } = await import("../drizzle/schema");
  const result = await db
    .select()
    .from(stores)
    .where(eq(stores.userId, userId));

  return result[0] || null;
}

export async function createStore(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { stores } = await import("../drizzle/schema");
  const result = await db.insert(stores).values(data);
  return (result as any).insertId || 0;
}

export async function updateStore(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { stores } = await import("../drizzle/schema");
  await db.update(stores).set(data).where(eq(stores.id, id));
}

// ==================== WISHLIST ====================

export async function getUserWishlist(userId: number) {
  const db = await getDb();
  if (!db) return [];

  const { wishlist, products, stores } = await import("../drizzle/schema");
  const { eq } = await import("drizzle-orm");

  const results = await db
    .select({
      id: products.id,
      storeId: products.storeId,
      name: products.name,
      description: products.description,
      price: products.price,
      image: products.image,
      category: products.category,
      inStock: products.inStock,
      storeName: stores.name,
      wishlistId: wishlist.id,
    })
    .from(wishlist)
    .innerJoin(products, eq(wishlist.productId, products.id))
    .leftJoin(stores, eq(products.storeId, stores.id))
    .where(eq(wishlist.userId, userId));

  return results;
}

export async function addToWishlist(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { wishlist } = await import("../drizzle/schema");
  const result = await db.insert(wishlist).values(data);
  return (result as any).insertId || 0;
}

export async function removeFromWishlist(userId: number, productId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { wishlist } = await import("../drizzle/schema");
  const { and } = await import("drizzle-orm");
  await db
    .delete(wishlist)
    .where(
      and(
        eq(wishlist.userId, userId),
        eq(wishlist.productId, productId)
      )
    );
}

export async function isInWishlist(userId: number, productId: number) {
  const db = await getDb();
  if (!db) return false;

  const { wishlist } = await import("../drizzle/schema");
  const { and } = await import("drizzle-orm");
  const result = await db
    .select()
    .from(wishlist)
    .where(
      and(
        eq(wishlist.userId, userId),
        eq(wishlist.productId, productId)
      )
    );

  return result.length > 0;
}

// ==================== CATEGORIES ====================

export async function getCategories() {
  const db = await getDb();
  if (!db) return [];

  const { categories } = await import("../drizzle/schema");
  return db.select().from(categories);
}

export async function createCategory(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { categories } = await import("../drizzle/schema");
  const result = await db.insert(categories).values(data);
  return (result as any).insertId || 0;
}

// ==================== USER INTERESTS ====================

export async function getUserInterests(userId: number) {
  const db = await getDb();
  if (!db) return [];

  const { userInterests } = await import("../drizzle/schema");
  return db
    .select()
    .from(userInterests)
    .where(eq(userInterests.userId, userId));
}

export async function addUserInterest(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { userInterests } = await import("../drizzle/schema");
  const result = await db.insert(userInterests).values(data);
  return (result as any).insertId || 0;
}

export async function removeUserInterest(userId: number, categoryId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { userInterests } = await import("../drizzle/schema");
  const { and } = await import("drizzle-orm");
  await db
    .delete(userInterests)
    .where(
      and(
        eq(userInterests.userId, userId),
        eq(userInterests.categoryId, categoryId)
      )
    );
}


// ==================== RATINGS ====================

export async function createRating(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { ratings } = await import("../drizzle/schema");
  const result = await db.insert(ratings).values(data);
  return (result as any).insertId || 0;
}

export async function getRatingsByProductId(productId: number) {
  const db = await getDb();
  if (!db) return [];

  const { ratings } = await import("../drizzle/schema");
  return db
    .select()
    .from(ratings)
    .where(eq(ratings.productId, productId));
}

export async function getRatingsByStoreId(storeId: number) {
  const db = await getDb();
  if (!db) return [];

  const { ratings } = await import("../drizzle/schema");
  return db
    .select()
    .from(ratings)
    .where(eq(ratings.storeId, storeId));
}

export async function getAverageRatingByProductId(productId: number) {
  const db = await getDb();
  if (!db) return 0;

  const { ratings } = await import("../drizzle/schema");
  const { avg } = await import("drizzle-orm");
  const result = await db
    .select({ average: avg(ratings.rating) })
    .from(ratings)
    .where(eq(ratings.productId, productId));

  return result[0]?.average ? Number(result[0].average) : 0;
}

export async function getAverageRatingByStoreId(storeId: number) {
  const db = await getDb();
  if (!db) return 0;

  const { ratings } = await import("../drizzle/schema");
  const { avg } = await import("drizzle-orm");
  const result = await db
    .select({ average: avg(ratings.rating) })
    .from(ratings)
    .where(eq(ratings.storeId, storeId));

  return result[0]?.average ? Number(result[0].average) : 0;
}

export async function getRatingCountByProductId(productId: number) {
  const db = await getDb();
  if (!db) return 0;

  const { ratings } = await import("../drizzle/schema");
  const { count } = await import("drizzle-orm");
  const result = await db
    .select({ count: count() })
    .from(ratings)
    .where(eq(ratings.productId, productId));

  return result[0]?.count || 0;
}

export async function updateRating(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { ratings } = await import("../drizzle/schema");
  await db.update(ratings).set(data).where(eq(ratings.id, id));
}

export async function deleteRating(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { ratings } = await import("../drizzle/schema");
  await db.delete(ratings).where(eq(ratings.id, id));
}


// ==================== SEARCH HISTORY ====================

export async function addSearchHistory(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { searchHistory } = await import("../drizzle/schema");
  const result = await db.insert(searchHistory).values(data);
  return (result as any).insertId || 0;
}

export async function getSearchHistory(userId: number, limit: number = 10) {
  const db = await getDb();
  if (!db) return [];

  const { searchHistory } = await import("../drizzle/schema");
  const { desc } = await import("drizzle-orm");
  return db
    .select()
    .from(searchHistory)
    .where(eq(searchHistory.userId, userId))
    .orderBy(desc(searchHistory.createdAt))
    .limit(limit);
}

export async function clearSearchHistory(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { searchHistory } = await import("../drizzle/schema");
  await db
    .delete(searchHistory)
    .where(eq(searchHistory.userId, userId));
}


// ==================== NOTIFICATIONS ====================

export async function createNotification(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { notifications } = await import("../drizzle/schema");
  const result = await db.insert(notifications).values(data);
  return (result as any).insertId || 0;
}

export async function getNotifications(userId: number, limit: number = 20, offset: number = 0) {
  const db = await getDb();
  if (!db) return [];

  const { notifications } = await import("../drizzle/schema");
  const { desc } = await import("drizzle-orm");
  return db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function markNotificationAsRead(notificationId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { notifications } = await import("../drizzle/schema");
  await db
    .update(notifications)
    .set({ read: 1 })
    .where(eq(notifications.id, notificationId));
}

export async function markAllNotificationsAsRead(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { notifications } = await import("../drizzle/schema");
  await db
    .update(notifications)
    .set({ read: 1 })
    .where(eq(notifications.userId, userId));
}

export async function getUnreadNotificationCount(userId: number) {
  const db = await getDb();
  if (!db) return 0;

  const { notifications } = await import("../drizzle/schema");
  const { count, and } = await import("drizzle-orm");
  const result = await db
    .select({ count: count() })
    .from(notifications)
    .where(
      and(
        eq(notifications.userId, userId),
        eq(notifications.read, 0)
      )
    );

  return result[0]?.count || 0;
}

export async function deleteNotification(notificationId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { notifications } = await import("../drizzle/schema");
  await db.delete(notifications).where(eq(notifications.id, notificationId));
}


// ==================== USER ACCOUNT TYPE ====================

export async function updateUserAccountType(userId: number, accountType: "consumer" | "merchant") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { users } = await import("../drizzle/schema");
  await db
    .update(users)
    .set({ accountType })
    .where(eq(users.id, userId));

  return { success: true };
}


// ==================== FOLLOWS (SOCIAL) ====================

export async function followStore(userId: number, storeId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { follows } = await import("../drizzle/schema");
  
  await db.insert(follows).values({
    followerId: userId,
    followingStoreId: storeId,
  });
  
  return { success: true };
}

export async function unfollowStore(userId: number, storeId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { follows } = await import("../drizzle/schema");
  const { and: sqlAnd, eq: sqlEq } = await import("drizzle-orm");
  
  await db
    .delete(follows)
    .where(
      sqlAnd(
        sqlEq(follows.followerId, userId),
        sqlEq(follows.followingStoreId, storeId)
      )
    );
  
  return { success: true };
}

export async function isFollowingStore(userId: number, storeId: number) {
  const db = await getDb();
  if (!db) return false;
  const { follows } = await import("../drizzle/schema");
  const { and: sqlAnd, eq: sqlEq } = await import("drizzle-orm");
  
  const result = await db
    .select()
    .from(follows)
    .where(
      sqlAnd(
        sqlEq(follows.followerId, userId),
        sqlEq(follows.followingStoreId, storeId)
      )
    );
  
  return result.length > 0;
}

export async function getStoreFollowersCount(storeId: number) {
  const db = await getDb();
  if (!db) return 0;
  const { follows } = await import("../drizzle/schema");
  const { count: sqlCount, eq: sqlEq } = await import("drizzle-orm");
  
  const result = await db
    .select({ count: sqlCount() })
    .from(follows)
    .where(sqlEq(follows.followingStoreId, storeId));
  
  return result[0]?.count || 0;
}

// ==================== LIKES (SOCIAL) ====================

export async function likeProduct(userId: number, productId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { likes } = await import("../drizzle/schema");
  
  await db.insert(likes).values({
    userId,
    productId,
  });
  
  return { success: true };
}

export async function unlikeProduct(userId: number, productId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { likes } = await import("../drizzle/schema");
  const { and: sqlAnd, eq: sqlEq } = await import("drizzle-orm");
  
  await db
    .delete(likes)
    .where(
      sqlAnd(
        sqlEq(likes.userId, userId),
        sqlEq(likes.productId, productId)
      )
    );
  
  return { success: true };
}

export async function isLikedByUser(userId: number, productId: number) {
  const db = await getDb();
  if (!db) return false;
  const { likes } = await import("../drizzle/schema");
  const { and: sqlAnd, eq: sqlEq } = await import("drizzle-orm");
  
  const result = await db
    .select()
    .from(likes)
    .where(
      sqlAnd(
        sqlEq(likes.userId, userId),
        sqlEq(likes.productId, productId)
      )
    );
  
  return result.length > 0;
}

export async function getProductLikesCount(productId: number) {
  const db = await getDb();
  if (!db) return 0;
  const { likes } = await import("../drizzle/schema");
  const { count: sqlCount, eq: sqlEq } = await import("drizzle-orm");
  
  const result = await db
    .select({ count: sqlCount() })
    .from(likes)
    .where(sqlEq(likes.productId, productId));
  
  return result[0]?.count || 0;
}

// ==================== COMMENTS (SOCIAL) ====================

export async function addComment(userId: number, productId: number, content: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { comments } = await import("../drizzle/schema");
  
  const result = await db.insert(comments).values({
    userId,
    productId,
    content,
  });
  
  return { success: true, id: result[0].insertId };
}

export async function deleteComment(commentId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { comments } = await import("../drizzle/schema");
  const { and: sqlAnd, eq: sqlEq } = await import("drizzle-orm");
  
  await db
    .delete(comments)
    .where(
      sqlAnd(
        sqlEq(comments.id, commentId),
        sqlEq(comments.userId, userId)
      )
    );
  
  return { success: true };
}

export async function getProductComments(productId: number, limit = 20, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  const { comments } = await import("../drizzle/schema");
  const { eq: sqlEq } = await import("drizzle-orm");
  
  const result = await db
    .select()
    .from(comments)
    .where(sqlEq(comments.productId, productId))
    .orderBy(comments.createdAt)
    .limit(limit)
    .offset(offset);
  
  return result;
}

export async function getProductCommentsCount(productId: number) {
  const db = await getDb();
  if (!db) return 0;
  const { comments } = await import("../drizzle/schema");
  const { count: sqlCount, eq: sqlEq } = await import("drizzle-orm");
  
  const result = await db
    .select({ count: sqlCount() })
    .from(comments)
    .where(sqlEq(comments.productId, productId));
  
  return result[0]?.count || 0;
}


// ==================== FOLLOWING FEED ====================

export async function getFollowedStoresIds(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const { follows } = await import("../drizzle/schema");
  const { eq } = await import("drizzle-orm");
  
  const result = await db
    .select({ followingStoreId: follows.followingStoreId })
    .from(follows)
    .where(eq(follows.followerId, userId));
  
  return result.map((r) => r.followingStoreId);
}

export async function getFollowingFeedProducts(userId: number, limit = 20, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  
  const followedStoreIds = await getFollowedStoresIds(userId);
  if (followedStoreIds.length === 0) return [];
  
  const { products } = await import("../drizzle/schema");
  const { inArray } = await import("drizzle-orm");
  
  // Filter out null values from followedStoreIds
  const validStoreIds = followedStoreIds.filter((id) => id !== null) as number[];
  if (validStoreIds.length === 0) return [];
  
  const result = await db
    .select()
    .from(products)
    .where(inArray(products.storeId, validStoreIds))
    .orderBy(products.createdAt)
    .limit(limit)
    .offset(offset);
  
  return result;
}
