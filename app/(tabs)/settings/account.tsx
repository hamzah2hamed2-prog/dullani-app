import { ScrollView, View, Text, TouchableOpacity, Switch, TextInput, Image, StyleSheet, Alert } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function AccountSettingsScreen() {
  const router = useRouter();
  const colors = useColors();
  const [profileData, setProfileData] = useState({
    name: "أحمد محمد",
    email: "ahmed@example.com",
    phone: "+966501234567",
    bio: "محب للتسوق والموضة",
  });

  const [notifications, setNotifications] = useState({
    pushNotifications: true,
    emailNotifications: true,
    messageNotifications: true,
    offerNotifications: true,
  });

  const [privacy, setPrivacy] = useState({
    privateAccount: false,
    showOnlineStatus: true,
    allowMessages: true,
    allowFollowing: true,
  });

  const handleSaveProfile = () => {
    Alert.alert("تم", "تم حفظ بيانات الملف الشخصي بنجاح");
  };

  const handleChangePassword = () => {
    router.push("/(tabs)/settings/change-password");
  };

  const handleLogout = () => {
    Alert.alert(
      "تسجيل الخروج",
      "هل أنت متأكد من رغبتك في تسجيل الخروج؟",
      [
        { text: "إلغاء", onPress: () => {} },
        { text: "تسجيل الخروج", onPress: () => router.push("/(auth)/login") },
      ]
    );
  };

  return (
    <ScreenContainer style={{ padding: 0 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
            <IconSymbol name="chevron.left" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>إعدادات الحساب</Text>
          <View style={{ width: 32 }} />
        </View>

        {/* Profile Section */}
        <View style={[styles.section, { backgroundColor: colors.background }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>بيانات الملف الشخصي</Text>
          
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.profileImageContainer}>
              <Image
                source={{ uri: "https://via.placeholder.com/100" }}
                style={styles.profileImage}
              />
              <TouchableOpacity style={[styles.editImageButton, { backgroundColor: colors.primary }]}>
                <Text style={{ color: colors.background }}>✏️</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.muted }]}>الاسم</Text>
              <TextInput
                style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
                value={profileData.name}
                onChangeText={(text) => setProfileData({ ...profileData, name: text })}
                placeholder="أدخل اسمك"
                placeholderTextColor={colors.muted}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.muted }]}>البريد الإلكتروني</Text>
              <TextInput
                style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
                value={profileData.email}
                onChangeText={(text) => setProfileData({ ...profileData, email: text })}
                placeholder="أدخل بريدك الإلكتروني"
                placeholderTextColor={colors.muted}
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.muted }]}>رقم الهاتف</Text>
              <TextInput
                style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
                value={profileData.phone}
                onChangeText={(text) => setProfileData({ ...profileData, phone: text })}
                placeholder="أدخل رقم هاتفك"
                placeholderTextColor={colors.muted}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.muted }]}>السيرة الذاتية</Text>
              <TextInput
                style={[styles.input, { color: colors.foreground, borderColor: colors.border, minHeight: 80 }]}
                value={profileData.bio}
                onChangeText={(text) => setProfileData({ ...profileData, bio: text })}
                placeholder="أخبرنا عن نفسك"
                placeholderTextColor={colors.muted}
                multiline
                maxLength={150}
              />
              <Text style={[styles.charCount, { color: colors.muted }]}>
                {profileData.bio.length}/150
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={handleSaveProfile}
            >
              <Text style={[styles.buttonText, { color: colors.background }]}>حفظ التغييرات</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Notifications Section */}
        <View style={[styles.section, { backgroundColor: colors.background }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>الإشعارات</Text>
          
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
              <View>
                <Text style={[styles.settingLabel, { color: colors.foreground }]}>إشعارات الدفع</Text>
                <Text style={[styles.settingDescription, { color: colors.muted }]}>
                  تلقي إشعارات على جهازك
                </Text>
              </View>
              <Switch
                value={notifications.pushNotifications}
                onValueChange={(value) =>
                  setNotifications({ ...notifications, pushNotifications: value })
                }
              />
            </View>

            <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
              <View>
                <Text style={[styles.settingLabel, { color: colors.foreground }]}>إشعارات البريد الإلكتروني</Text>
                <Text style={[styles.settingDescription, { color: colors.muted }]}>
                  تلقي رسائل بريد إلكترونية
                </Text>
              </View>
              <Switch
                value={notifications.emailNotifications}
                onValueChange={(value) =>
                  setNotifications({ ...notifications, emailNotifications: value })
                }
              />
            </View>

            <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
              <View>
                <Text style={[styles.settingLabel, { color: colors.foreground }]}>إشعارات الرسائل</Text>
                <Text style={[styles.settingDescription, { color: colors.muted }]}>
                  إشعار عند استقبال رسالة جديدة
                </Text>
              </View>
              <Switch
                value={notifications.messageNotifications}
                onValueChange={(value) =>
                  setNotifications({ ...notifications, messageNotifications: value })
                }
              />
            </View>

            <View style={styles.settingRow}>
              <View>
                <Text style={[styles.settingLabel, { color: colors.foreground }]}>إشعارات العروض</Text>
                <Text style={[styles.settingDescription, { color: colors.muted }]}>
                  إشعار عند وجود عروض جديدة
                </Text>
              </View>
              <Switch
                value={notifications.offerNotifications}
                onValueChange={(value) =>
                  setNotifications({ ...notifications, offerNotifications: value })
                }
              />
            </View>
          </View>
        </View>

        {/* Privacy Section */}
        <View style={[styles.section, { backgroundColor: colors.background }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>الخصوصية</Text>
          
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
              <View>
                <Text style={[styles.settingLabel, { color: colors.foreground }]}>حساب خاص</Text>
                <Text style={[styles.settingDescription, { color: colors.muted }]}>
                  يتطلب الموافقة على المتابعة
                </Text>
              </View>
              <Switch
                value={privacy.privateAccount}
                onValueChange={(value) =>
                  setPrivacy({ ...privacy, privateAccount: value })
                }
              />
            </View>

            <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
              <View>
                <Text style={[styles.settingLabel, { color: colors.foreground }]}>عرض حالة الاتصال</Text>
                <Text style={[styles.settingDescription, { color: colors.muted }]}>
                  السماح للآخرين برؤية متى تكون نشطاً
                </Text>
              </View>
              <Switch
                value={privacy.showOnlineStatus}
                onValueChange={(value) =>
                  setPrivacy({ ...privacy, showOnlineStatus: value })
                }
              />
            </View>

            <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
              <View>
                <Text style={[styles.settingLabel, { color: colors.foreground }]}>السماح بالرسائل</Text>
                <Text style={[styles.settingDescription, { color: colors.muted }]}>
                  السماح للآخرين بإرسال رسائل إليك
                </Text>
              </View>
              <Switch
                value={privacy.allowMessages}
                onValueChange={(value) =>
                  setPrivacy({ ...privacy, allowMessages: value })
                }
              />
            </View>

            <View style={styles.settingRow}>
              <View>
                <Text style={[styles.settingLabel, { color: colors.foreground }]}>السماح بالمتابعة</Text>
                <Text style={[styles.settingDescription, { color: colors.muted }]}>
                  السماح للآخرين بمتابعتك
                </Text>
              </View>
              <Switch
                value={privacy.allowFollowing}
                onValueChange={(value) =>
                  setPrivacy({ ...privacy, allowFollowing: value })
                }
              />
            </View>
          </View>
        </View>

        {/* Security Section */}
        <View style={[styles.section, { backgroundColor: colors.background }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>الأمان</Text>
          
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <TouchableOpacity
              style={[styles.actionRow, { borderBottomColor: colors.border }]}
              onPress={handleChangePassword}
            >
              <View>
                <Text style={[styles.actionLabel, { color: colors.foreground }]}>تغيير كلمة المرور</Text>
                <Text style={[styles.actionDescription, { color: colors.muted }]}>
                  تحديث كلمة مرورك بشكل دوري
                </Text>
              </View>
              <Text style={{ color: colors.muted }}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionRow}>
              <View>
                <Text style={[styles.actionLabel, { color: colors.foreground }]}>جلسات نشطة</Text>
                <Text style={[styles.actionDescription, { color: colors.muted }]}>
                  إدارة الأجهزة المتصلة
                </Text>
              </View>
              <Text style={{ color: colors.muted }}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Section */}
        <View style={[styles.section, { backgroundColor: colors.background }]}>
          <TouchableOpacity
            style={[styles.dangerButton, { backgroundColor: colors.error }]}
            onPress={handleLogout}
          >
            <Text style={[styles.dangerButtonText, { color: "white" }]}>تسجيل الخروج</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
  card: {
    borderRadius: 8,
    borderWidth: 0.5,
    overflow: "hidden",
  },
  profileImageContainer: {
    alignItems: "center",
    paddingVertical: 16,
    position: "relative",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  editImageButton: {
    position: "absolute",
    bottom: 8,
    right: 80,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  inputGroup: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    marginBottom: 6,
  },
  input: {
    borderWidth: 0.5,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
  },
  charCount: {
    fontSize: 11,
    marginTop: 4,
    textAlign: "right",
  },
  button: {
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 13,
    fontWeight: "600",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  settingLabel: {
    fontSize: 13,
    fontWeight: "600",
  },
  settingDescription: {
    fontSize: 11,
    marginTop: 2,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: "600",
  },
  actionDescription: {
    fontSize: 11,
    marginTop: 2,
  },
  dangerButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  dangerButtonText: {
    fontSize: 13,
    fontWeight: "600",
  },
});
