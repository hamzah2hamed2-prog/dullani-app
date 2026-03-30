import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SearchScreen from "@/app/(tabs)/search";
import { ReactNode } from "react";

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

describe("SearchScreen", () => {
  it("should render search screen", () => {
    render(<SearchScreen />, { wrapper });

    expect(screen.getByPlaceholderText(/ابحث عن المنتجات/i)).toBeTruthy();
  });

  it("should display search history section", async () => {
    render(<SearchScreen />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText(/سجل البحث/i)).toBeTruthy();
    });
  });

  it("should display advanced search options", async () => {
    render(<SearchScreen />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText(/بحث متقدم/i)).toBeTruthy();
    });
  });

  it("should display saved searches", async () => {
    render(<SearchScreen />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText(/البحث المفضل/i)).toBeTruthy();
    });
  });

  it("should display smart suggestions", async () => {
    render(<SearchScreen />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText(/الاقتراحات الذكية/i)).toBeTruthy();
    });
  });

  it("should handle search input", () => {
    render(<SearchScreen />, { wrapper });

    const searchInput = screen.getByPlaceholderText(/ابحث عن المنتجات/i);
    fireEvent.changeText(searchInput, "test product");

    expect(searchInput.props.value).toBe("test product");
  });

  it("should display search results count", async () => {
    render(<SearchScreen />, { wrapper });

    const searchInput = screen.getByPlaceholderText(/ابحث عن المنتجات/i);
    fireEvent.changeText(searchInput, "test");

    await waitFor(() => {
      // Check if results count is displayed
      expect(screen.queryByText(/نتيجة/i)).toBeTruthy();
    });
  });

  it("should display clear search history button", async () => {
    render(<SearchScreen />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText(/مسح السجل/i)).toBeTruthy();
    });
  });

  it("should display price filter", async () => {
    render(<SearchScreen />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText(/السعر/i)).toBeTruthy();
    });
  });

  it("should display sort options", async () => {
    render(<SearchScreen />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText(/ترتيب/i)).toBeTruthy();
    });
  });

  it("should display category filter", async () => {
    render(<SearchScreen />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText(/الفئة/i)).toBeTruthy();
    });
  });

  it("should handle empty search results", async () => {
    render(<SearchScreen />, { wrapper });

    const searchInput = screen.getByPlaceholderText(/ابحث عن المنتجات/i);
    fireEvent.changeText(searchInput, "nonexistent product xyz");

    await waitFor(() => {
      expect(screen.getByText(/لم يتم العثور على نتائج/i)).toBeTruthy();
    });
  });
});
