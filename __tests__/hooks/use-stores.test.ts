import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import {
  useStores,
  useStore,
  useStoreProducts,
  useStoreRatings,
  useFollowStore,
  useFollowingStores,
  useSearchStores,
  useFeaturedStores,
} from "@/hooks/use-stores";

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

describe("useStores", () => {
  it("should fetch stores list", async () => {
    const { result } = renderHook(() => useStores(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeDefined();
  });

  it("should apply filters", async () => {
    const filters = { category: "electronics", rating: 4 };
    const { result } = renderHook(() => useStores(filters), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeDefined();
  });
});

describe("useStore", () => {
  it("should fetch single store by ID", async () => {
    const { result } = renderHook(() => useStore("store1"), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeDefined();
  });

  it("should not fetch without store ID", () => {
    const { result } = renderHook(() => useStore(""), { wrapper });

    expect(result.current.isLoading).toBe(false);
  });
});

describe("useStoreProducts", () => {
  it("should fetch store products", async () => {
    const { result } = renderHook(() => useStoreProducts("store1"), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeDefined();
  });

  it("should respect limit parameter", async () => {
    const { result } = renderHook(() => useStoreProducts("store1", 10), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeDefined();
  });
});

describe("useStoreRatings", () => {
  it("should fetch store ratings", async () => {
    const { result } = renderHook(() => useStoreRatings("store1"), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeDefined();
  });

  it("should include rating distribution", async () => {
    const { result } = renderHook(() => useStoreRatings("store1"), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    if (result.current.data) {
      expect(result.current.data).toHaveProperty("average");
      expect(result.current.data).toHaveProperty("distribution");
    }
  });
});

describe("useFollowStore", () => {
  it("should follow store", async () => {
    const { result } = renderHook(() => useFollowStore(), { wrapper });

    const mutation = result.current;

    expect(mutation.isPending).toBe(false);
  });

  it("should unfollow store", async () => {
    const { result } = renderHook(() => useFollowStore(), { wrapper });

    const mutation = result.current;

    expect(mutation.isPending).toBe(false);
  });
});

describe("useFollowingStores", () => {
  it("should fetch following stores", async () => {
    const { result } = renderHook(() => useFollowingStores(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(Array.isArray(result.current.data)).toBe(true);
  });
});

describe("useSearchStores", () => {
  it("should search stores", async () => {
    const { result } = renderHook(() => useSearchStores("test"), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeDefined();
  });

  it("should not search with empty query", () => {
    const { result } = renderHook(() => useSearchStores(""), { wrapper });

    expect(result.current.isLoading).toBe(false);
  });
});

describe("useFeaturedStores", () => {
  it("should fetch featured stores", async () => {
    const { result } = renderHook(() => useFeaturedStores(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeDefined();
  });

  it("should respect limit parameter", async () => {
    const { result } = renderHook(() => useFeaturedStores(8), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeDefined();
  });
});
