export const messages = {
  required: (field: string) => `${field}は必須です`,
  invalidEmail: "有効なメールアドレスを入力してください",
  minLength: (field: string, length: number) =>
    `${field}は${length}文字以上で入力してください`,
};
