// fallow-ignore-file unused-file
// Vercel のファイルベースルーティングにより暗黙的に呼び出されるエントリーポイント
import { handle } from "hono/vercel";
import { app } from "../src/app";

export const runtime = "nodejs";

export default handle(app);
