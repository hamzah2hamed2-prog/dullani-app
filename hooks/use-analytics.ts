import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";

export interface UserStats {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  followers: number;
  engagement: number;
}

export interface DailyStats {
  day: string;
  value: number;
}

export interface AnalyticsData {
  stats: UserStats;
  dailyData: DailyStats[];
  timeRange: "day" | "week" | "month";
}

/**
 * Hook to fetch user analytics
 */
export function useUserAnalytics(userId?: number, timeRange: "day" | "week" | "month" = "week") {
  return useQuery({
    queryKey: ["userAnalytics", userId, timeRange],
    queryFn: async () => {
      if (!userId) return null;
      try {
        // Fetch from API or use mock data
        const stats: UserStats = {
          views: Math.floor(Math.random() * 5000),
          likes: Math.floor(Math.random() * 500),
          comments: Math.floor(Math.random() * 200),
          shares: Math.floor(Math.random() * 100),
          followers: Math.floor(Math.random() * 2000),
          engagement: Math.random() * 20,
        };

        const dailyData: DailyStats[] = [
          { day: "السبت", value: 320 },
          { day: "الأحد", value: 280 },
          { day: "الاثنين", value: 450 },
          { day: "الثلاثاء", value: 380 },
          { day: "الأربعاء", value: 520 },
          { day: "الخميس", value: 480 },
          { day: "الجمعة", value: 610 },
        ];

        return {
          stats,
          dailyData,
          timeRange,
        };
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
        return null;
      }
    },
    enabled: !!userId,
  });
}

/**
 * Hook to fetch store analytics (for merchants)
 */
export function useStoreAnalytics(storeId?: number, timeRange: "day" | "week" | "month" = "week") {
  return useQuery({
    queryKey: ["storeAnalytics", storeId, timeRange],
    queryFn: async () => {
      if (!storeId) return null;
      try {
        // Mock store analytics data
        return {
          totalSales: Math.floor(Math.random() * 50000),
          totalOrders: Math.floor(Math.random() * 500),
          conversionRate: (Math.random() * 10).toFixed(2),
          averageOrderValue: Math.floor(Math.random() * 500),
          topProducts: [
            { id: 1, name: "منتج 1", sales: 150 },
            { id: 2, name: "منتج 2", sales: 120 },
            { id: 3, name: "منتج 3", sales: 95 },
          ],
          timeRange,
        };
      } catch (error) {
        console.error("Failed to fetch store analytics:", error);
        return null;
      }
    },
    enabled: !!storeId,
  });
}

/**
 * Hook to fetch engagement metrics
 */
export function useEngagementMetrics(userId?: number) {
  return useQuery({
    queryKey: ["engagementMetrics", userId],
    queryFn: async () => {
      if (!userId) return null;
      try {
        return {
          likeRate: (Math.random() * 15).toFixed(2),
          commentRate: (Math.random() * 5).toFixed(2),
          shareRate: (Math.random() * 3).toFixed(2),
          saveRate: (Math.random() * 8).toFixed(2),
          totalEngagement: Math.floor(Math.random() * 10000),
        };
      } catch (error) {
        console.error("Failed to fetch engagement metrics:", error);
        return null;
      }
    },
    enabled: !!userId,
  });
}

/**
 * Hook to fetch activity history
 */
export function useActivityHistory(userId?: number, limit = 20) {
  return useQuery({
    queryKey: ["activityHistory", userId, limit],
    queryFn: async () => {
      if (!userId) return [];
      try {
        // Mock activity data
        const activities = [
          {
            id: 1,
            type: "like",
            product: "منتج 1",
            timestamp: new Date(Date.now() - 3600000),
          },
          {
            id: 2,
            type: "comment",
            product: "منتج 2",
            timestamp: new Date(Date.now() - 7200000),
          },
          {
            id: 3,
            type: "follow",
            product: "متجر 1",
            timestamp: new Date(Date.now() - 86400000),
          },
        ];
        return activities;
      } catch (error) {
        console.error("Failed to fetch activity history:", error);
        return [];
      }
    },
    enabled: !!userId,
  });
}

/**
 * Hook to fetch product recommendations
 */
export function useProductRecommendations(userId?: number, limit = 10) {
  return useQuery({
    queryKey: ["productRecommendations", userId, limit],
    queryFn: async () => {
      if (!userId) return [];
      try {
        // Mock recommendations
        return Array.from({ length: limit }, (_, i) => ({
          id: i + 1,
          name: `منتج موصى به ${i + 1}`,
          price: Math.floor(Math.random() * 1000),
          rating: (Math.random() * 5).toFixed(1),
          similarity: Math.floor(Math.random() * 100),
        }));
      } catch (error) {
        console.error("Failed to fetch recommendations:", error);
        return [];
      }
    },
    enabled: !!userId,
  });
}
