import { Json } from "./supabase";

export interface RecipeRow {
  created_at: string | null;
  description: string | null;
  hero_img: string | null;
  id: string;
  ingredients: Json | null;
  instructions: Json | null;
  title: string;
  video: string | null;
}
