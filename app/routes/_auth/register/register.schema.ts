import { z } from "zod";

// Define a schema for your form
export const RegisterSchema = z
  .object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(4),
    passwordConfirm: z.string().min(4),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ["passwordConfirm"],
  });

export type RegisterData = z.infer<typeof RegisterSchema>;
