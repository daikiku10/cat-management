// fallow-ignore-file unused-file
// Vercel のファイルベースルーティングにより暗黙的に呼び出されるエントリーポイント
import { handle } from "hono/vercel";
// tsc-alias で `@/*` を相対パスへ解決済みのビルド成果物を読み込む。
// Vercel の関数バンドラーは tsconfig の paths を解決しないため、
// `src/*` を直接 import すると `@/routes/auth` 等が解決できず実行時エラーになる。
import { app } from "../dist/app";

export const runtime = "nodejs";

export default handle(app);
