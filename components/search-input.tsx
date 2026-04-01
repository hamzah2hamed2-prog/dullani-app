import React, { useState, useRef } from "react";
import { View, TextInput, TouchableOpacity, Text, FlatList, Animated } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { useDebounce } from "@/hooks/use-debounce";
import { SPACING, BORDER_RADIUS } from "@/constants/design-system";
import * as Haptics from "expo-haptics";

interface SearchInputProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  suggestions?: string[];
  onSuggestionSelect?: (suggestion: string) => void;
  debounceDelay?: number;
  showHistory?: boolean;
  history?: string[];
  onClear?: () => void;
}

/**
 * Search Input Component
 * Provides search with debouncing, suggestions, and history
 */
export function SearchInput({
  onSearch,
  placeholder = "ابحث...",
  suggestions = [],
  onSuggestionSelect,
  debounceDelay = 500,
  showHistory = false,
  history = [],
  onClear,
}: SearchInputProps) {
  const colors = useColors();
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedQuery = useDebounce(query, debounceDelay);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Trigger search when debounced query changes
  React.useEffect(() => {
    if (debouncedQuery) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch]);

  const handleClear = () => {
    setQuery("");
    setShowSuggestions(false);
    onClear?.();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSuggestionPress = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    onSearch(suggestion);
    onSuggestionSelect?.(suggestion);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const displayItems = showHistory && !query ? history : suggestions.filter((s) =>
    s.toLowerCase().includes(query.toLowerCase())
  );

  React.useEffect(() => {
    if (displayItems.length > 0) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
      setShowSuggestions(true);
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      setShowSuggestions(false);
    }
  }, [displayItems, fadeAnim]);

  return (
    <View className="relative">
      {/* Search Input */}
      <View
        className="flex-row items-center px-4 py-3 rounded-lg border border-border"
        style={{ backgroundColor: colors.surface }}
      >
        {/* Search Icon */}
        <Text className="text-lg mr-2">🔍</Text>

        {/* Input */}
        <TextInput
          className="flex-1 text-foreground text-base"
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          value={query}
          onChangeText={setQuery}
          onFocus={() => {
            if (displayItems.length > 0) {
              setShowSuggestions(true);
            }
          }}
          returnKeyType="search"
          returnKeyLabel="بحث"
        />

        {/* Clear Button */}
        {query && (
          <TouchableOpacity onPress={handleClear} className="ml-2">
            <Text className="text-lg text-muted">×</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Suggestions Dropdown */}
      {showSuggestions && displayItems.length > 0 && (
        <Animated.View
          style={{
            opacity: fadeAnim,
            marginTop: SPACING.SM,
          }}
          className="absolute top-full left-0 right-0 bg-surface rounded-lg border border-border z-50"
        >
          <FlatList
            data={displayItems}
            keyExtractor={(item, index) => `${item}-${index}`}
            scrollEnabled={false}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => handleSuggestionPress(item)}
                className={`px-4 py-3 flex-row items-center ${
                  index !== displayItems.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <Text className="text-sm text-muted mr-2">
                  {showHistory && !query ? "🕐" : "🔍"}
                </Text>
                <Text className="text-sm text-foreground flex-1">{item}</Text>
              </TouchableOpacity>
            )}
          />
        </Animated.View>
      )}
    </View>
  );
}

export default SearchInput;
