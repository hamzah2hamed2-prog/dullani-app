import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";

/**
 * Hook to fetch products with filters and pagination
 */
export function useProducts(
  filters?: {
    categoryId?: string;
    storeId?: string;
    minPrice?: number;
    maxPrice?: number;
    rating?: number;
    search?: string;
    page?: number;
    limit?: number;
  }
) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: async () => {
      const result = await trpc.products.list.query(filters || {});
      return result;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch a single product by ID
 */
export function useProduct(productId: string) {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      const result = await trpc.products.getById.query({ id: productId });
      return result;
    },
    enabled: !!productId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Hook to fetch similar products
 */
export function useSimilarProducts(productId: string, limit: number = 6) {
  return useQuery({
    queryKey: ["similarProducts", productId],
    queryFn: async () => {
      const result = await trpc.products.getSimilar.query({ id: productId, limit });
      return result;
    },
    enabled: !!productId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Hook to like/unlike a product
 */
export function useLikeProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, liked }: { productId: string; liked: boolean }) => {
      if (liked) {
        return await trpc.products.unlike.mutate({ productId });
      } else {
        return await trpc.products.like.mutate({ productId });
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["product", variables.productId] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

/**
 * Hook to add/remove product from wishlist
 */
export function useWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, inWishlist }: { productId: string; inWishlist: boolean }) => {
      if (inWishlist) {
        return await trpc.wishlist.remove.mutate({ productId });
      } else {
        return await trpc.wishlist.add.mutate({ productId });
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["product", variables.productId] });
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
}

/**
 * Hook to fetch user's wishlist
 */
export function useUserWishlist() {
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const result = await trpc.wishlist.list.query();
      return result;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to search products
 */
export function useSearchProducts(
  query: string,
  filters?: {
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    rating?: number;
  }
) {
  return useQuery({
    queryKey: ["searchProducts", query, filters],
    queryFn: async () => {
      const result = await trpc.products.search.query({ query, ...filters });
      return result;
    },
    enabled: query.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to get search suggestions
 */
export function useSearchSuggestions(query: string) {
  return useQuery({
    queryKey: ["searchSuggestions", query],
    queryFn: async () => {
      const result = await trpc.products.getSuggestions.query({ query });
      return result;
    },
    enabled: query.length > 1,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
