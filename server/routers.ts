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
});

export type AppRouter = typeof appRouter;
