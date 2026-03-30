import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";

/**
 * Hook to fetch stores with filters and pagination
 */
export function useStores(filters?: {
  categoryId?: string;
  rating?: number;
  search?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["stores", filters],
    queryFn: async () => {
      const result = await trpc.stores.list.query(filters || {});
      return result;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch a single store by ID
 */
export function useStore(storeId: string) {
  return useQuery({
    queryKey: ["store", storeId],
    queryFn: async () => {
      const result = await trpc.stores.getById.query({ id: storeId });
      return result;
    },
    enabled: !!storeId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Hook to fetch store products
 */
export function useStoreProducts(storeId: string, limit: number = 10) {
  return useQuery({
    queryKey: ["storeProducts", storeId],
    queryFn: async () => {
      const result = await trpc.stores.getProducts.query({ id: storeId, limit });
      return result;
    },
    enabled: !!storeId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch store ratings and reviews
 */
export function useStoreRatings(storeId: string) {
  return useQuery({
    queryKey: ["storeRatings", storeId],
    queryFn: async () => {
      const result = await trpc.stores.getRatings.query({ id: storeId });
      return result;
    },
    enabled: !!storeId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Hook to follow/unfollow a store
 */
export function useFollowStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ storeId, following }: { storeId: string; following: boolean }) => {
      if (following) {
        return await trpc.stores.unfollow.mutate({ storeId });
      } else {
        return await trpc.stores.follow.mutate({ storeId });
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["store", variables.storeId] });
      queryClient.invalidateQueries({ queryKey: ["stores"] });
    },
  });
}

/**
 * Hook to fetch user's following stores
 */
export function useFollowingStores() {
  return useQuery({
    queryKey: ["followingStores"],
    queryFn: async () => {
      const result = await trpc.stores.getFollowing.query();
      return result;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to search stores
 */
export function useSearchStores(query: string) {
  return useQuery({
    queryKey: ["searchStores", query],
    queryFn: async () => {
      const result = await trpc.stores.search.query({ query });
      return result;
    },
    enabled: query.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to get featured stores
 */
export function useFeaturedStores() {
  return useQuery({
    queryKey: ["featuredStores"],
    queryFn: async () => {
      const result = await trpc.stores.getFeatured.query();
      return result;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}
