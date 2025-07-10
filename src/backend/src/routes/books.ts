import { Hono, Context } from "hono";
import { streamSSE } from "hono/streaming";
import { z } from "zod";
import {
  SupabaseEnv,
  getSupabase,
  supabaseMiddleware,
} from "@/lib/supabaseClient";
import { BookSchema } from "@/schema";
import { booksDataSample } from "@/test/testdata";
import { fetchBooksData } from "@/bookApi";

type BookSchema = z.infer<typeof BookSchema>;

const books = new Hono<{ Bindings: SupabaseEnv }>();
books.use("*", supabaseMiddleware());

//Endpoint to fetch books data based on a query parameter
books.get("/fetch-books", async (c: Context) => {
  const query = c.req.query("q");
  if (!query || query.trim() === "") {
    return c.json({ error: "Query parameter 'q' is required" }, 400);
  }

  const allBooks: BookSchema[] = [];
  let startIndex: number = parseInt(c.req.query("startIndex") ?? "0");
  let booksCounter: number = 0;

  while (booksCounter < 120) {
    const booksData: BookSchema[] = await fetchBooksData(query, startIndex);
    if (booksData.length === 0) break;
    allBooks.push(...booksData);
    startIndex += booksData.length;
    booksCounter += booksData.length;
  }

  return c.json(allBooks); // ← フロントエンドで fetch(...).json() が安全に使える
});

books.post("/add-book", async (c: Context) => {
  const req = await c.req.json();

  // Validate the request body against the Bookschema
  const parseResult = BookSchema.safeParse(req);
  if (!parseResult.success)
    return c.json(
      { error: `Invalid input: ${parseResult.error.message}` },
      400,
    );

  //Accessing the supabase client from authenticated user
  const supabase = getSupabase(c);
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError || !user?.user) {
    return c.json({ error: "User is not authenticated" }, 401);
  }

  //insert the book data into the book table
  const { error } = await supabase.from("book").insert({
    book_id: req.book_id,
    title: req.title,
    authors: req.authors,
    publisher: req.publisher,
    isbn: req.isbn,
    published_at: req.published_at,
    image_url: req.image_url,
  });

  // Insert Error Handling
  if (error) {
    return c.json({ error: `Insert error: ${error.message}` }, 400);
  }

  // Return success response
  return c.json({ message: "Book added successfully" }, 201);
});

books.get("/get-my-books", async (c: Context) => {
  // Accessing the supabase client from authenticated user
  const supabase = getSupabase(c);
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError || !user?.user) {
    return c.json({ error: "User is not authenticated" }, 401);
  }

  //fetch the books data from the book table
  const { data: booksData, error } = await supabase
    .from("book")
    .select("*")
    .eq("user_id", user.user.id);

  // Fetch Error Handling
  if (error) {
    return c.json({ error: `Fetch error: ${error.message}` }, 400);
  }
  return c.json(booksData || [], 200);
});

books.delete("/delete-book", async (c: Context) => {
  const bookId = c.req.param("id");
  if (!bookId) return c.json({ error: "Book ID is required" }, 400);

  // Accessing the supabase client from authenticated user
  const supabase = getSupabase(c);
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError || !user?.user) {
    return c.json({ error: "User is not authenticated" }, 401);
  }
  // Delete the book from the book table
  const { error } = await supabase
    .from("book")
    .delete()
    .eq("book_id", bookId)
    .eq("user_id", user.user.id);
  if (error) {
    return c.json({ error: `Delete error: ${error.message}` }, 400);
  }

  return c.json({ message: "Book deleted successfully" }, 200);
});

export default books;
