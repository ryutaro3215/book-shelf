import { z } from "zod";
import type { BookSchema } from "@/schema";

type BookSchema = z.infer<typeof BookSchema>;

export const booksDataSample: BookSchema[] = [
  {
    book_id: "1",
    title: "Sample Book 1",
    authors: ["Author One"],
    publisher: "Sample Publisher",
    isbn: [
      {
        type: "ISBN_10",
        identifier: "4873110025",
      },
      {
        type: "ISBN_13",
        identifier: "9784873110028",
      },
    ],
    published_at: "2023-01-01",
    image_url: "https://example.com/sample-book-1.jpg",
  },
  {
    book_id: "2",
    title: "Sample Book 2",
    authors: ["Author Two"],
    publisher: "Sample Publisher",
    isbn: [{ type: "ISBN_13", identifier: "978-3-16-148410-1" }],
    published_at: "2023-02-01",
    image_url: "https://example.com/sample-book-2.jpg",
  },
];
