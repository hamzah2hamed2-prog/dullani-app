import { ScrollView, Text, View, TouchableOpacity, Image, StyleSheet, Dimensions, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/use-auth";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { trpc } from "@/lib/trpc";
import { useProfile, useUserStats, useUpdateProfile } from "@/hooks/use-profile";

const { width } = Dimensions.get("window");
const COLUMN_WIDTH = width / 3;

export default function ProfileScreen() {
  const router = useRouter();
  const colors = useColors();
  const { user, isAuthenticated, loading, logout } = useAuth();

  // Fetch user profile data
  const { data: profile } = useProfile();
  const { data: stats } = useUserStats(user?.id || "");
  const updateProfileMutation = useUpdateProfile();

  // Fetch user's store if they are a merchant
  const { data: store } = trpc.stores.getByUserId.useQuery(undefined, {
    enabled: isAuthenticated && user?.accountType === "merchant",
  });

  // Fetch products for the store or wishlist for regular user
  const { data: products = [] } = trpc.products.list.useQuery({ limit: 12, offset: 0 });

  if (loading) {
    return (
      <ScreenContainer>
        <View style={styles.centered}>
          <Text style={{ color: colors.muted }}>جاري التحميل...</Text>
        </View>
      </ScreenContainer>
    );
  }

  if (!isAuthenticated) {
    return (
      <ScreenContainer edges={["top"]} style={styles.container}>
        <View style={styles.centered}>
          <IconSymbol name="person.fill" size={80} color={colors.muted} />
          <Text style={[styles.loginTitle, { color: colors.foreground }]}>يرجى تسجيل الدخول</Text>
          <Text style={[styles.loginSubtitle, { color: colors.muted }]}>
            قم بتسجيل الدخول للوصول إلى ملفك الشخصي وقائمة الرغبات والمزيد
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/login")}
            style={[styles.loginButton, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.loginButtonText}>تسجيل الدخول / إنشاء حساب</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  const renderProfileHeader = () => (
    <View style={styles.profileHeader}>
      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={[styles.avatarContainer, { borderColor: colors.border }]}>
          <Image
            source={{ uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "")}&background=random` }}
            style={styles.avatar}
          />
          <View style={[styles.addStoryIcon, { backgroundColor: colors.primary, borderColor: colors.background }]}>
            <Text style={styles.addStoryText}>+</Text>
          </View>
        </View>
        
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.foreground }]}>{products.length}</Text>
            <Text style={[styles.statLabel, { color: colors.foreground }]}>منشورات</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.foreground }]}>1.2K</Text>
            <Text style={[styles.statLabel, { color: colors.foreground }]}>متابعون</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.foreground }]}>340</Text>
            <Text style={[styles.statLabel, { color: colors.foreground }]}>يتابع</Text>
          </View>
        </View>
      </View>

      {/* Bio */}
      <View style={styles.bioContainer}>
        <Text style={[styles.bioName, { color: colors.foreground }]}>{user?.name}</Text>
        <Text style={[styles.bioCategory, { color: colors.muted }]}>
          {user?.accountType === "merchant" ? "متجر محلي" : "مستكشف منتجات"}
        </Text>
        <Text style={[styles.bioText, { color: colors.foreground }]}>
          {store?.description || "مرحباً بك في ملفي الشخصي على تطبيق دلني! اكتشف أفضل المنتجات المحلية هنا."}
        </Text>
        {store?.address && (
          <Text style={[styles.bioLink, { color: colors.primary }]}>📍 {store.address}</Text>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={() => router.push("/(tabs)/profile-edit")}
        >
          <Text style={[styles.actionButtonText, { color: colors.foreground }]}>تعديل الملف الشخصي</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.actionButtonText, { color: colors.foreground }]}>مشاركة الملف</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <IconSymbol name="person.fill" size={18} color={colors.foreground} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={[styles.tabs, { borderTopColor: colors.border }]}>
        <TouchableOpacity style={[styles.tab, { borderBottomColor: colors.foreground, borderBottomWidth: 1 }]}>
          <IconSymbol name="house.fill" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <IconSymbol name="tag.fill" size={24} color={colors.muted} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={logout}>
          <IconSymbol name="xmark" size={24} color={colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScreenContainer edges={["top"]} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <IconSymbol name="gear" size={24} color={colors.foreground} />
        </View>
        <Text style={[styles.username, { color: colors.foreground }]}>{user?.name || "الملف الشخصي"}</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon}>
            <IconSymbol name="plus.circle.fill" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <IconSymbol name="filter" size={24} color={colors.foreground} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        ListHeaderComponent={renderProfileHeader}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.gridItem}
            onPress={() => router.push(`/(tabs)/product/${item.id}`)}
          >
            <Image source={{ uri: item.image || "https://via.placeholder.com/150" }} style={styles.gridImage} />
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerLeft: {
    width: 80,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    width: 80,
    justifyContent: 'flex-end',
  },
  headerIcon: {
    padding: 2,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileHeader: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  avatarContainer: {
    position: 'relative',
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 1,
    padding: 3,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  addStoryIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addStoryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: -2,
  },
  stats: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
    paddingLeft: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
  },
  bioContainer: {
    marginBottom: 15,
  },
  bioName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  bioCategory: {
    fontSize: 13,
    marginBottom: 4,
  },
  bioText: {
    fontSize: 13,
    lineHeight: 18,
  },
  bioLink: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabs: {
    flexDirection: 'row',
    borderTopWidth: 0.5,
  },
  tab: {
    flex: 1,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridItem: {
    width: COLUMN_WIDTH,
    height: COLUMN_WIDTH,
    padding: 1,
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  loginTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  loginSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
  },
  loginButton: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
  },
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

