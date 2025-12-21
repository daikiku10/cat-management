import * as v from "valibot";

export const registerSchema = v.object({
  email: v.pipe(v.string(), v.email()),
  password: v.pipe(v.string(), v.minLength(8)),
});
export type RegisterInput = v.InferInput<typeof registerSchema>;

export const loginSchema = v.object({
  email: v.pipe(v.string(), v.email()),
  password: v.string(),
});
export type LoginInput = v.InferInput<typeof loginSchema>;
