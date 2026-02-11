import { ScrollView, Text, View, TouchableOpacity, TextInput, Alert } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/hooks/use-auth";

export default function ProfileEditScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [bio, setBio] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch categories
  const { data: categories = [] } = trpc.categories.list.useQuery();

  // Fetch user interests
  const { data: userInterests = [] } = trpc.userInterests.list.useQuery();

  // Initialize selected interests
  useEffect(() => {
    if (userInterests.length > 0) {
      setSelectedInterests(userInterests.map((interest) => interest.categoryId));
    }
  }, [userInterests]);

  // Mutations
  const addInterestMutation = trpc.userInterests.add.useMutation();
  const removeInterestMutation = trpc.userInterests.remove.useMutation();
  const updateProfileMutation = trpc.userProfile.updateProfile.useMutation();

  const handleToggleInterest = async (categoryId: number) => {
    const isSelected = selectedInterests.includes(categoryId);

    try {
      if (isSelected) {
        await removeInterestMutation.mutateAsync({ categoryId });
        setSelectedInterests((prev) => prev.filter((id) => id !== categoryId));
      } else {
        await addInterestMutation.mutateAsync({ categoryId });
        setSelectedInterests((prev) => [...prev, categoryId]);
      }
    } catch (error) {
      console.error("Error updating interest:", error);
      Alert.alert("خطأ", "فشل في تحديث الاهتمام");
    }
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      await updateProfileMutation.mutateAsync({
        name: displayName,
        bio: bio,
      });
      Alert.alert("نجح", "تم حفظ التغييرات بنجاح");
      router.back();
    } catch (error) {
      console.error("Error saving changes:", error);
      Alert.alert("خطأ", "فشل في حفظ التغييرات");
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
            تعديل الملف الشخصي
          </Text>
          <View className="w-6" />
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

        {/* Email (Read-only) */}
        <View className="mb-6 gap-2">
          <Text className="text-sm font-semibold text-foreground">
            البريد الإلكتروني
          </Text>
          <View className="bg-surface border border-border rounded-lg px-4 py-3">
            <Text className="text-foreground">{email}</Text>
          </View>
          <Text className="text-xs text-muted">لا يمكن تغيير البريد الإلكتروني</Text>
        </View>

        {/* Bio */}
        <View className="mb-6 gap-2">
          <Text className="text-sm font-semibold text-foreground">
            نبذة عنك
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

        {/* Interests */}
        <View className="mb-8 gap-3">
          <Text className="text-sm font-semibold text-foreground">
            اهتماماتك
          </Text>
          <Text className="text-xs text-muted">
            اختر الفئات التي تهمك لتلقي توصيات أفضل
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

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSaveChanges}
          disabled={isLoading}
          className={`px-4 py-3 rounded-lg mb-3 ${
            isLoading ? "bg-muted" : "bg-primary"
          }`}
        >
          <Text className="text-white font-semibold text-center">
            {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
          </Text>
        </TouchableOpacity>

        {/* Cancel Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          disabled={isLoading}
          className="px-4 py-3 rounded-lg border border-border"
        >
          <Text className="text-foreground font-semibold text-center">
            إلغاء
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
}
