"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase";
import ExerciseFilters from "@/components/ExerciseFilters";
import type { Exercise } from "@/lib/types";

export default function ExercisesPage() {
  const searchParams = useSearchParams();
  const supabase = createBrowserClient();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExercises = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("exercises")
      .select("*")
      .order("created_at", { ascending: false });

    const q = searchParams.get("q");
    const zone = searchParams.get("zone");
    const level = searchParams.get("level");
    const material = searchParams.get("material");

    if (q) query = query.ilike("name", `%${q}%`);
    if (zone) query = query.eq("primary_zone", zone);
    if (level) query = query.eq("level", level);
    if (material) query = query.contains("material", [material]);

    const { data, error } = await query;
    setExercises(data ?? []);
    setError(error?.message ?? null);
    setLoading(false);
  }, [supabase, searchParams]);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between pl-12 md:pl-0">
        <h1 className="text-2xl font-bold">Ejercicios</h1>
        <Link
          href="/exercises/new"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          + Nuevo ejercicio
        </Link>
      </div>

      <ExerciseFilters />

      {error && (
        <div className="rounded bg-red-100 p-4 text-red-800">
          <p className="font-semibold">Error</p>
          <pre className="text-sm">{error}</pre>
        </div>
      )}

      {loading && (
        <p className="text-zinc-400 animate-pulse">Cargando ejercicios...</p>
      )}

      {!loading && !error && exercises.length === 0 && (
        <p className="text-zinc-500">No hay ejercicios. ¡Crea el primero!</p>
      )}

      {!loading && exercises.length > 0 && (
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
