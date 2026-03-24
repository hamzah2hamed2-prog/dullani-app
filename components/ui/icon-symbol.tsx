// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  "house.fill": "home",
  "magnifyingglass": "search",
  "heart.fill": "favorite",
  "person.fill": "person",
  "paperplane.fill": "send",
  "chevron.right": "chevron-right",
  "chevron.left": "chevron-left",
  "xmark": "close",
  "checkmark": "check",
  "storefront.fill": "store",
  "bag.fill": "shopping-bag",
  "tag.fill": "local-offer",
  "star.fill": "star",
  "phone.fill": "phone",
  "envelope.fill": "email",
  "mappin.fill": "location-on",
  "clock.fill": "schedule",
  "gear": "settings",
  "pencil": "edit",
  "trash.fill": "delete",
  "camera.fill": "camera-alt",
  "photo.fill": "image",
  "chart.bar.fill": "bar-chart",
  "plus.circle.fill": "add-circle",
  "eye.fill": "visibility",
  "hand.thumbsup.fill": "thumb-up",
  "map.fill": "map",
  "arrow.up.right": "open-in-new",
  "chevron.left.forwardslash.chevron.right": "code",
  "bell.fill": "notifications",
  "share.fill": "share",
  "filter": "tune",
  "ellipsis.horizontal": "more-horiz",
  "bubble.right": "chat-bubble-outline",
  "paperplane": "send",
  "bookmark": "bookmark-border",
  "bookmark.fill": "bookmark",
} as const;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
