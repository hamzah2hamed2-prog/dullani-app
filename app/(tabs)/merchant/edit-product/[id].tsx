import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, Text, View, TouchableOpacity, TextInput, Alert } from "react-native";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";

export default function EditProductScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch product data
  const { data: product, isLoading: isProductLoading } = trpc.products.getById.useQuery(
    { id: parseInt(id as string) },
    { enabled: !!id }
  );

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || "",
        price: product.price,
        category: product.category || "",
      });
    }
  }, [product]);

  const handleSaveChanges = async () => {
    if (!formData.name.trim()) {
      Alert.alert("خطأ", "يرجى إدخال اسم المنتج");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Call API to update product
      await new Promise((resolve) => setTimeout(resolve, 1000));

      Alert.alert("نجح", "تم تحديث المنتج بنجاح");
      router.back();
    } catch (error) {
      console.error("Error updating product:", error);
      Alert.alert("خطأ", "فشل في تحديث المنتج");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = () => {
    Alert.alert(
      "تأكيد الحذف",
      "هل أنت متأكد من حذف هذا المنتج؟",
      [
        { text: "إلغاء", onPress: () => {} },
        {
          text: "حذف",
          onPress: async () => {
            try {
              // TODO: Call API to delete product
              Alert.alert("نجح", "تم حذف المنتج بنجاح");
              router.back();
            } catch (error) {
              Alert.alert("خطأ", "فشل في حذف المنتج");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  if (isProductLoading) {
    return (
      <ScreenContainer>
        <Text className="text-center text-muted">جاري التحميل...</Text>
      </ScreenContainer>
    );
  }

  if (!product) {
    return (
      <ScreenContainer>
        <Text className="text-center text-muted">المنتج غير موجود</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-4">
      <ScrollView>
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6 pb-4 border-b border-border">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-xl">←</Text>
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-foreground">تعديل المنتج</Text>
          <View className="w-6" />
        </View>

        {/* Form Fields */}
        <View className="gap-4 mb-6">
          {/* Product Name */}
          <View>
            <Text className="text-sm font-semibold text-foreground mb-2">
              اسم المنتج *
            </Text>
            <TextInput
              placeholder="أدخل اسم المنتج"
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
              placeholder="أدخل السعر"
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
              placeholder="أدخل الفئة"
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
              placeholder="أدخل وصف المنتج"
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
            onPress={handleSaveChanges}
            disabled={isLoading}
            className={`px-4 py-3 rounded-lg ${
              isLoading ? "bg-muted" : "bg-primary"
            }`}
          >
            <Text className="text-white font-semibold text-center">
              {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDeleteProduct}
            disabled={isLoading}
            className="bg-error/10 border border-error px-4 py-3 rounded-lg"
          >
            <Text className="text-error font-semibold text-center">حذف المنتج</Text>
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
