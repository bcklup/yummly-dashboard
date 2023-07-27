import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

// Better put your these secret keys in .env file
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false, // Prevents Supabase from evaluating window.location.href, breaking mobile
    },
  }
);
