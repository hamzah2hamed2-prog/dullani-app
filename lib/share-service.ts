/**
 * Share Service
 * Handles share tracking, analytics, and share history
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

export interface ShareEvent {
  productId: string;
  platform: string;
  timestamp: number;
  userId?: string;
}

export interface ShareStats {
  productId: string;
  totalShares: number;
  sharesByPlatform: Record<string, number>;
  lastShared: number;
  uniqueUsers: number;
}

const SHARE_HISTORY_KEY = "@dullani/share_history";
const SHARE_STATS_KEY = "@dullani/share_stats";

/**
 * Track a share event
 */
export async function trackShare(
  productId: string,
  platform: string,
  userId?: string
): Promise<void> {
  try {
    const event: ShareEvent = {
      productId,
      platform,
      timestamp: Date.now(),
      userId,
    };

    // Add to local history
    const history = await getShareHistory();
    history.push(event);

    // Keep only last 100 shares
    if (history.length > 100) {
      history.shift();
    }

    await AsyncStorage.setItem(SHARE_HISTORY_KEY, JSON.stringify(history));

    // Update stats
    await updateShareStats(productId, platform);

    // Send to server if needed
    await sendShareAnalytics(event);
  } catch (error) {
    console.error("Error tracking share:", error);
  }
}

/**
 * Get share history
 */
export async function getShareHistory(): Promise<ShareEvent[]> {
  try {
    const history = await AsyncStorage.getItem(SHARE_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error("Error getting share history:", error);
    return [];
  }
}

/**
 * Get share stats for a product
 */
export async function getShareStats(productId: string): Promise<ShareStats> {
  try {
    const stats = await AsyncStorage.getItem(SHARE_STATS_KEY);
    const allStats = stats ? JSON.parse(stats) : {};

    return (
      allStats[productId] || {
        productId,
        totalShares: 0,
        sharesByPlatform: {},
        lastShared: 0,
        uniqueUsers: 0,
      }
    );
  } catch (error) {
    console.error("Error getting share stats:", error);
    return {
      productId,
      totalShares: 0,
      sharesByPlatform: {},
      lastShared: 0,
      uniqueUsers: 0,
    };
  }
}

/**
 * Update share stats
 */
async function updateShareStats(
  productId: string,
  platform: string
): Promise<void> {
  try {
    const stats = await AsyncStorage.getItem(SHARE_STATS_KEY);
    const allStats = stats ? JSON.parse(stats) : {};

    const productStats = allStats[productId] || {
      productId,
      totalShares: 0,
      sharesByPlatform: {},
      lastShared: 0,
      uniqueUsers: 0,
    };

    productStats.totalShares += 1;
    productStats.sharesByPlatform[platform] =
      (productStats.sharesByPlatform[platform] || 0) + 1;
    productStats.lastShared = Date.now();

    allStats[productId] = productStats;

    await AsyncStorage.setItem(SHARE_STATS_KEY, JSON.stringify(allStats));
  } catch (error) {
    console.error("Error updating share stats:", error);
  }
}

/**
 * Clear share history
 */
export async function clearShareHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(SHARE_HISTORY_KEY);
  } catch (error) {
    console.error("Error clearing share history:", error);
  }
}

/**
 * Get most shared products
 */
export async function getMostSharedProducts(limit: number = 10): Promise<ShareStats[]> {
  try {
    const stats = await AsyncStorage.getItem(SHARE_STATS_KEY);
    const allStats = stats ? JSON.parse(stats) : {};

    return Object.values(allStats)
      .sort((a: any, b: any) => b.totalShares - a.totalShares)
      .slice(0, limit);
  } catch (error) {
    console.error("Error getting most shared products:", error);
    return [];
  }
}

/**
 * Get popular share platforms
 */
export async function getPopularPlatforms(): Promise<Record<string, number>> {
  try {
    const history = await getShareHistory();
    const platforms: Record<string, number> = {};

    history.forEach((event) => {
      platforms[event.platform] = (platforms[event.platform] || 0) + 1;
    });

    return platforms;
  } catch (error) {
    console.error("Error getting popular platforms:", error);
    return {};
  }
}

/**
 * Send share analytics to server
 */
async function sendShareAnalytics(event: ShareEvent): Promise<void> {
  try {
    // This would be implemented to send to your analytics backend
    // For now, it's a placeholder
    console.log("Share analytics event:", event);

    // Example API call:
    // await fetch('/api/analytics/share', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(event),
    // });
  } catch (error) {
    console.error("Error sending share analytics:", error);
  }
}

/**
 * Generate share URL for a product
 */
export function generateShareUrl(
  productId: string,
  baseUrl: string = "https://dullani.app"
): string {
  const params = new URLSearchParams({
    product: productId,
    source: "share",
  });

  return `${baseUrl}/product/${productId}?${params.toString()}`;
}

/**
 * Generate share message
 */
export function generateShareMessage(
  productTitle: string,
  productDescription?: string
): string {
  const message = `تحقق من هذا المنتج: ${productTitle}`;

  if (productDescription) {
    return `${message}\n${productDescription}`;
  }

  return message;
}

/**
 * Get share statistics summary
 */
export async function getShareStatsSummary(): Promise<{
  totalShares: number;
  uniqueProducts: number;
  popularPlatforms: Record<string, number>;
  lastShareTime: number;
}> {
  try {
    const history = await getShareHistory();
    const stats = await AsyncStorage.getItem(SHARE_STATS_KEY);
    const allStats = stats ? JSON.parse(stats) : {};
    const platforms = await getPopularPlatforms();

    return {
      totalShares: history.length,
      uniqueProducts: Object.keys(allStats).length,
      popularPlatforms: platforms,
      lastShareTime: history.length > 0 ? history[history.length - 1].timestamp : 0,
    };
  } catch (error) {
    console.error("Error getting share stats summary:", error);
    return {
      totalShares: 0,
      uniqueProducts: 0,
      popularPlatforms: {},
      lastShareTime: 0,
    };
  }
}
