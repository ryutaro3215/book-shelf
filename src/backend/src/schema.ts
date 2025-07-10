import { z } from "zod";
import { ISBNArraySchema } from "@/utils/isbnSchema";

export const UserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const BookSchema = z.object({
  book_id: z.string(),
  title: z.string().min(1, "Title is required"),
  authors: z.array(z.string()).min(1, "At least one author is required"),
  publisher: z.string().min(1, "Publisher is required"),
  isbn: ISBNArraySchema,
  published_at: z.string(),
  image_url: z.string().url("Invalid image URL"),
});
