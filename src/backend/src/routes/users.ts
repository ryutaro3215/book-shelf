import { Hono, Context } from "hono";
import {
  SupabaseEnv,
  getSupabase,
  supabaseMiddleware,
} from "@/lib/supabaseClient";
import { z } from "zod";

const UserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const users = new Hono<{ Bindings: SupabaseEnv }>();
users.use("*", supabaseMiddleware());

users.post("/register", async (c: Context) => {
  const req = await c.req.json();
  const parseResult = UserSchema.safeParse(req);

  //validate the request body against the zod schema
  //Reference: https://betterstack.com/community/guides/scaling-nodejs/zod-explained
  if (!parseResult.success) {
    return c.json(
      { error: `Invalid input: ${parseResult.error.message}` },
      400,
    );
  }

  // Accessing the Supabase client from the Hono context
  // Authenticate the user with supabase
  const supabase = getSupabase(c);
  const { data, error } = await supabase.auth.signUp({
    email: req.email,
    password: req.password,
  });
  // Authentication Error Handling
  if (error) {
    return c.json({ error: `supabase error: ${error.message}` }, 400);
  }
  // add the user to the users table in supabase
  const { error: insertError } = await supabase
    .from("users")
    .insert({ id: data.user?.id, name: req.name, email: req.email });
  //Insert Error Handling
  if (insertError) {
    return c.json({ error: `Insert error: ${insertError.message}` }, 400);
  }

  //Return success response
  return c.json(
    {
      message: "User registered successfully",
      user: {
        id: data.user?.id,
        name: req.name,
        email: req.email,
      },
    },
    201,
  );
});

users.post("/login", async (c: Context) => {
  const req = await c.req.json();
  // Validate only email and password fields
  const parseResult = UserSchema.pick({
    email: true,
    password: true,
  }).safeParse(req);

  // Validate Error Handling
  if (!parseResult.success) {
    return c.json(
      { error: `Invalid input: ${parseResult.error.message}` },
      400,
    );
  }

  //Accessing the Supabase client from the Hono context
  const supabase = getSupabase(c);
  const { data, error } = await supabase.auth.signInWithPassword({
    email: req.email,
    password: req.password,
  });
  // Authentication Error Handling
  if (error) {
    return c.json({ error: `login error: ${error.message}` }, 400);
  }

  //fetch user data from the users table
  const { data: userData, error: fetchError } = await supabase
    .from("users")
    .select("*")
    .eq("id", data.user?.id)
    .single();
  console.log("userData", userData);
  console.log("fetchError", fetchError);
  if (fetchError) {
    return c.json({ error: `Fetch user error: ${fetchError.message}` }, 400);
  }

  //return success response
  return c.json({
    message: `${userData.name} logged in successfully`,
    user: {
      id: userData.id,
      name: userData.name,
      email: userData.email,
    },
  });
});

users.get("/logout", async (c: Context) => {
  //Accessing the supabase client from the Hono context
  const supabase = getSupabase(c);
  const currentUser = await supabase.auth.getUser();
  if (!currentUser.data.user) {
    return c.json({ error: "No user is currently logged in" }, 400);
  }
  const { error } = await supabase.auth.signOut();
  if (error) {
    return c.json({ error: `Logout error: ${error.message}` }, 400);
  }
  return c.json({ message: "Logout successfully" });
});

users.post("/update", async (c: Context) => {
  const req = await c.req.json();
  //validate request body
  const parseNameSchema = UserSchema.pick({ name: true }).safeParse(req);
  const parseEmailSchema = UserSchema.pick({ email: true }).safeParse(req);
  const parsePasswordSchema = UserSchema.pick({ password: true }).safeParse(
    req,
  );
  //check if at least one field is provided
  if (
    !parseNameSchema.success ||
    !parseEmailSchema.success ||
    !parsePasswordSchema.success
  ) {
    return c.json(
      {
        error:
          "Invalid input: At least one field (name, email, password) is required",
      },
      400,
    );
  }

  const supabase = getSupabase(c);
  //Fetch the current user
  const currentUser = await supabase.auth.getUser();
  if (!currentUser.data.user) {
    return c.json({ error: "No user is currently logged in" }, 400);
  }
  const { data, error: authError } = await supabase.auth.updateUser({
    email: req.email,
    password: req.password,
  });
  //Update auth email error handling
  if (authError) {
    return c.json(
      { message: `Failed to update email or password: ${authError.message}` },
      400,
    );
  }
  //Update user data in the users table
  const { error: updateError } = await supabase
    .from("users")
    .update({ name: req.name, email: req.email })
    .eq("id", data.user?.id);

  //Update user data error handling
  if (updateError) {
    return c.json(
      {
        error: `Failed to update user data: ${updateError.message}`,
      },
      400,
    );
  }

  return c.json({
    message: "User updated successfully",
    user: {
      id: data.user?.id,
      name: req.name,
      email: req.email,
    },
  });
});

users.get("/profile", async (c: Context) => {
  const supabase = getSupabase(c);
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    return c.json({ error: `Failed to auth user data: ${error}` }, 400);
  }
  //Fetch user data from the users table
  const { data: userData, error: fetchError } = await supabase
    .from("users")
    .select("*")
    .eq("id", data.user?.id)
    .single();

  if (fetchError) {
    return c.json(
      { error: `Fetch error from users tabel: ${fetchError.message}` },
      400,
    );
  }
  return c.json({
    message: "User profile fetched successfully",
    user: {
      id: userData.id,
      name: userData.name,
      email: userData.email,
    },
  });
});

export default users;
