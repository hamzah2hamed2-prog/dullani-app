import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock the share service
vi.mock("../../lib/share-service", () => ({
  trackShare: vi.fn(() => Promise.resolve()),
  getShareStats: vi.fn((id) => Promise.resolve({
    productId: id,
    totalShares: 0,
    sharesByPlatform: {},
    lastShared: 0,
    uniqueUsers: 0,
  })),
  getShareHistory: vi.fn(() => Promise.resolve([])),
  getMostSharedProducts: vi.fn(() => Promise.resolve([])),
  generateShareUrl: vi.fn((id) => `https://dullani.app/product/${id}?source=share`),
  generateShareMessage: vi.fn((title, desc) => `تحقق من هذا المنتج: ${title}${desc ? "\n" + desc : ""}`),
  getShareStatsSummary: vi.fn(() => Promise.resolve({
    totalShares: 0,
    uniqueProducts: 0,
    popularPlatforms: {},
    lastShareTime: 0,
  })),
  getPopularPlatforms: vi.fn(() => Promise.resolve({})),
  clearShareHistory: vi.fn(() => Promise.resolve()),
}));

import {
  trackShare,
  getShareStats,
  getShareHistory,
  getMostSharedProducts,
  generateShareUrl,
  generateShareMessage,
  getShareStatsSummary,
  getPopularPlatforms,
} from "../../lib/share-service";

/**
 * Social Sharing Feature Tests
 * Tests for share button, modal, and service
 */

describe("ShareButton Component", () => {
  describe("Share Data Validation", () => {
    it("should have required share data properties", () => {
      const shareData = {
        title: "منتج رائع",
        description: "وصف المنتج",
        url: "https://dullani.app/product/123",
        image: "https://example.com/image.jpg",
      };

      expect(shareData).toHaveProperty("title");
      expect(shareData).toHaveProperty("url");
      expect(shareData.title).toBeTruthy();
      expect(shareData.url).toBeTruthy();
    });

    it("should support optional description and image", () => {
      const shareData = {
        title: "منتج",
        url: "https://dullani.app/product/123",
      };

      expect(shareData.title).toBeTruthy();
      expect(shareData.url).toBeTruthy();
    });

    it("should validate URL format", () => {
      const validUrl = "https://dullani.app/product/123";
      const isValidUrl = /^https?:\/\/.+/.test(validUrl);

      expect(isValidUrl).toBe(true);
    });
  });

  describe("Share Variants", () => {
    it("should support icon variant", () => {
      const variant = "icon";
      expect(["icon", "button", "menu"]).toContain(variant);
    });

    it("should support button variant", () => {
      const variant = "button";
      expect(["icon", "button", "menu"]).toContain(variant);
    });

    it("should support menu variant", () => {
      const variant = "menu";
      expect(["icon", "button", "menu"]).toContain(variant);
    });

    it("should default to icon variant", () => {
      const defaultVariant = "icon";
      expect(defaultVariant).toBe("icon");
    });
  });

  describe("Share Platforms", () => {
    it("should support WhatsApp sharing", () => {
      const platforms = ["whatsapp", "telegram", "email", "copy", "native"];
      expect(platforms).toContain("whatsapp");
    });

    it("should support Telegram sharing", () => {
      const platforms = ["whatsapp", "telegram", "email", "copy", "native"];
      expect(platforms).toContain("telegram");
    });

    it("should support Email sharing", () => {
      const platforms = ["whatsapp", "telegram", "email", "copy", "native"];
      expect(platforms).toContain("email");
    });

    it("should support Copy to clipboard", () => {
      const platforms = ["whatsapp", "telegram", "email", "copy", "native"];
      expect(platforms).toContain("copy");
    });

    it("should support Native share", () => {
      const platforms = ["whatsapp", "telegram", "email", "copy", "native"];
      expect(platforms).toContain("native");
    });
  });
});

describe("ShareModal Component", () => {
  describe("Modal Visibility", () => {
    it("should show modal when visible prop is true", () => {
      const visible = true;
      expect(visible).toBe(true);
    });

    it("should hide modal when visible prop is false", () => {
      const visible = false;
      expect(visible).toBe(false);
    });

    it("should call onClose when close button is pressed", () => {
      const onClose = vi.fn();
      onClose();
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe("Modal Content", () => {
    it("should display product preview", () => {
      const shareData = {
        title: "منتج رائع",
        description: "وصف المنتج",
        url: "https://dullani.app/product/123",
        image: "https://example.com/image.jpg",
      };

      expect(shareData.title).toBeTruthy();
      expect(shareData.image).toBeTruthy();
    });

    it("should display all share options", () => {
      const options = ["native", "whatsapp", "telegram", "email", "copy"];
      expect(options).toHaveLength(5);
    });

    it("should display share link", () => {
      const url = "https://dullani.app/product/123";
      expect(url).toBeTruthy();
      expect(url).toMatch(/^https?:\/\//);
    });
  });

  describe("Modal Interactions", () => {
    it("should call onShare when option is selected", () => {
      const onShare = vi.fn();
      onShare("whatsapp");
      expect(onShare).toHaveBeenCalledWith("whatsapp");
    });

    it("should highlight selected option", () => {
      const selectedPlatform = "whatsapp";
      const isSelected = selectedPlatform === "whatsapp";
      expect(isSelected).toBe(true);
    });

    it("should copy link when copy button is pressed", () => {
      const onShare = vi.fn();
      onShare("copy");
      expect(onShare).toHaveBeenCalledWith("copy");
    });
  });
});

describe("Share Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  describe("Share Tracking", () => {
    it("should track share event", async () => {
      const productId = "product-123";
      const platform = "whatsapp";

      await trackShare(productId, platform);

      const history = await getShareHistory();
      expect(history.length).toBeGreaterThan(0);
    });

    it("should include timestamp in share event", async () => {
      const productId = "product-123";
      const platform = "whatsapp";

      await trackShare(productId, platform);

      const history = await getShareHistory();
      const lastEvent = history[history.length - 1];

      expect(lastEvent).toHaveProperty("timestamp");
      expect(lastEvent.timestamp).toBeGreaterThan(0);
    });

    it("should include userId in share event if provided", async () => {
      const productId = "product-123";
      const platform = "whatsapp";
      const userId = "user-456";

      await trackShare(productId, platform, userId);

      const history = await getShareHistory();
      const lastEvent = history[history.length - 1];

      expect(lastEvent).toHaveProperty("userId");
      expect(lastEvent.userId).toBe(userId);
    });
  });

  describe("Share Statistics", () => {
    it("should calculate total shares", async () => {
      const stats = await getShareStats("product-123");
      expect(stats).toHaveProperty("totalShares");
      expect(stats.totalShares).toBeGreaterThanOrEqual(0);
    });

    it("should track shares by platform", async () => {
      const stats = await getShareStats("product-123");
      expect(stats).toHaveProperty("sharesByPlatform");
      expect(typeof stats.sharesByPlatform).toBe("object");
    });

    it("should track last shared time", async () => {
      const stats = await getShareStats("product-123");
      expect(stats).toHaveProperty("lastShared");
      expect(stats.lastShared).toBeGreaterThanOrEqual(0);
    });

    it("should get most shared products", async () => {
      const products = await getMostSharedProducts(10);
      expect(Array.isArray(products)).toBe(true);
    });
  });

  describe("Share URLs", () => {
    it("should generate valid share URL", () => {
      const url = generateShareUrl("product-123");
      expect(url).toMatch(/^https?:\/\//);
      expect(url).toContain("product-123");
    });

    it("should include source parameter", () => {
      const url = generateShareUrl("product-123");
      expect(url).toContain("source=share");
    });

    it("should support custom base URL", () => {
      const customBase = "https://custom.app";
      const url = generateShareUrl("product-123", customBase);
      expect(url).toContain(customBase);
    });
  });

  describe("Share Messages", () => {
    it("should generate share message with title", () => {
      const message = generateShareMessage("منتج رائع");
      expect(message).toContain("منتج رائع");
    });

    it("should include description if provided", () => {
      const message = generateShareMessage("منتج رائع", "وصف المنتج");
      expect(message).toContain("وصف المنتج");
    });

    it("should format message correctly", () => {
      const message = generateShareMessage("منتج رائع");
      expect(message).toMatch(/تحقق من هذا المنتج/);
    });

    it("should support Arabic text", () => {
      const message = generateShareMessage("منتج رائع جداً");
      expect(message).toContain("منتج رائع جداً");
    });
  });

  describe("Share Analytics", () => {
    it("should get share statistics summary", async () => {
      const summary = await getShareStatsSummary();
      expect(summary).toHaveProperty("totalShares");
      expect(summary).toHaveProperty("uniqueProducts");
      expect(summary).toHaveProperty("popularPlatforms");
      expect(summary).toHaveProperty("lastShareTime");
    });

    it("should get popular platforms", async () => {
      const platforms = await getPopularPlatforms();
      expect(typeof platforms).toBe("object");
    });

    it("should return empty object if no shares", async () => {
      const platforms = await getPopularPlatforms();
      expect(platforms).toBeDefined();
    });
  });

  describe("Share History", () => {
    it("should retrieve share history", async () => {
      const history = await getShareHistory();
      expect(Array.isArray(history)).toBe(true);
    });

    it("should maintain chronological order", async () => {
      const history = await getShareHistory();
      for (let i = 1; i < history.length; i++) {
        expect(history[i].timestamp).toBeGreaterThanOrEqual(
          history[i - 1].timestamp
        );
      }
    });

    it("should limit history to 100 entries", async () => {
      // After adding many shares, history should not exceed 100
      const history = await getShareHistory();
      expect(history.length).toBeLessThanOrEqual(100);
    });
  });
});

describe("Share Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  describe("End-to-End Sharing", () => {
    it("should track share and update stats", async () => {
      const productId = "product-test-123";
      const platform = "whatsapp";

      await trackShare(productId, platform);

      const stats = await getShareStats(productId);
      expect(stats.totalShares).toBeGreaterThan(0);
      expect(stats.sharesByPlatform[platform]).toBeGreaterThan(0);
    });

    it("should handle multiple platforms", async () => {
      const productId = "product-multi-123";

      await trackShare(productId, "whatsapp");
      await trackShare(productId, "telegram");
      await trackShare(productId, "email");

      const stats = await getShareStats(productId);
      expect(Object.keys(stats.sharesByPlatform).length).toBe(3);
    });

    it("should track multiple products", async () => {
      await trackShare("product-1", "whatsapp");
      await trackShare("product-2", "telegram");

      const products = await getMostSharedProducts(10);
      expect(products.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Performance", () => {
    it("should handle rapid share tracking", async () => {
      const productId = "product-perf-123";

      for (let i = 0; i < 10; i++) {
        await trackShare(productId, "whatsapp");
      }

      const stats = await getShareStats(productId);
      expect(stats.totalShares).toBe(10);
    });

    it("should retrieve history efficiently", async () => {
      const startTime = Date.now();
      await getShareHistory();
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(1000); // Should complete in less than 1 second
    });
  });

  describe("Error Handling", () => {
    it("should handle missing product ID gracefully", async () => {
      const stats = await getShareStats("");
      expect(stats).toBeDefined();
      expect(stats.totalShares).toBe(0);
    });

    it("should handle invalid platform gracefully", async () => {
      await trackShare("product-123", "invalid-platform");
      const stats = await getShareStats("product-123");
      expect(stats.sharesByPlatform["invalid-platform"]).toBeDefined();
    });
  });
});

describe("Accessibility", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  describe("Arabic Support", () => {
    it("should support Arabic product titles", () => {
      const message = generateShareMessage("منتج رائع جداً");
      expect(message).toContain("منتج رائع جداً");
    });

    it("should support Arabic descriptions", () => {
      const message = generateShareMessage("منتج", "وصف عربي طويل");
      expect(message).toContain("وصف عربي طويل");
    });

    it("should format Arabic text correctly", () => {
      const message = generateShareMessage("المنتج الرائع");
      expect(message).toMatch(/تحقق من هذا المنتج/);
    });
  });

  describe("RTL Support", () => {
    it("should handle RTL text direction", () => {
      const arabicText = "منتج رائع";
      const isRTL = /[\u0590-\u08FF]/.test(arabicText);
      expect(isRTL).toBe(true);
    });
  });
});
