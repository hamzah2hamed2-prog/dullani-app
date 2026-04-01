/**
 * Feedback Types and Interfaces
 */

export type FeedbackType = "bug" | "feature" | "improvement" | "general" | "performance";
export type FeedbackSeverity = "low" | "medium" | "high" | "critical";
export type FeedbackStatus = "new" | "reviewing" | "in-progress" | "resolved" | "closed";

/**
 * Feedback submission
 */
export interface Feedback {
  id: string;
  userId: string;
  type: FeedbackType;
  title: string;
  description: string;
  rating?: number; // 1-5 stars
  severity?: FeedbackSeverity;
  category?: string;
  attachments?: string[]; // URLs
  email?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
  status: FeedbackStatus;
  tags?: string[];
  relatedFeature?: string;
  deviceInfo?: DeviceInfo;
  appVersion?: string;
}

/**
 * Device information
 */
export interface DeviceInfo {
  platform: "ios" | "android" | "web";
  osVersion: string;
  appVersion: string;
  screenSize: string;
  locale: string;
}

/**
 * Feedback analytics
 */
export interface FeedbackAnalytics {
  totalFeedback: number;
  averageRating: number;
  feedbackByType: Record<FeedbackType, number>;
  feedbackByStatus: Record<FeedbackStatus, number>;
  feedbackBySeverity: Record<FeedbackSeverity, number>;
  topCategories: Array<{ category: string; count: number }>;
  topTags: Array<{ tag: string; count: number }>;
  recentFeedback: Feedback[];
  trendsOverTime: Array<{
    date: string;
    count: number;
    averageRating: number;
  }>;
}

/**
 * Feedback response
 */
export interface FeedbackResponse {
  id: string;
  feedbackId: string;
  responderId: string;
  responderName: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Feedback filter options
 */
export interface FeedbackFilter {
  type?: FeedbackType;
  status?: FeedbackStatus;
  severity?: FeedbackSeverity;
  category?: string;
  rating?: number;
  dateFrom?: Date;
  dateTo?: Date;
  searchQuery?: string;
  tags?: string[];
  sortBy?: "date" | "rating" | "severity";
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

/**
 * Feedback submission form data
 */
export interface FeedbackFormData {
  type: FeedbackType;
  title: string;
  description: string;
  rating?: number;
  category?: string;
  email?: string;
  phone?: string;
  attachments?: File[];
  tags?: string[];
}

/**
 * Feedback statistics
 */
export interface FeedbackStats {
  totalCount: number;
  averageRating: number;
  resolvedCount: number;
  pendingCount: number;
  criticalCount: number;
  satisfactionRate: number; // percentage
  responseTime: number; // average hours
}

export default {
  FeedbackType,
  FeedbackSeverity,
  FeedbackStatus,
  Feedback,
  DeviceInfo,
  FeedbackAnalytics,
  FeedbackResponse,
  FeedbackFilter,
  FeedbackFormData,
  FeedbackStats,
};
