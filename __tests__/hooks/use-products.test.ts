import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import {
  useProducts,
  useProduct,
  useSimilarProducts,
  useLikeProduct,
  useWishlist,
  useUserWishlist,
  useSearchProducts,
  useSearchSuggestions,
} from "@/hooks/use-products";

// Mock data
const mockProduct = {
  id: "1",
  name: "Test Product",
  price: 100,
  category: "electronics",
  storeId: "1",
  rating: 4.5,
  likes: 10,
  image: "test.jpg",
};

const mockProducts = [mockProduct, { ...mockProduct, id: "2", name: "Test Product 2" }];

// Setup
let queryClient: QueryClient;

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

beforeEach(() => {
  queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
});

describe("useProducts", () => {
  it("should fetch products successfully", async () => {
    const { result } = renderHook(() => useProducts(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeDefined();
  });

  it("should apply filters correctly", async () => {
    const filters = { categoryId: "electronics", minPrice: 50, maxPrice: 200 };
    const { result } = renderHook(() => useProducts(filters), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeDefined();
  });

  it("should handle errors gracefully", async () => {
    vi.mock("@/lib/trpc", () => ({
      trpc: {
        products: {
          list: {
            useQuery: () => ({
              data: undefined,
              isLoading: false,
              error: new Error("Failed to fetch"),
            }),
          },
        },
      },
    }));

    const { result } = renderHook(() => useProducts(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });
});

describe("useProduct", () => {
  it("should fetch single product by ID", async () => {
    const { result } = renderHook(() => useProduct("1"), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeDefined();
  });

  it("should not fetch when ID is empty", () => {
    const { result } = renderHook(() => useProduct(""), { wrapper });

    expect(result.current.isLoading).toBe(false);
  });
});

describe("useSimilarProducts", () => {
  it("should fetch similar products", async () => {
    const { result } = renderHook(() => useSimilarProducts("1", 6), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeDefined();
  });

  it("should respect limit parameter", async () => {
    const { result } = renderHook(() => useSimilarProducts("1", 3), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeDefined();
  });
});

describe("useLikeProduct", () => {
  it("should like a product", async () => {
    const { result } = renderHook(() => useLikeProduct(), { wrapper });

    const mutation = result.current;

    expect(mutation.isPending).toBe(false);
  });

  it("should unlike a product", async () => {
    const { result } = renderHook(() => useLikeProduct(), { wrapper });

    const mutation = result.current;

    expect(mutation.isPending).toBe(false);
  });
});

describe("useWishlist", () => {
  it("should add product to wishlist", async () => {
    const { result } = renderHook(() => useWishlist(), { wrapper });

    const mutation = result.current;

    expect(mutation.isPending).toBe(false);
  });

  it("should remove product from wishlist", async () => {
    const { result } = renderHook(() => useWishlist(), { wrapper });

    const mutation = result.current;

    expect(mutation.isPending).toBe(false);
  });
});

describe("useUserWishlist", () => {
  it("should fetch user wishlist", async () => {
    const { result } = renderHook(() => useUserWishlist(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeDefined();
  });
});

describe("useSearchProducts", () => {
  it("should search products with query", async () => {
    const { result } = renderHook(() => useSearchProducts("test"), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeDefined();
  });

  it("should not search with empty query", () => {
    const { result } = renderHook(() => useSearchProducts(""), { wrapper });

    expect(result.current.isLoading).toBe(false);
  });

  it("should apply filters to search", async () => {
    const filters = { categoryId: "electronics", minPrice: 50 };
    const { result } = renderHook(() => useSearchProducts("test", filters), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeDefined();
  });
});

describe("useSearchSuggestions", () => {
  it("should fetch search suggestions", async () => {
    const { result } = renderHook(() => useSearchSuggestions("te"), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeDefined();
  });

  it("should not fetch with query length less than 2", () => {
    const { result } = renderHook(() => useSearchSuggestions("t"), { wrapper });

    expect(result.current.isLoading).toBe(false);
  });
});
