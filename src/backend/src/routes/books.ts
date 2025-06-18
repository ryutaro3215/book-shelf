import { Hono, Context } from "hono";
import {
  SupabaseEnv,
  getSupabase,
  supabaseMiddleware,
} from "@/lib/supabaseClient";

const books = new Hono<{ Bindings: SupabaseEnv }>();
books.use("*", supabaseMiddleware());

books.get("/", async (c: Context) => {});
