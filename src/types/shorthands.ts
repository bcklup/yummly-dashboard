import { Database } from "@/types/supabase";

export interface RecipeRow {
  created_at: string | null;
  description: string | null;
  hero_img: string | null;
  id: string;
  ingredients: any | null;
  instructions: any | null;
  title: string;
  video: string | null;
}

export type CommentWithProfile = {
  profiles: Database["public"]["Tables"]["profiles"]["Row"];
} & Database["public"]["Tables"]["comments"]["Row"];
