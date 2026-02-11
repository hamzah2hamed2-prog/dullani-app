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

  const { products } = await import("../drizzle/schema");
  return db
    .select()
    .from(products)
    .limit(limit)
    .offset(offset);
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

  const { wishlist } = await import("../drizzle/schema");
  return db
    .select()
    .from(wishlist)
    .where(eq(wishlist.userId, userId));
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
