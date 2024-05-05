import slugify from "slugify";
import { z } from "zod";

export const toSlug = (value: string) =>
  slugify(value, {
    strict: true,
    lower: true,
    trim: true,
  });

// Define a schema for your form
export const CreateOrganizationSchema = z
  .object({
    name: z.string().min(1),
    username: z
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
    email: z.string().email(),
    password: z.string().min(4),
    passwordConfirm: z.string().min(4),
    website: z.string().url().optional(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ["passwordConfirm"],
  });

export type RegisterData = z.infer<typeof CreateOrganizationSchema>;
