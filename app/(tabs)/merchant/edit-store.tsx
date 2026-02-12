import { ScrollView, Text, View, TouchableOpacity, TextInput, Alert } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";

export default function EditStoreScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "متجري",
    address: "الرياض، السعودية",
    phone: "+966501234567",
    openingHours: "9:00 - 22:00",
    description: "متجر متخصص في بيع المنتجات الإلكترونية",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveChanges = async () => {
    if (!formData.name.trim()) {
      Alert.alert("خطأ", "يرجى إدخال اسم المتجر");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Call API to update store
      await new Promise((resolve) => setTimeout(resolve, 1000));

      Alert.alert("نجح", "تم تحديث بيانات المتجر بنجاح");
      router.back();
    } catch (error) {
      console.error("Error updating store:", error);
      Alert.alert("خطأ", "فشل في تحديث البيانات");
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
          <Text className="text-lg font-semibold text-foreground">
            تعديل بيانات المتجر
          </Text>
          <View className="w-6" />
        </View>

        {/* Form Fields */}
        <View className="gap-4 mb-6">
          {/* Store Name */}
          <View>
            <Text className="text-sm font-semibold text-foreground mb-2">
              اسم المتجر *
            </Text>
            <TextInput
              placeholder="أدخل اسم المتجر"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              placeholderTextColor="#687076"
              editable={!isLoading}
            />
          </View>

          {/* Address */}
          <View>
            <Text className="text-sm font-semibold text-foreground mb-2">
              العنوان
            </Text>
            <TextInput
              placeholder="أدخل عنوان المتجر"
              value={formData.address}
              onChangeText={(text) => setFormData({ ...formData, address: text })}
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              placeholderTextColor="#687076"
              editable={!isLoading}
            />
          </View>

          {/* Phone */}
          <View>
            <Text className="text-sm font-semibold text-foreground mb-2">
              رقم الهاتف
            </Text>
            <TextInput
              placeholder="أدخل رقم الهاتف"
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              keyboardType="phone-pad"
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              placeholderTextColor="#687076"
              editable={!isLoading}
            />
          </View>

          {/* Opening Hours */}
          <View>
            <Text className="text-sm font-semibold text-foreground mb-2">
              ساعات العمل
            </Text>
            <TextInput
              placeholder="مثال: 9:00 - 22:00"
              value={formData.openingHours}
              onChangeText={(text) => setFormData({ ...formData, openingHours: text })}
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              placeholderTextColor="#687076"
              editable={!isLoading}
            />
          </View>

          {/* Description */}
          <View>
            <Text className="text-sm font-semibold text-foreground mb-2">
              وصف المتجر
            </Text>
            <TextInput
              placeholder="أضف وصفاً عن متجرك..."
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

        {/* Info Box */}
        <View className="bg-primary/10 border border-primary rounded-lg p-4 mb-6">
          <Text className="text-xs font-semibold text-primary mb-1">💡 نصيحة</Text>
          <Text className="text-xs text-foreground leading-relaxed">
            أضف وصفاً مفصلاً عن متجرك وتأكد من أن رقم الهاتف صحيح ليتمكن العملاء من التواصل معك
          </Text>
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
