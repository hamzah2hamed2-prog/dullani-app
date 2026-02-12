import { ScrollView, Text, View, TouchableOpacity, Image, Alert } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import * as ImagePicker from "expo-image-picker";

export default function ImageSearchScreen() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handlePickImage = async (source: "camera" | "gallery") => {
    try {
      let result;

      if (source === "camera") {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
          Alert.alert("خطأ", "يرجى السماح بالوصول إلى الكاميرا");
          return;
        }

        result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      } else {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
          Alert.alert("خطأ", "يرجى السماح بالوصول إلى المعرض");
          return;
        }

        result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      }

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("خطأ", "فشل في اختيار الصورة");
    }
  };

  const handleSearch = async () => {
    if (!selectedImage) {
      Alert.alert("خطأ", "يرجى اختيار صورة أولاً");
      return;
    }

    setIsSearching(true);
    try {
      // In a real app, you would send the image to an AI service for recognition
      // For now, we'll simulate the search
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Navigate to search results
      router.push({
        pathname: "/(tabs)/search",
        params: { query: "منتجات مشابهة" },
      });
    } catch (error) {
      console.error("Error searching:", error);
      Alert.alert("خطأ", "فشل في البحث");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6 pb-4 border-b border-border">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-xl">←</Text>
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-foreground">
            البحث بالصور
          </Text>
          <View className="w-6" />
        </View>

        {/* Description */}
        <View className="mb-8">
          <Text className="text-sm text-muted leading-relaxed">
            التقط صورة أو اختر صورة من معرضك للبحث عن منتجات مشابهة
          </Text>
        </View>

        {/* Image Preview */}
        {selectedImage ? (
          <View className="mb-8 gap-4">
            <View className="w-full h-80 bg-muted rounded-lg overflow-hidden border-2 border-primary">
              <Image
                source={{ uri: selectedImage }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>

            <TouchableOpacity
              onPress={() => setSelectedImage(null)}
              className="bg-surface border border-border px-4 py-2 rounded-lg"
            >
              <Text className="text-foreground font-semibold text-center">
                اختر صورة أخرى
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="mb-8 gap-3 flex-1 justify-center">
            {/* Camera Button */}
            <TouchableOpacity
              onPress={() => handlePickImage("camera")}
              className="bg-primary px-4 py-6 rounded-lg flex-row items-center justify-center gap-3"
            >
              <Text className="text-2xl">📷</Text>
              <View className="flex-1">
                <Text className="text-white font-semibold">التقط صورة</Text>
                <Text className="text-white/70 text-xs">استخدم الكاميرا</Text>
              </View>
            </TouchableOpacity>

            {/* Gallery Button */}
            <TouchableOpacity
              onPress={() => handlePickImage("gallery")}
              className="bg-surface border border-border px-4 py-6 rounded-lg flex-row items-center justify-center gap-3"
            >
              <Text className="text-2xl">🖼️</Text>
              <View className="flex-1">
                <Text className="text-foreground font-semibold">من المعرض</Text>
                <Text className="text-muted text-xs">اختر من صورك</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Search Button */}
        {selectedImage && (
          <TouchableOpacity
            onPress={handleSearch}
            disabled={isSearching}
            className={`px-4 py-3 rounded-lg ${
              isSearching ? "bg-muted" : "bg-primary"
            }`}
          >
            <Text className="text-white font-semibold text-center">
              {isSearching ? "جاري البحث..." : "البحث عن منتجات مشابهة"}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
