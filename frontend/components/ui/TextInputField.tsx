import { View, Text, TextInput } from "react-native";

type Props = {
  label: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
};

export const TextInputFiled = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  error,
}: Props) => {
  return (
    <View className="w-full">
      <Text className="text-gray-700 mb-1">{label}</Text>
      <TextInput
        className={`border rounded-xl p-3 text-base ${error ? "border-red-500" : "border-gray-300"}`}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
      />
      {error ? (
        <Text className="text-red-500 text-sm mt-1">{error}</Text>
      ) : null}
    </View>
  );
};
