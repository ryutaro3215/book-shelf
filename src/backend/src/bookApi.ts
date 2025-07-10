import { Hono, Context } from "hono";
import { z } from "zod";
import {
  SupabaseEnv,
  getSupabase,
  supabaseMiddleware,
} from "@/lib/supabaseClient";
import { BookSchema } from "@/schema";

type BookSchema = z.infer<typeof BookSchema>;

//Fetch BooksData from Google Books API
export const fetchBooksData = async (
  query: string | undefined,
  startIndex: number,
): Promise<BookSchema[]> => {
  if (!query || query.trim() === "") {
    console.log("No query");
    return [];
  }
  const keywords = query.trim().split(/\s+/);
  const qParam = keywords
    .map((keyword) => `q=${encodeURIComponent(keyword)}`)
    .join("&");

  const maxResults = 40; // Maximum results per request
  const apiKey = process.env.API_KEY;
  const apiUrl = `https://www.googleapis.com/books/v1/volumes?${qParam}&startIndex=${startIndex}&maxResults=${maxResults}&orderBy=newest&key=${apiKey}`;

  const response = await fetch(apiUrl);
  const data = (await response.json()) as { items: any[] };

  if (!data.items || !Array.isArray(data.items)) {
    console.log("No items found in the response");
    return [];
  }

  const books: BookSchema[] = data.items.map((item: any) => {
    return {
      book_id: item.id,
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors || ["Unknown"],
      publisher: item.volumeInfo.publisher || "Unknown",
      isbn: item.volumeInfo.industryIdentifiers || [],
      published_at: item.volumeInfo.publishedDate || "Unknown",
      image_url: item.volumeInfo.imageLinks?.thumbnail || "",
    };
  });
  return books;
};
