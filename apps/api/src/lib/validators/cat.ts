import * as v from "valibot";

export const createCatSchema = v.object({
  name: v.pipe(v.string(), v.minLength(1, "名前は必須です")),
  age: v.optional(v.pipe(v.number(), v.minValue(0))),
  breed: v.optional(v.string()),
  photo: v.optional(v.pipe(v.string(), v.url())),
  weight: v.optional(v.pipe(v.number(), v.minValue(0))),
  gender: v.optional(v.picklist(["male", "female", "unknown"])),
  memo: v.optional(v.string()),
});

export type CreateCatInput = v.InferInput<typeof createCatSchema>;

export const updateCatSchema = v.partial(createCatSchema);

export type UpdateCatInput = v.InferInput<typeof updateCatSchema>;
