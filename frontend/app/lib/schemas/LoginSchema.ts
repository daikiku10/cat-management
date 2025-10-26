import * as v from "valibot";
import { messages } from "../validation/message";

export const LiginSchema = v.object({
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

export type LoginSchemaType = v.InferOutput<typeof LiginSchema>;
