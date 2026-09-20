// fallow-ignore-file unused-file
// Vercel のファイルベースルーティングにより暗黙的に呼び出されるエントリーポイント
// ファイル名は単一角括弧の `[...route].ts` にすること。二重角括弧の
// `[[...route]].ts` はNext.js固有の「オプショナルcatch-all」構文で、
// Vercelの汎用サーバーレス関数では1階層のパスしかマッチしなくなる。
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
