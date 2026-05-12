"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase";
import ExerciseForm from "@/components/ExerciseForm";
import type { Exercise } from "@/lib/types";

export default function EditExercisePage() {
  const { id } = useParams<{ id: string }>();
  const supabase = createBrowserClient();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    supabase
      .from("exercises")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setNotFound(true);
        } else {
          setExercise(data);
        }
        setLoading(false);
      });
  }, [id, supabase]);

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl">
        <p className="text-zinc-400 animate-pulse">Cargando ejercicio...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="mx-auto max-w-2xl">
        <p className="text-zinc-500">Ejercicio no encontrado.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 pl-12 text-2xl font-bold md:pl-0">Editar ejercicio</h1>
      <ExerciseForm exercise={exercise!} />
    </div>
  );
}
