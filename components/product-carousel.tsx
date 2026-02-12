import { View, Image, ScrollView, Text } from "react-native";
import { useState } from "react";

interface ProductCarouselProps {
  images: string[];
  productName: string;
}

export function ProductCarousel({ images, productName }: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / 300);
    setCurrentIndex(currentIndex);
  };

  // Use provided images or fallback to placeholder
  const displayImages = images && images.length > 0
    ? images
    : ["https://via.placeholder.com/400x400?text=" + productName];

  return (
    <View className="relative">
      {/* Image Carousel */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {displayImages.map((image, index) => (
          <View key={index} className="w-full h-80 bg-muted justify-center items-center">
            <Image
              source={{ uri: image }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
        ))}
      </ScrollView>

      {/* Image Counter */}
      {displayImages.length > 1 && (
        <View className="absolute bottom-3 right-3 bg-black/50 px-3 py-1 rounded-full">
          <Text className="text-white text-xs font-semibold">
            {currentIndex + 1} / {displayImages.length}
          </Text>
        </View>
      )}

      {/* Dot Indicators */}
      {displayImages.length > 1 && (
        <View className="absolute bottom-3 left-0 right-0 flex-row items-center justify-center gap-1">
          {displayImages.map((_, index) => (
            <View
              key={index}
              className={`h-2 rounded-full ${
                index === currentIndex ? "bg-primary w-6" : "bg-white/50 w-2"
              }`}
            />
          ))}
        </View>
      )}
    </View>
  );
}
