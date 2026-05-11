import { createServerSupabaseClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import ExerciseForm from "@/components/ExerciseForm";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditExercisePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: exercise, error } = await supabase
    .from("exercises")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !exercise) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">Editar ejercicio</h1>
      <ExerciseForm exercise={exercise} />
    </div>
  );
}
