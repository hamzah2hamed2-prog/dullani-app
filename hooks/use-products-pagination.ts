import { useInfiniteQuery, UseInfiniteQueryResult } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import { useMemo } from "react";

export interface PaginationParams {
  limit?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  sortBy?: "newest" | "oldest" | "price-asc" | "price-desc" | "rating";
}

/**
 * Hook for infinite scrolling products with pagination
 * Automatically loads more products as user scrolls
 */
export function useProductsPagination(
  params: PaginationParams = {}
): UseInfiniteQueryResult<any, unknown> {
  const { limit = 20, ...filterParams } = params;

  return useInfiniteQuery({
    queryKey: ["products", "infinite", filterParams],
    queryFn: async ({ pageParam = 0 }) => {
      const offset = pageParam * limit;
      const data = await trpc.products.list.query({
        limit,
        offset,
        ...filterParams,
      });
      return data;
    },
    getNextPageParam: (lastPage, pages) => {
      // Return next page number if there are more results
      if (lastPage.length < limit) return undefined;
      return pages.length;
    },
    initialPageParam: 0,
  });
}

/**
 * Hook for infinite scrolling search results with pagination
 */
export function useSearchProductsPagination(
  query: string,
  params: PaginationParams = {}
): UseInfiniteQueryResult<any, unknown> {
  const { limit = 20, ...filterParams } = params;

  return useInfiniteQuery({
    queryKey: ["products", "search", query, filterParams],
    queryFn: async ({ pageParam = 0 }) => {
      const offset = pageParam * limit;
      const data = await trpc.products.search.query({
        query,
        limit,
        offset,
        ...filterParams,
      });
      return data;
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < limit) return undefined;
      return pages.length;
    },
    initialPageParam: 0,
    enabled: !!query,
  });
}

/**
 * Hook for infinite scrolling store products with pagination
 */
export function useStoreProductsPagination(
  storeId: string,
  params: PaginationParams = {}
): UseInfiniteQueryResult<any, unknown> {
  const { limit = 20, ...filterParams } = params;

  return useInfiniteQuery({
    queryKey: ["products", "store", storeId, filterParams],
    queryFn: async ({ pageParam = 0 }) => {
      const offset = pageParam * limit;
      const data = await trpc.products.byStore.query({
        storeId,
        limit,
        offset,
        ...filterParams,
      });
      return data;
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < limit) return undefined;
      return pages.length;
    },
    initialPageParam: 0,
    enabled: !!storeId,
  });
}

/**
 * Hook for infinite scrolling similar products with pagination
 */
export function useSimilarProductsPagination(
  productId: string,
  limit: number = 20
): UseInfiniteQueryResult<any, unknown> {
  return useInfiniteQuery({
    queryKey: ["products", "similar", productId],
    queryFn: async ({ pageParam = 0 }) => {
      const offset = pageParam * limit;
      const data = await trpc.products.similar.query({
        productId,
        limit,
        offset,
      });
      return data;
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < limit) return undefined;
      return pages.length;
    },
    initialPageParam: 0,
    enabled: !!productId,
  });
}

/**
 * Utility hook to flatten paginated data
 */
export function useFlattenedPages(pages: any[] | undefined) {
  return useMemo(() => {
    if (!pages) return [];
    return pages.flatMap((page) => page);
  }, [pages]);
}

/**
 * Utility hook to check if there are more pages to load
 */
export function useHasNextPage(
  hasNextPage: boolean | undefined,
  isFetchingNextPage: boolean
) {
  return useMemo(() => {
    return hasNextPage && !isFetchingNextPage;
  }, [hasNextPage, isFetchingNextPage]);
}
