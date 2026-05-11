export const dynamic = "force-dynamic";

export default function WorkoutsPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-6 text-2xl font-bold">Entrenos</h1>
      <div className="rounded-xl border border-dashed border-zinc-300 p-12 text-center dark:border-zinc-700">
        <p className="text-lg text-zinc-400">🚧 Próximamente</p>
        <p className="mt-2 text-sm text-zinc-500">
          Aquí podrás crear y ver tus entrenos una vez se creen las tablas
          <code className="mx-1 text-xs">workouts</code> y
          <code className="mx-1 text-xs">workout_exercises</code> en Supabase.
        </p>
      </div>
    </div>
  );
}

