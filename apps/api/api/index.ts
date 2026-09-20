// fallow-ignore-file unused-file
// Vercel のファイルベースルーティングにより暗黙的に呼び出されるエントリーポイント。
// ブラケット構文(`[...route].ts`)によるキャッチオールは、このプロジェクト構成では
// 1階層のパスしかマッチせず `/api/auth/register` 等が404になる不具合があったため、
// あえて動的でない `index.ts` にし、`vercel.json` の rewrites で
// `/api/*` を全てこの関数に明示的に転送する方式に変更した。
import { handle } from "hono/vercel";
// tsc-alias で `@/*` を相対パスへ解決済みのビルド成果物を読み込む。
// Vercel の関数バンドラーは tsconfig の paths を解決しないため、
// `src/*` を直接 import すると `@/routes/auth` 等が解決できず実行時エラーになる。
import { app } from "../dist/app";

export const runtime = "nodejs";

// runtime: "nodejs" の場合、Vercel は Web標準の fetch ハンドラーとして
// `export default` ではなく named export の `fetch` を要求する。
// `export default` のままだとレスポンスが無視され、常に空応答になる。
export const fetch = handle(app);
