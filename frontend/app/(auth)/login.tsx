import { View, Text } from "react-native";
import { useForm } from "react-hook-form";
import { LoginInput, LoginSchema } from "../lib/schemas/login";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { createContext, useContext } from "react";

export const Login = () => {
  const userContext = createContext<{ userName: string }>({ userName: "" });
  const user = useContext(userContext);
  const {} = useForm<LoginInput>({
    resolver: valibotResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginInput) => {
    // ログイン処理
    console.log("ログイン", data);
  };
  return (
    <View>
      <Text>🐾ログインフォーム🐾</Text>
    </View>
  );
};

export default Login;

// import { View, Text, TouchableOpacity, Alert } from "react-native"
// import { useForm, Controller } from "react-hook-form"
// import { valibotResolver } from "@hookform/resolvers/valibot"
// import { LoginSchema, LoginInput } from "@/lib/schemas/login"
// import { TextInputField } from "@/components/ui/TextInputField"

// export default function LoginScreen() {
//   const { control, handleSubmit, formState } = useForm<LoginInput>({
//     resolver: valibotResolver(LoginSchema),
//     defaultValues: {
//       userName: "",
//       catName: "",
//       email: "",
//       password: "",
//     },
//   })

//   const onSubmit = (data: LoginInput) => {
//     Alert.alert("入力結果", JSON.stringify(data, null, 2))
//   }

//   return (
//     <View className="flex-1 items-center justify-center bg-amber-50 p-6">
//       <View className="w-full max-w-md bg-white rounded-2xl shadow-md p-6">
//         <Text className="text-2xl font-bold text-center mb-6 text-amber-700">🐾 ログインフォーム</Text>

//         <Controller
//           control={control}
//           name="userName"
//           render={({ field: { onChange, value }, fieldState }) => (
//             <TextInputField
//               label="ユーザー名"
//               placeholder="例: daiki"
//               value={value}
//               onChangeText={onChange}
//               error={fieldState.error?.message}
//             />
//           )}
//         />

//         <Controller
//           control={control}
//           name="catName"
//           render={({ field: { onChange, value }, fieldState }) => (
//             <TextInputField
//               label="猫ちゃんの名前"
//               placeholder="例: みけ"
//               value={value}
//               onChangeText={onChange}
//               error={fieldState.error?.message}
//             />
//           )}
//         />

//         <Controller
//           control={control}
//           name="email"
//           render={({ field: { onChange, value }, fieldState }) => (
//             <TextInputField
//               label="メールアドレス"
//               placeholder="example@domain.com"
//               value={value}
//               onChangeText={onChange}
//               error={fieldState.error?.message}
//             />
//           )}
//         />

//         <Controller
//           control={control}
//           name="password"
//           render={({ field: { onChange, value }, fieldState }) => (
//             <TextInputField
//               label="パスワード"
//               placeholder="8文字以上"
//               value={value}
//               onChangeText={onChange}
//               error={fieldState.error?.message}
//               secureTextEntry
//             />
//           )}
//         />

//         <TouchableOpacity
//           onPress={handleSubmit(onSubmit)}
//           className="bg-amber-600 py-3 rounded-xl mt-4"
//         >
//           <Text className="text-white text-center text-lg font-semibold">ログイン</Text>
//         </TouchableOpacity>

//         {formState.isSubmitted && formState.isValid && (
//           <Text className="text-green-600 text-center mt-4">✅ バリデーション成功！</Text>
//         )}
//       </View>
//     </View>
//   )
// }
