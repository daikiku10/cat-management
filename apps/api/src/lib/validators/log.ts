import * as v from "valibot";

// nanoid のデフォルト長は 21 文字、許可文字は A-Za-z0-9_-
const idField = v.pipe(
  v.string(),
  v.minLength(1),
  v.maxLength(30),
  v.regex(/^[A-Za-z0-9_-]+$/, "無効なIDフォーマットです")
);

export const catIdParamSchema = v.object({
  catId: idField,
});

export const logIdParamSchema = v.object({
  catId: idField,
  logId: idField,
});

export const createFeedingLogSchema = v.object({
  amount: v.optional(v.pipe(v.number(), v.minValue(0))),
  foodType: v.optional(v.string()),
  memo: v.optional(v.string()),
});

export const createPoopLogSchema = v.object({
  condition: v.optional(v.picklist(["good", "soft", "hard", "diarrhea"])),
  memo: v.optional(v.string()),
});
