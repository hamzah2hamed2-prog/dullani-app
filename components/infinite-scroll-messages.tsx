import React, { useCallback } from "react";
import { FlatList, View, ActivityIndicator, Text } from "react-native";
import { useColors } from "@/hooks/use-colors";

interface InfiniteScrollMessagesProps {
  data: any[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean | undefined;
  onEndReached: () => void;
  renderItem: (item: any, index: number) => React.ReactElement;
  contentContainerClassName?: string;
  onRefresh?: () => void;
  refreshing?: boolean;
}

/**
 * Infinite scroll component for messages
 * Loads older messages as user scrolls up
 */
export function InfiniteScrollMessages({
  data,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  onEndReached,
  renderItem,
  contentContainerClassName,
  onRefresh,
  refreshing = false,
}: InfiniteScrollMessagesProps) {
  const colors = useColors();

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage && !isLoading) {
      onEndReached();
    }
  }, [hasNextPage, isFetchingNextPage, isLoading, onEndReached]);

  const renderHeader = useCallback(() => {
    if (!isFetchingNextPage) return null;

    return (
      <View className="py-4 items-center">
        <ActivityIndicator size="small" color={colors.primary} />
        <Text className="text-muted text-xs mt-1">جاري تحميل الرسائل القديمة...</Text>
      </View>
    );
  }, [isFetchingNextPage, colors]);

  const renderEmpty = useCallback(() => {
    if (isLoading) {
      return (
        <View className="flex-1 items-center justify-center py-8">
          <ActivityIndicator size="large" color={colors.primary} />
          <Text className="text-muted mt-2">جاري التحميل...</Text>
        </View>
      );
    }

    return (
      <View className="flex-1 items-center justify-center py-8">
        <Text className="text-muted">لا توجد رسائل</Text>
      </View>
    );
  }, [isLoading, colors]);

  return (
    <FlatList
      data={data}
      renderItem={({ item, index }) => renderItem(item, index)}
      keyExtractor={(item, index) => `${item.id}-${index}`}
      contentContainerStyle={contentContainerClassName ? { className: contentContainerClassName } : undefined}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.3}
      ListHeaderComponent={renderHeader}
      ListEmptyComponent={renderEmpty}
      onRefresh={onRefresh}
      refreshing={refreshing}
      scrollEventThrottle={16}
      removeClippedSubviews={true}
      maxToRenderPerBatch={20}
      updateCellsBatchingPeriod={50}
      inverted={true}
    />
  );
}

export default InfiniteScrollMessages;
