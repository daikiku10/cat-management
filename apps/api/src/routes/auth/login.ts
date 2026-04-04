import { db } from "@/db";
import { loginSchema } from "@/lib/validators/auth";
import { users } from "@repo/db";
import { Hono } from "hono";
import { vValidator } from "@hono/valibot-validator";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

// タイミング攻撃対策：ユーザーが存在しない場合も bcrypt.compare を実行して応答時間を均一化する
const DUMMY_HASH = "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWq";

const login = new Hono();

login.post("/", vValidator("json", loginSchema), async (c) => {
  const { email, password } = c.req.valid("json");

  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  const passwordHash = user?.passwordHash ?? DUMMY_HASH;
  const isValid = await bcrypt.compare(password, passwordHash);

  if (!user || !isValid) {
    return c.json({ error: "メールアドレスまたはパスワードが正しくありません" }, 401);
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  return c.json({ token });
});

export { login };
