import { ScrollView, Text, View, TouchableOpacity, TextInput } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/hooks/use-auth";

export default function ProfileSetupScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user?.name || "");
  const [bio, setBio] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch categories for interests
  const { data: categories = [] } = trpc.categories.list.useQuery();

  // Add user interests mutation
  const addInterestMutation = trpc.userInterests.add.useMutation();

  const handleToggleInterest = (categoryId: number) => {
    setSelectedInterests((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleCompleteSetup = async () => {
    setIsLoading(true);
    try {
      // Add selected interests
      for (const categoryId of selectedInterests) {
        await addInterestMutation.mutateAsync({ categoryId });
      }

      // Navigate to home
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Error completing setup:", error);
      alert("حدث خطأ أثناء إكمال الإعداد");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-foreground mb-2">
            مرحباً! 👋
          </Text>
          <Text className="text-sm text-muted">
            دعنا نكمل إعداد ملفك الشخصي
          </Text>
        </View>

        {/* Display Name */}
        <View className="mb-6 gap-2">
          <Text className="text-sm font-semibold text-foreground">
            اسم العرض
          </Text>
          <TextInput
            placeholder="أدخل اسمك"
            value={displayName}
            onChangeText={setDisplayName}
            className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
            placeholderTextColor="#687076"
          />
        </View>

        {/* Bio */}
        <View className="mb-6 gap-2">
          <Text className="text-sm font-semibold text-foreground">
            نبذة عنك (اختياري)
          </Text>
          <TextInput
            placeholder="أخبرنا عن اهتماماتك..."
            value={bio}
            onChangeText={setBio}
            className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
            placeholderTextColor="#687076"
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Interests Selection */}
        <View className="mb-8 gap-3">
          <Text className="text-sm font-semibold text-foreground">
            اختر اهتماماتك
          </Text>
          <Text className="text-xs text-muted">
            سيساعدنا هذا في إظهار المنتجات المناسبة لك
          </Text>

          <View className="flex-row flex-wrap gap-2">
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => handleToggleInterest(category.id)}
                className={`px-4 py-2 rounded-full border ${
                  selectedInterests.includes(category.id)
                    ? "bg-primary border-primary"
                    : "bg-surface border-border"
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    selectedInterests.includes(category.id)
                      ? "text-white"
                      : "text-foreground"
                  }`}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Complete Button */}
        <View className="gap-3 mt-auto">
          <TouchableOpacity
            onPress={handleCompleteSetup}
            disabled={isLoading}
            className={`px-4 py-3 rounded-lg ${
              isLoading ? "bg-muted" : "bg-primary"
            }`}
          >
            <Text className="text-white font-semibold text-center">
              {isLoading ? "جاري الإعداد..." : "إكمال الإعداد"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.replace("/(tabs)")}
            disabled={isLoading}
          >
            <Text className="text-primary text-center text-sm font-semibold">
              تخطي هذه الخطوة
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
