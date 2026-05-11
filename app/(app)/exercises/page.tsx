import { createServerSupabaseClient } from "@/lib/supabase-server";
import Link from "next/link";
import ExerciseFilters from "@/components/ExerciseFilters";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ q?: string; zone?: string; level?: string; material?: string }>;
};

export default async function ExercisesPage({ searchParams }: Props) {
  const params = await searchParams;
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("exercises")
    .select("*")
    .order("created_at", { ascending: false });

  if (params.q) {
    query = query.ilike("name", `%${params.q}%`);
  }
  if (params.zone) {
    query = query.eq("primary_zone", params.zone);
  }
  if (params.level) {
    query = query.eq("level", params.level);
  }
  if (params.material) {
    query = query.contains("material", [params.material]);
  }

  const { data: exercises, error } = await query;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Ejercicios</h1>
        <Link
          href="/exercises/new"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          + Nuevo ejercicio
        </Link>
      </div>

      <Suspense>
        <ExerciseFilters />
      </Suspense>

      {error && (
        <div className="rounded bg-red-100 p-4 text-red-800">
          <p className="font-semibold">Error</p>
          <pre className="text-sm">{error.message}</pre>
        </div>
      )}

      {!error && exercises?.length === 0 && (
        <p className="text-zinc-500">No hay ejercicios. ¡Crea el primero!</p>
      )}

      {exercises && exercises.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {exercises.map((ex) => (
            <Link
              key={ex.id}
              href={`/exercises/${ex.id}`}
              className="group rounded-xl border p-4 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
            >
              {ex.video_path && (
                <div className="mb-2 text-xs text-zinc-400">🎬 Tiene vídeo</div>
              )}
              <p className="font-semibold group-hover:underline">{ex.name}</p>
              <p className="mt-1 text-sm text-zinc-500">
                {ex.primary_zone}
                {ex.level && ` · ${ex.level}`}
                {ex.exercise_type && ` · ${ex.exercise_type}`}
              </p>
              {ex.material && ex.material.length > 0 && (
                <p className="mt-1 text-xs text-zinc-400">
                  {ex.material.join(", ")}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
