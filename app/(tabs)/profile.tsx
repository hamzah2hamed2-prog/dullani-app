import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/use-auth";
import { ScreenContainer } from "@/components/screen-container";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isAuthenticated, loading, logout } = useAuth();

  if (loading) {
    return (
      <ScreenContainer>
        <Text className="text-center text-muted">جاري التحميل...</Text>
      </ScreenContainer>
    );
  }

  if (!isAuthenticated) {
    return (
      <ScreenContainer className="p-4">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 items-center justify-center gap-4">
            <Text className="text-4xl mb-4">👤</Text>
            <Text className="text-lg font-semibold text-foreground text-center">
              يرجى تسجيل الدخول
            </Text>
            <Text className="text-sm text-muted text-center mb-4">
              قم بتسجيل الدخول للوصول إلى ملفك الشخصي وقائمة الرغبات والمزيد
            </Text>

            <TouchableOpacity
              onPress={() => router.push("/search")}
              className="bg-primary px-6 py-3 rounded-lg w-full"
            >
              <Text className="text-white font-semibold text-center">
                تسجيل الدخول
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/search")}
              className="bg-surface border border-border px-6 py-3 rounded-lg w-full"
            >
              <Text className="text-foreground font-semibold text-center">
                إنشاء حساب جديد
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-4">
      <ScrollView>
        {/* Profile Header */}
        <View className="items-center gap-4 mb-6 pb-6 border-b border-border">
          <View className="w-20 h-20 bg-primary rounded-full items-center justify-center">
            <Text className="text-4xl">👤</Text>
          </View>

          <View className="items-center gap-1">
            <Text className="text-2xl font-bold text-foreground">
              {user?.name || "مستخدم"}
            </Text>
            <Text className="text-sm text-muted">{user?.email}</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View className="gap-3 mb-6">
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/merchant/dashboard" as any)}
            className="bg-primary/10 border border-primary rounded-lg px-4 py-3 flex-row items-center justify-between"
          >
            <Text className="text-primary font-semibold">💼 لوحة تحكم التاجر</Text>
            <Text className="text-primary">›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(tabs)/profile-edit" as any)}
            className="bg-surface border border-border rounded-lg px-4 py-3 flex-row items-center justify-between"
          >
            <Text className="text-foreground font-semibold">تعديل الملف الشخصي</Text>
            <Text className="text-muted">›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(tabs)/profile-edit" as any)}
            className="bg-surface border border-border rounded-lg px-4 py-3 flex-row items-center justify-between"
          >
            <Text className="text-foreground font-semibold">الاهتمامات</Text>
            <Text className="text-muted">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-surface border border-border rounded-lg px-4 py-3 flex-row items-center justify-between">
            <Text className="text-foreground font-semibold">الإعدادات</Text>
            <Text className="text-muted">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-surface border border-border rounded-lg px-4 py-3 flex-row items-center justify-between">
            <Text className="text-foreground font-semibold">حول التطبيق</Text>
            <Text className="text-muted">›</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={logout}
          className="bg-error px-4 py-3 rounded-lg"
        >
          <Text className="text-white font-semibold text-center">
            تسجيل الخروج
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
}
