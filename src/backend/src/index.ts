import { Hono } from "hono";
import {
  SupabaseEnv,
  getSupabase,
  supabaseMiddleware,
} from "@/lib/supabaseClient";
import users from "./routes/users";

//bindings supabase environment variables to the Hono app context
//Reference: https://hono-ja.pages.dev/docs/api/routing
const app = new Hono<{ Bindings: SupabaseEnv }>();
app.use("*", supabaseMiddleware());
app.route("/users", users);

export default app;
