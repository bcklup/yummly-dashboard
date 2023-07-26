export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      comments: {
        Row: {
          comment: string | null;
          created_at: string | null;
          id: string;
          is_approved: boolean | null;
          recipe_id: string;
          user_id: string;
        };
        Insert: {
          comment?: string | null;
          created_at?: string | null;
          id?: string;
          is_approved?: boolean | null;
          recipe_id: string;
          user_id: string;
        };
        Update: {
          comment?: string | null;
          created_at?: string | null;
          id?: string;
          is_approved?: boolean | null;
          recipe_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "comments_recipe_id_fkey";
            columns: ["recipe_id"];
            referencedRelation: "recipes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "comments_recipe_id_fkey";
            columns: ["recipe_id"];
            referencedRelation: "trending_recipes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "comments_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["user_id"];
          }
        ];
      };
      history: {
        Row: {
          created_at: string | null;
          id: string;
          recipe_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          recipe_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          recipe_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "history_recipe_id_fkey";
            columns: ["recipe_id"];
            referencedRelation: "recipes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "history_recipe_id_fkey";
            columns: ["recipe_id"];
            referencedRelation: "trending_recipes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "history_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["user_id"];
          }
        ];
      };
      profiles: {
        Row: {
          first_name: string | null;
          id: string;
          is_admin: boolean;
          last_name: string | null;
          user_id: string;
        };
        Insert: {
          first_name?: string | null;
          id?: string;
          is_admin?: boolean;
          last_name?: string | null;
          user_id: string;
        };
        Update: {
          first_name?: string | null;
          id?: string;
          is_admin?: boolean;
          last_name?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      recipes: {
        Row: {
          created_at: string | null;
          description: string | null;
          hero_img: string | null;
          id: string;
          ingredients: Json | null;
          instructions: Json | null;
          title: string;
          video: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          hero_img?: string | null;
          id?: string;
          ingredients?: Json | null;
          instructions?: Json | null;
          title: string;
          video?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          hero_img?: string | null;
          id?: string;
          ingredients?: Json | null;
          instructions?: Json | null;
          title?: string;
          video?: string | null;
        };
        Relationships: [];
      };
      saved: {
        Row: {
          created_at: string | null;
          id: string;
          recipe_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          recipe_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          recipe_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "saved_recipe_id_fkey";
            columns: ["recipe_id"];
            referencedRelation: "recipes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "saved_recipe_id_fkey";
            columns: ["recipe_id"];
            referencedRelation: "trending_recipes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "saved_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["user_id"];
          }
        ];
      };
    };
    Views: {
      trending_recipes: {
        Row: {
          created_at: string | null;
          description: string | null;
          hero_img: string | null;
          id: string | null;
          ingredients: Json | null;
          instructions: Json | null;
          saved_count: number | null;
          title: string | null;
          video: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      get_claim: {
        Args: {
          uid: string;
          claim: string;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
