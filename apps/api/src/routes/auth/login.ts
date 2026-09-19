import { db } from "@/db";
import { loginSchema } from "@/lib/validators/auth";
import { sessions, users } from "@repo/db";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { vValidator } from "@hono/valibot-validator";
import { validationHook } from "@/lib/validators";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

// タイミング攻撃対策：ユーザーが存在しない場合も bcrypt.compare を実行して応答時間を均一化する
const DUMMY_HASH = "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWq";

const login = new Hono();

login.post("/", vValidator("json", loginSchema, validationHook), async (c) => {
  const { email, password } = c.req.valid("json");

  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  const passwordHash = user?.passwordHash ?? DUMMY_HASH;
  const isValid = await bcrypt.compare(password, passwordHash);

  if (!user || !isValid) {
    throw new HTTPException(401, { message: "メールアドレスまたはパスワードが正しくありません" });
  }

  const jti = nanoid();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await db.insert(sessions).values({ id: jti, userId: user.id, expiresAt });

  const token = jwt.sign({ userId: user.id, jti }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  return c.json({ token });
});

export { login };
