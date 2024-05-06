import slugify from "slugify";
import { z } from "zod";

// Define a schema for your form
export const CreateOrganizationSchema = z.object({
  name: z.string().min(1),
  slug: z
    .string()
    .min(4)
    .max(24)
    .refine(
      (value) =>
        slugify(value, {
          strict: true,
          lower: true,
          trim: true,
        }) === value,
      (value) => ({
        message:
          "Username must contain only lowercase letters, numbers, and hyphens",
      }),
    ),
  website: z.string().url().optional(),
});

export type RegisterData = z.infer<typeof CreateOrganizationSchema>;
