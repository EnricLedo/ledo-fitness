"use client";

import ExerciseForm from "@/components/ExerciseForm";

export default function NewExercisePage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 pl-12 text-2xl font-bold md:pl-0">Nuevo ejercicio</h1>
      <ExerciseForm />
    </div>
  );
}
