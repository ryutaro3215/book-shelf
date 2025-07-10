import { Hono } from "hono";
import { cors } from "hono/cors";
import {
  SupabaseEnv,
  getSupabase,
  supabaseMiddleware,
} from "@/lib/supabaseClient";
import users from "./routes/users";
import books from "./routes/books";

//bindings supabase environment variables to the Hono app context
//Reference: https://hono-ja.pages.dev/docs/api/routing
const app = new Hono<{ Bindings: SupabaseEnv }>();

app.use(
  "*",
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use("*", supabaseMiddleware());
app.route("/users", users);
app.route("/books", books);

export default app;
