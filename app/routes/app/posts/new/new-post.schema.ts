import { z } from "zod";

export const NewPostSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(3),
});

export type NewPost = z.infer<typeof NewPostSchema>;
