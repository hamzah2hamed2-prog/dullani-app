/**
 * Share Modal Component
 * Modal for sharing products with preview and options
 */

import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Image,
  Platform,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/use-colors";
import { ShareButton, type ShareData } from "./share-button";

interface ShareModalProps {
  visible: boolean;
  onClose: () => void;
  data: ShareData;
  onShare?: (platform: string) => void;
}

export function ShareModal({
  visible,
  onClose,
  data,
  onShare,
}: ShareModalProps) {
  const colors = useColors();
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  const handleShare = (platform: string) => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setSelectedPlatform(platform);
    onShare?.(platform);

    // Close modal after a short delay
    setTimeout(() => {
      onClose();
      setSelectedPlatform(null);
    }, 500);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.container,
            { backgroundColor: colors.background, borderTopColor: colors.border },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.foreground }]}>
              مشاركة المنتج
            </Text>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.closeButton,
                pressed && { opacity: 0.7 },
              ]}
            >
              <MaterialIcons name="close" size={24} color={colors.foreground} />
            </Pressable>
          </View>

          <ScrollView style={styles.content}>
            {/* Product Preview */}
            <View
              style={[
                styles.preview,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              {data.image && (
                <Image
                  source={{ uri: data.image }}
                  style={styles.previewImage}
                />
              )}
              <View style={styles.previewContent}>
                <Text
                  style={[styles.previewTitle, { color: colors.foreground }]}
                  numberOfLines={2}
                >
                  {data.title}
                </Text>
                {data.description && (
                  <Text
                    style={[styles.previewDescription, { color: colors.muted }]}
                    numberOfLines={2}
                  >
                    {data.description}
                  </Text>
                )}
              </View>
            </View>

            {/* Share Options */}
            <View style={styles.optionsContainer}>
              <Text style={[styles.optionsTitle, { color: colors.foreground }]}>
                شارك عبر
              </Text>

              <ShareOption
                icon="share"
                label="مشاركة سريعة"
                description="استخدم خيارات المشاركة الافتراضية"
                onPress={() => handleShare("native")}
                isSelected={selectedPlatform === "native"}
                colors={colors}
              />

              <ShareOption
                icon="chat"
                label="WhatsApp"
                description="شارك مع أصدقائك على WhatsApp"
                onPress={() => handleShare("whatsapp")}
                isSelected={selectedPlatform === "whatsapp"}
                colors={colors}
              />

              <ShareOption
                icon="send"
                label="Telegram"
                description="شارك عبر Telegram"
                onPress={() => handleShare("telegram")}
                isSelected={selectedPlatform === "telegram"}
                colors={colors}
              />

              <ShareOption
                icon="email"
                label="البريد الإلكتروني"
                description="أرسل الرابط عبر البريد"
                onPress={() => handleShare("email")}
                isSelected={selectedPlatform === "email"}
                colors={colors}
              />

              <ShareOption
                icon="content-copy"
                label="نسخ الرابط"
                description="انسخ الرابط إلى الحافظة"
                onPress={() => handleShare("copy")}
                isSelected={selectedPlatform === "copy"}
                colors={colors}
              />
            </View>

            {/* Share Link */}
            <View
              style={[
                styles.linkContainer,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.linkLabel, { color: colors.muted }]}>
                رابط المشاركة
              </Text>
              <View
                style={[
                  styles.linkBox,
                  { backgroundColor: colors.background, borderColor: colors.border },
                ]}
              >
                <Text
                  style={[styles.linkText, { color: colors.foreground }]}
                  numberOfLines={1}
                >
                  {data.url}
                </Text>
                <Pressable
                  onPress={() => handleShare("copy")}
                  style={({ pressed }) => [
                    styles.copyButton,
                    pressed && { opacity: 0.7 },
                  ]}
                >
                  <MaterialIcons
                    name="content-copy"
                    size={18}
                    color={colors.primary}
                  />
                </Pressable>
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View
            style={[
              styles.footer,
              { borderTopColor: colors.border, backgroundColor: colors.background },
            ]}
          >
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.cancelButton,
                { backgroundColor: colors.surface },
                pressed && { opacity: 0.8 },
              ]}
            >
              <Text style={[styles.cancelButtonText, { color: colors.foreground }]}>
                إغلاق
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

interface ShareOptionProps {
  icon: string;
  label: string;
  description: string;
  onPress: () => void;
  isSelected: boolean;
  colors: any;
}

function ShareOption({
  icon,
  label,
  description,
  onPress,
  isSelected,
  colors,
}: ShareOptionProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.option,
        {
          backgroundColor: isSelected ? colors.primary + "20" : "transparent",
          borderColor: isSelected ? colors.primary : colors.border,
        },
        pressed && { opacity: 0.8 },
      ]}
    >
      <View style={styles.optionIcon}>
        <MaterialIcons
          name={icon}
          size={24}
          color={isSelected ? colors.primary : colors.muted}
        />
      </View>
      <View style={styles.optionText}>
        <Text style={[styles.optionLabel, { color: colors.foreground }]}>
          {label}
        </Text>
        <Text style={[styles.optionDescription, { color: colors.muted }]}>
          {description}
        </Text>
      </View>
      {isSelected && (
        <MaterialIcons name="check-circle" size={24} color={colors.primary} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
    borderTopWidth: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  preview: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    gap: 12,
  },
  previewImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  previewContent: {
    flex: 1,
    justifyContent: "center",
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  previewDescription: {
    fontSize: 12,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionsTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  optionText: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 12,
  },
  linkContainer: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
  },
  linkLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 8,
  },
  linkBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  linkText: {
    flex: 1,
    fontSize: 12,
    fontFamily: "monospace",
  },
  copyButton: {
    padding: 8,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
