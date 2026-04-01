/**
 * Testing Utilities and Helpers
 * Provides utilities for testing the application
 */

import { render, RenderOptions } from "@testing-library/react-native";
import React, { ReactElement } from "react";

/**
 * Custom render function with providers
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
  }

  return render(ui, { wrapper: Wrapper, ...options });
}

/**
 * Mock data generators
 */
export const mockData = {
  /**
   * Generate mock products
   */
  generateProducts: (count: number = 5) => {
    return Array.from({ length: count }, (_, i) => ({
      id: `product-${i + 1}`,
      name: `منتج ${i + 1}`,
      description: `وصف المنتج ${i + 1}`,
      price: Math.floor(Math.random() * 500) + 50,
      image: `https://via.placeholder.com/300x300?text=Product+${i + 1}`,
      rating: Math.floor(Math.random() * 5) + 1,
      reviews: Math.floor(Math.random() * 100),
      inStock: Math.random() > 0.3,
      category: ["ملابس", "أحذية", "إكسسوارات"][Math.floor(Math.random() * 3)],
    }));
  },

  /**
   * Generate mock conversations
   */
  generateConversations: (count: number = 5) => {
    return Array.from({ length: count }, (_, i) => ({
      id: `conversation-${i + 1}`,
      participantId: `user-${i + 1}`,
      participantName: `المستخدم ${i + 1}`,
      lastMessage: `آخر رسالة من المحادثة ${i + 1}`,
      lastMessageTime: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      unreadCount: Math.floor(Math.random() * 5),
      avatar: `https://via.placeholder.com/50x50?text=User+${i + 1}`,
    }));
  },

  /**
   * Generate mock messages
   */
  generateMessages: (count: number = 10) => {
    return Array.from({ length: count }, (_, i) => ({
      id: `message-${i + 1}`,
      senderId: i % 2 === 0 ? "current-user" : "other-user",
      text: `رسالة ${i + 1}`,
      timestamp: new Date(Date.now() - (count - i) * 60000).toISOString(),
      read: i < count - 2,
    }));
  },

  /**
   * Generate mock user
   */
  generateUser: () => ({
    id: "user-1",
    name: "أحمد محمد",
    email: "ahmed@example.com",
    phone: "+966501234567",
    avatar: "https://via.placeholder.com/100x100?text=User",
    bio: "مرحباً بك في ملفي الشخصي",
    followers: 150,
    following: 200,
    joinedDate: "2024-01-15",
  }),

  /**
   * Generate mock filters
   */
  generateFilters: () => [
    {
      id: "category",
      label: "الفئة",
      type: "radio" as const,
      options: [
        { id: "all", label: "الكل" },
        { id: "men", label: "رجالي" },
        { id: "women", label: "نسائي" },
        { id: "kids", label: "أطفال" },
      ],
      value: "all",
    },
    {
      id: "size",
      label: "الحجم",
      type: "checkbox" as const,
      options: [
        { id: "xs", label: "صغير جداً" },
        { id: "s", label: "صغير" },
        { id: "m", label: "متوسط" },
        { id: "l", label: "كبير" },
        { id: "xl", label: "كبير جداً" },
      ],
      value: [],
    },
    {
      id: "price",
      label: "السعر",
      type: "range" as const,
      minValue: 0,
      maxValue: 1000,
      value: [0, 1000],
    },
    {
      id: "inStock",
      label: "في المخزن فقط",
      type: "toggle" as const,
      value: false,
    },
  ],
};

/**
 * Performance testing utilities
 */
export const performanceUtils = {
  /**
   * Measure function execution time
   */
  measureTime: async (fn: () => Promise<void> | void, label: string = "Execution") => {
    const start = performance.now();
    await fn();
    const end = performance.now();
    const duration = end - start;
    console.log(`${label}: ${duration.toFixed(2)}ms`);
    return duration;
  },

  /**
   * Measure multiple executions
   */
  measureAverage: async (
    fn: () => Promise<void> | void,
    iterations: number = 10,
    label: string = "Average"
  ) => {
    const times: number[] = [];
    for (let i = 0; i < iterations; i++) {
      const time = await performanceUtils.measureTime(fn, `${label} - Iteration ${i + 1}`);
      times.push(time);
    }
    const average = times.reduce((a, b) => a + b, 0) / times.length;
    console.log(`${label} Average: ${average.toFixed(2)}ms`);
    return average;
  },
};

/**
 * Network simulation utilities
 */
export const networkUtils = {
  /**
   * Simulate network delay
   */
  delay: (ms: number) => new Promise((resolve) => setTimeout(resolve, ms)),

  /**
   * Simulate slow network
   */
  simulateSlow: async (fn: () => Promise<any>) => {
    await networkUtils.delay(2000);
    return fn();
  },

  /**
   * Simulate network error
   */
  simulateError: () => {
    throw new Error("Network error: Unable to fetch data");
  },

  /**
   * Simulate timeout
   */
  simulateTimeout: async (ms: number = 5000) => {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Request timeout")), ms);
    });
  },
};

/**
 * Assertion helpers
 */
export const assertions = {
  /**
   * Assert element is visible
   */
  isVisible: (element: any) => {
    expect(element).toBeTruthy();
  },

  /**
   * Assert element is not visible
   */
  isNotVisible: (element: any) => {
    expect(element).toBeFalsy();
  },

  /**
   * Assert text content
   */
  hasText: (element: any, text: string) => {
    expect(element.props.children).toContain(text);
  },

  /**
   * Assert array length
   */
  hasLength: (array: any[], length: number) => {
    expect(array).toHaveLength(length);
  },

  /**
   * Assert object properties
   */
  hasProperties: (obj: any, properties: Record<string, any>) => {
    Object.entries(properties).forEach(([key, value]) => {
      expect(obj[key]).toBe(value);
    });
  },
};

/**
 * Test data builders
 */
export class TestDataBuilder {
  private data: any = {};

  withProduct(product: any) {
    this.data.product = product;
    return this;
  }

  withUser(user: any) {
    this.data.user = user;
    return this;
  }

  withConversations(conversations: any[]) {
    this.data.conversations = conversations;
    return this;
  }

  withFilters(filters: any[]) {
    this.data.filters = filters;
    return this;
  }

  build() {
    return this.data;
  }
}

/**
 * Mock API responses
 */
export const mockApiResponses = {
  success: (data: any) => ({
    ok: true,
    status: 200,
    data,
  }),

  error: (message: string, status: number = 400) => ({
    ok: false,
    status,
    error: message,
  }),

  notFound: () =>
    mockApiResponses.error("Not found", 404),

  unauthorized: () =>
    mockApiResponses.error("Unauthorized", 401),

  serverError: () =>
    mockApiResponses.error("Internal server error", 500),

  timeout: () =>
    mockApiResponses.error("Request timeout", 408),
};

export default {
  renderWithProviders,
  mockData,
  performanceUtils,
  networkUtils,
  assertions,
  TestDataBuilder,
  mockApiResponses,
};
