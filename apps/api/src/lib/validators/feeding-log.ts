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
  fedDate: v.pipe(
    v.string(),
    v.regex(/^\d{4}-\d{2}-\d{2}$/, "日付は YYYY-MM-DD 形式で指定してください")
  ),
  mealType: v.picklist(["morning", "noon", "night"]),
  amountGiven: v.optional(v.pipe(v.number(), v.minValue(0))),
  amountLeft: v.optional(v.pipe(v.number(), v.minValue(0))),
  memo: v.optional(v.string()),
});

export const updateFeedingLogSchema = v.pipe(
  v.partial(createFeedingLogSchema),
  v.check(
    (data) => Object.values(data).some((val) => val !== undefined),
    "少なくとも1つのフィールドを指定してください"
  )
);
