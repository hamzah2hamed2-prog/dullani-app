import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  SEARCH_HISTORY: "@dullani/search_history",
  FILTER_PREFERENCES: "@dullani/filter_preferences",
  RECENT_SEARCHES: "@dullani/recent_searches",
  FAVORITE_FILTERS: "@dullani/favorite_filters",
} as const;

/**
 * Preferences Storage Utility
 * Manages user preferences and search history
 */

/**
 * Save search query to history
 */
export async function saveSearchHistory(query: string, maxItems: number = 10): Promise<void> {
  try {
    const history = await getSearchHistory();
    // Remove duplicate if exists
    const filtered = history.filter((item) => item !== query);
    // Add new query at the beginning
    const updated = [query, ...filtered].slice(0, maxItems);
    await AsyncStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(updated));
  } catch (error) {
    console.error("Error saving search history:", error);
  }
}

/**
 * Get search history
 */
export async function getSearchHistory(): Promise<string[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error getting search history:", error);
    return [];
  }
}

/**
 * Clear search history
 */
export async function clearSearchHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.SEARCH_HISTORY);
  } catch (error) {
    console.error("Error clearing search history:", error);
  }
}

/**
 * Remove item from search history
 */
export async function removeFromSearchHistory(query: string): Promise<void> {
  try {
    const history = await getSearchHistory();
    const updated = history.filter((item) => item !== query);
    await AsyncStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(updated));
  } catch (error) {
    console.error("Error removing from search history:", error);
  }
}

/**
 * Save filter preferences
 */
export async function saveFilterPreferences(filterId: string, preferences: any): Promise<void> {
  try {
    const allPreferences = await getFilterPreferences();
    const updated = { ...allPreferences, [filterId]: preferences };
    await AsyncStorage.setItem(STORAGE_KEYS.FILTER_PREFERENCES, JSON.stringify(updated));
  } catch (error) {
    console.error("Error saving filter preferences:", error);
  }
}

/**
 * Get filter preferences
 */
export async function getFilterPreferences(): Promise<Record<string, any>> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.FILTER_PREFERENCES);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error("Error getting filter preferences:", error);
    return {};
  }
}

/**
 * Get specific filter preferences
 */
export async function getFilterPreference(filterId: string): Promise<any> {
  try {
    const preferences = await getFilterPreferences();
    return preferences[filterId] || null;
  } catch (error) {
    console.error("Error getting filter preference:", error);
    return null;
  }
}

/**
 * Clear filter preferences
 */
export async function clearFilterPreferences(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.FILTER_PREFERENCES);
  } catch (error) {
    console.error("Error clearing filter preferences:", error);
  }
}

/**
 * Save favorite filter set
 */
export async function saveFavoriteFilters(name: string, filters: Record<string, any>): Promise<void> {
  try {
    const favorites = await getFavoriteFilters();
    const updated = { ...favorites, [name]: filters };
    await AsyncStorage.setItem(STORAGE_KEYS.FAVORITE_FILTERS, JSON.stringify(updated));
  } catch (error) {
    console.error("Error saving favorite filters:", error);
  }
}

/**
 * Get favorite filter sets
 */
export async function getFavoriteFilters(): Promise<Record<string, Record<string, any>>> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITE_FILTERS);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error("Error getting favorite filters:", error);
    return {};
  }
}

/**
 * Delete favorite filter set
 */
export async function deleteFavoriteFilters(name: string): Promise<void> {
  try {
    const favorites = await getFavoriteFilters();
    delete favorites[name];
    await AsyncStorage.setItem(STORAGE_KEYS.FAVORITE_FILTERS, JSON.stringify(favorites));
  } catch (error) {
    console.error("Error deleting favorite filters:", error);
  }
}

/**
 * Save recent searches
 */
export async function saveRecentSearch(query: string, results: number): Promise<void> {
  try {
    const recent = await getRecentSearches();
    const updated = [
      { query, results, timestamp: Date.now() },
      ...recent.filter((item) => item.query !== query),
    ].slice(0, 5);
    await AsyncStorage.setItem(STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(updated));
  } catch (error) {
    console.error("Error saving recent search:", error);
  }
}

/**
 * Get recent searches
 */
export async function getRecentSearches(): Promise<Array<{ query: string; results: number; timestamp: number }>> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error getting recent searches:", error);
    return [];
  }
}

/**
 * Clear all preferences
 */
export async function clearAllPreferences(): Promise<void> {
  try {
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEYS.SEARCH_HISTORY),
      AsyncStorage.removeItem(STORAGE_KEYS.FILTER_PREFERENCES),
      AsyncStorage.removeItem(STORAGE_KEYS.RECENT_SEARCHES),
      AsyncStorage.removeItem(STORAGE_KEYS.FAVORITE_FILTERS),
    ]);
  } catch (error) {
    console.error("Error clearing all preferences:", error);
  }
}
