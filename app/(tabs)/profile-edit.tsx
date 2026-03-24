import { ScrollView, Text, View, TouchableOpacity, TextInput, Alert, StyleSheet, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/hooks/use-auth";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function ProfileEditScreen() {
  const router = useRouter();
  const colors = useColors();
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
    <ScreenContainer edges={["top"]} style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
            <IconSymbol name="xmark" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>تعديل الملف الشخصي</Text>
          <TouchableOpacity 
            onPress={handleSaveChanges} 
            disabled={isLoading}
            style={styles.headerButton}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <IconSymbol name="checkmark" size={24} color={colors.primary} />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Profile Picture Placeholder */}
          <View style={styles.avatarSection}>
            <View style={[styles.avatarContainer, { borderColor: colors.border }]}>
              <Image
                source={{ uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "")}&background=random` }}
                style={styles.avatar}
              />
            </View>
            <TouchableOpacity style={{ marginTop: 12 }}>
              <Text style={{ color: colors.primary, fontWeight: 'bold' }}>تغيير صورة الملف الشخصي</Text>
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View style={styles.form}>
            <View style={[styles.inputGroup, { borderBottomColor: colors.border }]}>
              <Text style={[styles.label, { color: colors.foreground }]}>الاسم</Text>
              <TextInput
                value={displayName}
                onChangeText={setDisplayName}
                style={[styles.input, { color: colors.foreground }]}
                placeholder="أدخل اسمك"
                placeholderTextColor={colors.muted}
              />
            </View>

            <View style={[styles.inputGroup, { borderBottomColor: colors.border }]}>
              <Text style={[styles.label, { color: colors.foreground }]}>اسم المستخدم</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.input, { color: colors.muted }]}>{user?.name?.toLowerCase().replace(/\s+/g, '_')}</Text>
              </View>
            </View>

            <View style={[styles.inputGroup, { borderBottomColor: colors.border }]}>
              <Text style={[styles.label, { color: colors.foreground }]}>النبذة</Text>
              <TextInput
                value={bio}
                onChangeText={setBio}
                style={[styles.input, { color: colors.foreground }]}
                placeholder="أخبرنا عنك..."
                placeholderTextColor={colors.muted}
                multiline
              />
            </View>

            <View style={[styles.inputGroup, { borderBottomColor: colors.border, paddingBottom: 20 }]}>
              <Text style={[styles.label, { color: colors.foreground }]}>البريد الإلكتروني</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.input, { color: colors.muted }]}>{user?.email}</Text>
              </View>
            </View>
          </View>

          {/* Interests Section */}
          <View style={styles.interestsSection}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>اهتماماتك</Text>
            <Text style={[styles.sectionSubtitle, { color: colors.muted }]}>
              اختر الفئات التي تهمك لتلقي توصيات أفضل في صفحة الاستكشاف
            </Text>

            <View style={styles.interestsGrid}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => handleToggleInterest(category.id)}
                  style={[
                    styles.interestChip,
                    {
                      backgroundColor: selectedInterests.includes(category.id) ? colors.primary : colors.surface,
                      borderColor: selectedInterests.includes(category.id) ? colors.primary : colors.border,
                    }
                  ]}
                >
                  <Text
                    style={[
                      styles.interestText,
                      { color: selectedInterests.includes(category.id) ? "white" : colors.foreground }
                    ]}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerButton: {
    padding: 4,
  },
  content: {
    paddingTop: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    padding: 2,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 38,
  },
  form: {
    paddingHorizontal: 16,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 0.5,
  },
  label: {
    width: 100,
    fontSize: 15,
  },
  input: {
    flex: 1,
    fontSize: 15,
    textAlign: 'right',
  },
  interestsSection: {
    padding: 16,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 13,
    marginBottom: 16,
    lineHeight: 18,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  interestChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  interestText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
