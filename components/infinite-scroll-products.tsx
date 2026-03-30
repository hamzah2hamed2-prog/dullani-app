import React, { useCallback } from "react";
import { FlatList, View, ActivityIndicator, Text } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { cn } from "@/lib/utils";

interface InfiniteScrollProductsProps {
  data: any[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean | undefined;
  onEndReached: () => void;
  renderItem: (item: any, index: number) => React.ReactElement;
  numColumns?: number;
  columnWrapperClassName?: string;
  contentContainerClassName?: string;
  onRefresh?: () => void;
  refreshing?: boolean;
}

/**
 * Infinite scroll component for products
 * Automatically loads more products as user scrolls to bottom
 */
export function InfiniteScrollProducts({
  data,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  onEndReached,
  renderItem,
  numColumns = 2,
  columnWrapperClassName,
  contentContainerClassName,
  onRefresh,
  refreshing = false,
}: InfiniteScrollProductsProps) {
  const colors = useColors();

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage && !isLoading) {
      onEndReached();
    }
  }, [hasNextPage, isFetchingNextPage, isLoading, onEndReached]);

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;

    return (
      <View className="py-4 items-center">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="text-muted mt-2">جاري التحميل...</Text>
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
        <Text className="text-muted">لا توجد منتجات</Text>
      </View>
    );
  }, [isLoading, colors]);

  return (
    <FlatList
      data={data}
      renderItem={({ item, index }) => renderItem(item, index)}
      keyExtractor={(item, index) => `${item.id}-${index}`}
      numColumns={numColumns}
      columnWrapperStyle={columnWrapperClassName ? { className: columnWrapperClassName } : undefined}
      contentContainerStyle={contentContainerClassName ? { className: contentContainerClassName } : undefined}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmpty}
      onRefresh={onRefresh}
      refreshing={refreshing}
      scrollEventThrottle={16}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
    />
  );
}

export default InfiniteScrollProducts;
