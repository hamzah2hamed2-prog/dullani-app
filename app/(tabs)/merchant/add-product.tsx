import { ScrollView, Text, View, TouchableOpacity, TextInput, Alert } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";
import * as ImagePicker from "expo-image-picker";

export default function AddProductScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const createProductMutation = trpc.products.create.useMutation();

  const handlePickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("خطأ", "يرجى السماح بالوصول إلى المعرض");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setFormData({ ...formData, image: result.assets[0].uri });
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("خطأ", "فشل في اختيار الصورة");
    }
  };

  const handleAddProduct = async () => {
    if (!formData.name.trim()) {
      Alert.alert("خطأ", "يرجى إدخال اسم المنتج");
      return;
    }

    if (!formData.price.trim()) {
      Alert.alert("خطأ", "يرجى إدخال السعر");
      return;
    }

    setIsLoading(true);
    try {
      await createProductMutation.mutateAsync({
        storeId: 1, // TODO: Use actual store ID
        name: formData.name,
        description: formData.description || undefined,
        price: formData.price,
        category: formData.category || undefined,
        image: formData.image || undefined,
      });

      Alert.alert("نجح", "تم إضافة المنتج بنجاح");
      router.back();
    } catch (error) {
      console.error("Error adding product:", error);
      Alert.alert("خطأ", "فشل في إضافة المنتج");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView>
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6 pb-4 border-b border-border">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-xl">←</Text>
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-foreground">إضافة منتج جديد</Text>
          <View className="w-6" />
        </View>

        {/* Image Picker */}
        <TouchableOpacity
          onPress={handlePickImage}
          className="w-full h-40 bg-muted rounded-lg border-2 border-dashed border-border items-center justify-center mb-6"
        >
          <View className="items-center gap-2">
            <Text className="text-3xl">📸</Text>
            <Text className="text-sm text-muted">اضغط لاختيار صورة</Text>
          </View>
        </TouchableOpacity>

        {/* Form Fields */}
        <View className="gap-4 mb-6">
          {/* Product Name */}
          <View>
            <Text className="text-sm font-semibold text-foreground mb-2">
              اسم المنتج *
            </Text>
            <TextInput
              placeholder="مثال: حذاء رياضي أزرق"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              placeholderTextColor="#687076"
              editable={!isLoading}
            />
          </View>

          {/* Price */}
          <View>
            <Text className="text-sm font-semibold text-foreground mb-2">
              السعر (ر.س) *
            </Text>
            <TextInput
              placeholder="مثال: 299"
              value={formData.price}
              onChangeText={(text) => setFormData({ ...formData, price: text })}
              keyboardType="decimal-pad"
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              placeholderTextColor="#687076"
              editable={!isLoading}
            />
          </View>

          {/* Category */}
          <View>
            <Text className="text-sm font-semibold text-foreground mb-2">
              الفئة
            </Text>
            <TextInput
              placeholder="مثال: ملابس وأحذية"
              value={formData.category}
              onChangeText={(text) => setFormData({ ...formData, category: text })}
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              placeholderTextColor="#687076"
              editable={!isLoading}
            />
          </View>

          {/* Description */}
          <View>
            <Text className="text-sm font-semibold text-foreground mb-2">
              الوصف
            </Text>
            <TextInput
              placeholder="أضف وصفاً مفصلاً للمنتج..."
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              multiline
              numberOfLines={4}
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              placeholderTextColor="#687076"
              editable={!isLoading}
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View className="gap-2">
          <TouchableOpacity
            onPress={handleAddProduct}
            disabled={isLoading}
            className={`px-4 py-3 rounded-lg ${
              isLoading ? "bg-muted" : "bg-primary"
            }`}
          >
            <Text className="text-white font-semibold text-center">
              {isLoading ? "جاري الإضافة..." : "إضافة المنتج"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.back()}
            disabled={isLoading}
            className="bg-surface border border-border px-4 py-3 rounded-lg"
          >
            <Text className="text-foreground font-semibold text-center">إلغاء</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
