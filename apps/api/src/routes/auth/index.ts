import { Hono } from "hono";
import { register } from "./register";
import { login } from "./login";
import { logout } from "./logout";

const authRoutes = new Hono();

authRoutes.route("/register", register);
authRoutes.route("/login", login);
authRoutes.route("/logout", logout);

export { authRoutes };
