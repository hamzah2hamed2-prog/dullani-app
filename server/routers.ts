import { z } from "zod";
import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
    setAccountType: protectedProcedure
      .input(
        z.object({
          accountType: z.enum(["consumer", "merchant"]),
        })
      )
      .mutation(({ ctx, input }) =>
        db.updateUserAccountType(ctx.user.id, input.accountType)
      ),
  }),

  // Products API
  products: router({
    list: publicProcedure
      .input(
        z.object({
          limit: z.number().default(20),
          offset: z.number().default(0),
        })
      )
      .query(({ input }) => db.getProducts(input.limit, input.offset)),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => db.getProductById(input.id)),

    getByStore: publicProcedure
      .input(z.object({ storeId: z.number() }))
      .query(({ input }) => db.getProductsByStore(input.storeId)),

    create: protectedProcedure
      .input(
        z.object({
          storeId: z.number(),
          name: z.string().min(1).max(255),
          description: z.string().optional(),
          price: z.string().min(1),
          image: z.string().optional(),
          category: z.string().optional(),
        })
      )
      .mutation(({ input }) => db.createProduct(input)),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          description: z.string().optional(),
          price: z.string().optional(),
          image: z.string().optional(),
          category: z.string().optional(),
          inStock: z.number().optional(),
        })
      )
      .mutation(({ input }) => {
        const { id, ...data } = input;
        return db.updateProduct(id, data);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => db.deleteProduct(input.id)),
  }),

  // Stores API
  stores: router({
    list: publicProcedure
      .input(
        z.object({
          limit: z.number().default(20),
          offset: z.number().default(0),
        })
      )
      .query(({ input }) => db.getStores(input.limit, input.offset)),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => db.getStoreById(input.id)),

    getByUserId: protectedProcedure.query(({ ctx }) =>
      db.getStoreByUserId(ctx.user.id)
    ),

    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1).max(255),
          description: z.string().optional(),
          logo: z.string().optional(),
          address: z.string().optional(),
          latitude: z.string().optional(),
          longitude: z.string().optional(),
          phone: z.string().optional(),
          openingHours: z.string().optional(),
        })
      )
      .mutation(({ ctx, input }) =>
        db.createStore({
          userId: ctx.user.id,
          ...input,
        })
      ),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          description: z.string().optional(),
          logo: z.string().optional(),
          address: z.string().optional(),
          latitude: z.string().optional(),
          longitude: z.string().optional(),
          phone: z.string().optional(),
          openingHours: z.string().optional(),
        })
      )
      .mutation(({ input }) => {
        const { id, ...data } = input;
        return db.updateStore(id, data);
      }),
  }),

  // Wishlist API
  wishlist: router({
    list: protectedProcedure.query(({ ctx }) =>
      db.getUserWishlist(ctx.user.id)
    ),

    add: protectedProcedure
      .input(z.object({ productId: z.number() }))
      .mutation(({ ctx, input }) =>
        db.addToWishlist({
          userId: ctx.user.id,
          productId: input.productId,
        })
      ),

    remove: protectedProcedure
      .input(z.object({ productId: z.number() }))
      .mutation(({ ctx, input }) =>
        db.removeFromWishlist(ctx.user.id, input.productId)
      ),

    isInWishlist: protectedProcedure
      .input(z.object({ productId: z.number() }))
      .query(({ ctx, input }) =>
        db.isInWishlist(ctx.user.id, input.productId)
      ),
  }),

  // Categories API
  categories: router({
    list: publicProcedure.query(() => db.getCategories()),

    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1).max(100),
          icon: z.string().optional(),
        })
      )
      .mutation(({ input }) => db.createCategory(input)),
  }),

  // User Profile API
  userProfile: router({
    updateProfile: protectedProcedure
      .input(
        z.object({
          name: z.string().optional(),
          email: z.string().email().optional(),
          bio: z.string().optional(),
        })
      )
      .mutation(({ ctx, input }) => {
        // In a real app, you would update the user in the database
        // For now, just return success
        return { success: true };
      }),
  }),

  // User Interests API
  userInterests: router({
    list: protectedProcedure.query(({ ctx }) =>
      db.getUserInterests(ctx.user.id)
    ),

    add: protectedProcedure
      .input(z.object({ categoryId: z.number() }))
      .mutation(({ ctx, input }) =>
        db.addUserInterest({
          userId: ctx.user.id,
          categoryId: input.categoryId,
        })
      ),

    remove: protectedProcedure
      .input(z.object({ categoryId: z.number() }))
      .mutation(({ ctx, input }) =>
        db.removeUserInterest(ctx.user.id, input.categoryId)
      ),
  }),

  // Search History API
  searchHistory: router({
    add: protectedProcedure
      .input(
        z.object({
          query: z.string().min(1).max(255),
          filters: z.string().optional(),
        })
      )
      .mutation(({ ctx, input }) =>
        db.addSearchHistory({
          userId: ctx.user.id,
          ...input,
        })
      ),

    list: protectedProcedure
      .input(
        z.object({
          limit: z.number().default(10),
        })
      )
      .query(({ ctx, input }) =>
        db.getSearchHistory(ctx.user.id, input.limit)
      ),

    clear: protectedProcedure.mutation(({ ctx }) =>
      db.clearSearchHistory(ctx.user.id)
    ),
  }),

  // Notifications API
  notifications: router({
    list: protectedProcedure
      .input(
        z.object({
          limit: z.number().default(20),
          offset: z.number().default(0),
        })
      )
      .query(({ ctx, input }) =>
        db.getNotifications(ctx.user.id, input.limit, input.offset)
      ),

    unreadCount: protectedProcedure.query(({ ctx }) =>
      db.getUnreadNotificationCount(ctx.user.id)
    ),

    markAsRead: protectedProcedure
      .input(z.object({ notificationId: z.number() }))
      .mutation(({ input }) =>
        db.markNotificationAsRead(input.notificationId)
      ),

    markAllAsRead: protectedProcedure.mutation(({ ctx }) =>
      db.markAllNotificationsAsRead(ctx.user.id)
    ),

    delete: protectedProcedure
      .input(z.object({ notificationId: z.number() }))
      .mutation(({ input }) =>
        db.deleteNotification(input.notificationId)
      ),
  }),

  // Ratings API
  ratings: router({
    create: protectedProcedure
      .input(
        z.object({
          productId: z.number().optional(),
          storeId: z.number().optional(),
          rating: z.number().min(1).max(5),
          review: z.string().optional(),
        })
      )
      .mutation(({ ctx, input }) =>
        db.createRating({
          userId: ctx.user.id,
          ...input,
        })
      ),

    getByProductId: publicProcedure
      .input(z.object({ productId: z.number() }))
      .query(({ input }) => db.getRatingsByProductId(input.productId)),

    getByStoreId: publicProcedure
      .input(z.object({ storeId: z.number() }))
      .query(({ input }) => db.getRatingsByStoreId(input.storeId)),

    getAverageByProductId: publicProcedure
      .input(z.object({ productId: z.number() }))
      .query(({ input }) => db.getAverageRatingByProductId(input.productId)),

    getAverageByStoreId: publicProcedure
      .input(z.object({ storeId: z.number() }))
      .query(({ input }) => db.getAverageRatingByStoreId(input.storeId)),

    getCountByProductId: publicProcedure
      .input(z.object({ productId: z.number() }))
      .query(({ input }) => db.getRatingCountByProductId(input.productId)),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          rating: z.number().min(1).max(5).optional(),
          review: z.string().optional(),
        })
      )
      .mutation(({ input }) => {
        const { id, ...data } = input;
        return db.updateRating(id, data);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => db.deleteRating(input.id)),
  }),
});

export type AppRouter = typeof appRouter;
