import * as Device from "expo-device";
import Constants from "expo-constants";
import { Feedback, FeedbackFilter, FeedbackAnalytics } from "@/shared/types/feedback";

/**
 * Feedback Service
 * Handles all feedback-related API calls and operations
 */

const API_BASE = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

/**
 * Get device information
 */
export async function getDeviceInfo() {
  return {
    platform: Device.osName?.toLowerCase() || "unknown",
    osVersion: Device.osVersion || "unknown",
    appVersion: Constants.expoConfig?.version || "1.0.0",
    screenSize: `${Device.designName || "unknown"}`,
    locale: Device.locale || "ar",
  };
}

/**
 * Submit feedback
 */
export async function submitFeedback(feedbackData: Partial<Feedback>): Promise<Feedback> {
  try {
    const deviceInfo = await getDeviceInfo();

    const payload = {
      ...feedbackData,
      deviceInfo,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const response = await fetch(`${API_BASE}/api/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to submit feedback: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error submitting feedback:", error);
    throw error;
  }
}

/**
 * Get all feedback
 */
export async function getFeedback(filter?: FeedbackFilter): Promise<Feedback[]> {
  try {
    const queryParams = new URLSearchParams();

    if (filter) {
      if (filter.type) queryParams.append("type", filter.type);
      if (filter.status) queryParams.append("status", filter.status);
      if (filter.severity) queryParams.append("severity", filter.severity);
      if (filter.category) queryParams.append("category", filter.category);
      if (filter.rating) queryParams.append("rating", filter.rating.toString());
      if (filter.searchQuery) queryParams.append("search", filter.searchQuery);
      if (filter.sortBy) queryParams.append("sortBy", filter.sortBy);
      if (filter.sortOrder) queryParams.append("sortOrder", filter.sortOrder);
      if (filter.limit) queryParams.append("limit", filter.limit.toString());
      if (filter.offset) queryParams.append("offset", filter.offset.toString());
    }

    const url = `${API_BASE}/api/feedback?${queryParams.toString()}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch feedback: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching feedback:", error);
    throw error;
  }
}

/**
 * Get feedback by ID
 */
export async function getFeedbackById(id: string): Promise<Feedback> {
  try {
    const response = await fetch(`${API_BASE}/api/feedback/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch feedback: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching feedback:", error);
    throw error;
  }
}

/**
 * Update feedback
 */
export async function updateFeedback(id: string, data: Partial<Feedback>): Promise<Feedback> {
  try {
    const response = await fetch(`${API_BASE}/api/feedback/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        updatedAt: new Date(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update feedback: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating feedback:", error);
    throw error;
  }
}

/**
 * Delete feedback
 */
export async function deleteFeedback(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/api/feedback/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete feedback: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error deleting feedback:", error);
    throw error;
  }
}

/**
 * Get feedback analytics
 */
export async function getFeedbackAnalytics(): Promise<FeedbackAnalytics> {
  try {
    const response = await fetch(`${API_BASE}/api/feedback/analytics`);

    if (!response.ok) {
      throw new Error(`Failed to fetch analytics: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching analytics:", error);
    throw error;
  }
}

/**
 * Get feedback statistics
 */
export async function getFeedbackStats() {
  try {
    const response = await fetch(`${API_BASE}/api/feedback/stats`);

    if (!response.ok) {
      throw new Error(`Failed to fetch stats: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching stats:", error);
    throw error;
  }
}

/**
 * Export feedback as CSV
 */
export async function exportFeedbackAsCSV(filter?: FeedbackFilter): Promise<Blob> {
  try {
    const queryParams = new URLSearchParams();

    if (filter) {
      if (filter.type) queryParams.append("type", filter.type);
      if (filter.status) queryParams.append("status", filter.status);
      if (filter.searchQuery) queryParams.append("search", filter.searchQuery);
    }

    const url = `${API_BASE}/api/feedback/export/csv?${queryParams.toString()}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to export feedback: ${response.statusText}`);
    }

    return await response.blob();
  } catch (error) {
    console.error("Error exporting feedback:", error);
    throw error;
  }
}

/**
 * Send feedback notification to admin
 */
export async function notifyAdminOfFeedback(feedbackId: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/api/feedback/${feedbackId}/notify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to send notification: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
}

export default {
  getDeviceInfo,
  submitFeedback,
  getFeedback,
  getFeedbackById,
  updateFeedback,
  deleteFeedback,
  getFeedbackAnalytics,
  getFeedbackStats,
  exportFeedbackAsCSV,
  notifyAdminOfFeedback,
};
