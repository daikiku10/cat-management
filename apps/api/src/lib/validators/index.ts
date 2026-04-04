import { HTTPException } from "hono/http-exception";

/**
 * vValidator の第3引数に渡すエラーフック。
 * バリデーション失敗時に HTTPException(400) を throw し、
 * 全ルートでエラーレスポンス形式を統一する。
 *
 * @example
 * vValidator("json", createCatSchema, validationHook)
 */
export const validationHook = ({ success }: { success: boolean }) => {
  if (!success) {
    throw new HTTPException(400, { message: "入力内容が正しくありません" });
  }
};
