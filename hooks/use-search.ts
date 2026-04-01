import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import {
  getSearchHistory,
  saveSearchHistory,
  removeFromSearchHistory,
  getRecentSearches,
  saveRecentSearch,
} from "@/lib/preferences";

interface UseSearchOptions {
  debounceDelay?: number;
  onSearch?: (query: string) => void;
  saveHistory?: boolean;
}

/**
 * Hook for managing search functionality
 * Handles search state, history, and debouncing
 */
export function useSearch(options: UseSearchOptions = {}) {
  const { debounceDelay = 500, onSearch, saveHistory = true } = options;

  const [query, setQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<
    Array<{ query: string; results: number; timestamp: number }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedQuery = useDebounce(query, debounceDelay);

  // Load search history on mount
  useEffect(() => {
    loadSearchHistory();
    loadRecentSearches();
  }, []);

  // Trigger search when debounced query changes
  useEffect(() => {
    if (debouncedQuery) {
      setIsLoading(true);
      onSearch?.(debouncedQuery);

      // Save to history if enabled
      if (saveHistory) {
        saveSearchHistory(debouncedQuery);
        loadSearchHistory();
      }
    }
  }, [debouncedQuery, onSearch, saveHistory]);

  const loadSearchHistory = useCallback(async () => {
    try {
      const history = await getSearchHistory();
      setSearchHistory(history);
    } catch (error) {
      console.error("Error loading search history:", error);
    }
  }, []);

  const loadRecentSearches = useCallback(async () => {
    try {
      const recent = await getRecentSearches();
      setRecentSearches(recent);
    } catch (error) {
      console.error("Error loading recent searches:", error);
    }
  }, []);

  const handleSearch = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
  }, []);

  const handleClear = useCallback(() => {
    setQuery("");
  }, []);

  const handleRemoveFromHistory = useCallback(async (item: string) => {
    try {
      await removeFromSearchHistory(item);
      await loadSearchHistory();
    } catch (error) {
      console.error("Error removing from history:", error);
    }
  }, [loadSearchHistory]);

  const handleSearchComplete = useCallback(
    async (resultsCount: number) => {
      if (query) {
        try {
          await saveRecentSearch(query, resultsCount);
          await loadRecentSearches();
        } catch (error) {
          console.error("Error saving recent search:", error);
        }
      }
      setIsLoading(false);
    },
    [query, loadRecentSearches]
  );

  return {
    query,
    debouncedQuery,
    searchHistory,
    recentSearches,
    isLoading,
    handleSearch,
    handleClear,
    handleRemoveFromHistory,
    handleSearchComplete,
    loadSearchHistory,
    loadRecentSearches,
  };
}

export default useSearch;
