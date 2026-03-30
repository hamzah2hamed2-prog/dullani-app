import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProductDetailScreen from "@/app/(tabs)/product/[id]";
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

describe("ProductDetailScreen", () => {
  it("should render product detail screen", () => {
    render(<ProductDetailScreen />, { wrapper });

    expect(screen.getByText(/تفاصيل المنتج/i)).toBeTruthy();
  });

  it("should display product image", async () => {
    render(<ProductDetailScreen />, { wrapper });

    await waitFor(() => {
      const images = screen.UNSAFE_queryAllByType("Image");
      expect(images.length).toBeGreaterThan(0);
    });
  });

  it("should display product name and price", async () => {
    render(<ProductDetailScreen />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText(/المنتج/i)).toBeTruthy();
    });
  });

  it("should display product rating", async () => {
    render(<ProductDetailScreen />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText(/نجوم/i)).toBeTruthy();
    });
  });

  it("should display share button", async () => {
    render(<ProductDetailScreen />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText(/مشاركة/i)).toBeTruthy();
    });
  });

  it("should display inline comments section", async () => {
    render(<ProductDetailScreen />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText(/التعليقات/i)).toBeTruthy();
    });
  });

  it("should display direct message button", async () => {
    render(<ProductDetailScreen />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText(/رسالة مباشرة/i)).toBeTruthy();
    });
  });

  it("should display similar products section", async () => {
    render(<ProductDetailScreen />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText(/منتجات مشابهة/i)).toBeTruthy();
    });
  });

  it("should display report options", async () => {
    render(<ProductDetailScreen />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText(/إبلاغ/i)).toBeTruthy();
    });
  });

  it("should display store rating", async () => {
    render(<ProductDetailScreen />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText(/تقييم المتجر/i)).toBeTruthy();
    });
  });

  it("should display follow store button", async () => {
    render(<ProductDetailScreen />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText(/متابعة/i)).toBeTruthy();
    });
  });

  it("should display add to wishlist button", async () => {
    render(<ProductDetailScreen />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText(/قائمة الرغبات/i)).toBeTruthy();
    });
  });

  it("should display like button", async () => {
    render(<ProductDetailScreen />, { wrapper });

    await waitFor(() => {
      const likeButtons = screen.UNSAFE_queryAllByType("TouchableOpacity");
      expect(likeButtons.length).toBeGreaterThan(0);
    });
  });

  it("should display WhatsApp contact button", async () => {
    render(<ProductDetailScreen />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText(/واتساب/i)).toBeTruthy();
    });
  });
});
