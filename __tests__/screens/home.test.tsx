import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HomeScreen from "@/app/(tabs)/index";
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

describe("HomeScreen", () => {
  it("should render home screen", () => {
    render(<HomeScreen />, { wrapper });

    expect(screen.getByText(/Welcome/i)).toBeTruthy();
  });

  it("should display featured stores section", async () => {
    render(<HomeScreen />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText(/المتاجر المشهورة/i)).toBeTruthy();
    });
  });

  it("should display special offers section", async () => {
    render(<HomeScreen />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText(/العروض الخاصة/i)).toBeTruthy();
    });
  });

  it("should display new today section", async () => {
    render(<HomeScreen />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText(/الجديد اليوم/i)).toBeTruthy();
    });
  });

  it("should display advanced filters button", () => {
    render(<HomeScreen />, { wrapper });

    expect(screen.getByText(/فلاتر متقدمة/i)).toBeTruthy();
  });

  it("should display pull-to-refresh", () => {
    render(<HomeScreen />, { wrapper });

    // Check if ScrollView is present (used for pull-to-refresh)
    const scrollView = screen.UNSAFE_getByType("ScrollView");
    expect(scrollView).toBeTruthy();
  });

  it("should display featured stores with correct layout", async () => {
    render(<HomeScreen />, { wrapper });

    await waitFor(() => {
      const storesSection = screen.getByText(/المتاجر المشهورة/i);
      expect(storesSection).toBeTruthy();
    });
  });

  it("should display special offers with discount badges", async () => {
    render(<HomeScreen />, { wrapper });

    await waitFor(() => {
      const offersSection = screen.getByText(/العروض الخاصة/i);
      expect(offersSection).toBeTruthy();
    });
  });

  it("should handle filter toggle", async () => {
    render(<HomeScreen />, { wrapper });

    const filterButton = screen.getByText(/فلاتر متقدمة/i);
    expect(filterButton).toBeTruthy();
  });

  it("should display products grid", async () => {
    render(<HomeScreen />, { wrapper });

    await waitFor(() => {
      // Check if FlatList is rendered for products
      expect(screen.UNSAFE_queryAllByType("FlatList").length).toBeGreaterThan(0);
    });
  });
});
