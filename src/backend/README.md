import { Hono } from "hono";
import {
  SupabaseEnv,
  getSupabase,
  supabaseMiddleware,
} from "@/lib/supabaseClient";
import { z } from "zod";

const app = new Hono<{ Bindings: SupabaseEnv }>();
