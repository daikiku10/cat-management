import * as v from "valibot";
import { messages } from "../validation/message";

export const RegisterSchema = v.object({
  userName: v.pipe(v.string(), v.nonEmpty(messages.required("ユーザー名"))),
  catName: v.pipe(v.string(), v.nonEmpty(messages.required("猫の名前"))),
  email: v.pipe(
    v.string(),
    v.nonEmpty(messages.required("メールアドレス")),
    v.email(messages.invalidEmail)
  ),
  password: v.pipe(
    v.string(),
    v.nonEmpty(messages.required("パスワード")),
    v.minLength(8, messages.minLength("パスワード", 8))
  ),
});

export type RegisterInput = v.InferOutput<typeof RegisterSchema>;
