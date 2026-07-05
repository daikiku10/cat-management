import { Hono } from "hono";
import { rateLimiter } from "hono-rate-limiter";
import { register } from "./register";
import { login } from "./login";
import { logout } from "./logout";

const authRoutes = new Hono();

const authRateLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-6",
  keyGenerator: (c) =>
    c.req.header("x-forwarded-for") ?? c.req.header("x-real-ip") ?? "unknown",
});

authRoutes.use(authRateLimiter);

authRoutes.route("/register", register);
authRoutes.route("/login", login);
authRoutes.route("/logout", logout);

export { authRoutes };
