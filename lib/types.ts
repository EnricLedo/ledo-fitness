export type Exercise = {
  id: string;
  name: string;
  primary_zone: string;
  secondary_zones: string[] | null;
  material: string[] | null;
  level: string | null;
  exercise_type: string | null;
  notes: string | null;
  video_path: string | null;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      exercises: {
        Row: Exercise;
        Insert: Omit<Exercise, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Exercise>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
