// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * SF Symbols と Material Icons のマッピングをここに追加してください。
 * - Material Icons は [Icons Directory](https://icons.expo.fyi) で確認できます。
 * - SF Symbols は [SF Symbols](https://developer.apple.com/sf-symbols/) アプリで確認できます。
 */
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'pawprint.fill': 'pets',
  'rectangle.portrait.and.arrow.right': 'logout',
} as IconMapping;

/**
 * iOS では SF Symbols、Android・Web では Material Icons を使用するアイコンコンポーネント。
 * プラットフォーム間で統一された見た目と最適なリソース使用を実現します。
 * アイコンの `name` は SF Symbols に基づいており、Material Icons への手動マッピングが必要です。
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
