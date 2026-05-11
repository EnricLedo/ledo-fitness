"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase";
import type { Exercise } from "@/lib/types";

const ZONES = [
  "Pecho", "Espalda", "Hombros", "Bíceps", "Tríceps",
  "Core", "Cuádriceps", "Isquiotibiales", "Glúteos", "Gemelos",
  "Cuerpo completo",
];
const LEVELS = ["Principiante", "Intermedio", "Avanzado"];
const TYPES = ["Fuerza", "Cardio", "Movilidad", "Estiramiento", "Calentamiento"];
const MATERIALS = [
  "Sin material", "Mancuernas", "Barra", "Kettlebell",
  "Banda elástica", "Polea", "Máquina", "TRX", "Banco",
];

type Props = {
  exercise?: Exercise;
};

export default function ExerciseForm({ exercise }: Props) {
  const router = useRouter();
  const supabase = createBrowserClient();
  const isEdit = !!exercise;

  const [name, setName] = useState(exercise?.name ?? "");
  const [primaryZone, setPrimaryZone] = useState(exercise?.primary_zone ?? "");
  const [secondaryZones, setSecondaryZones] = useState<string[]>(exercise?.secondary_zones ?? []);
  const [material, setMaterial] = useState<string[]>(exercise?.material ?? []);
  const [level, setLevel] = useState(exercise?.level ?? "");
  const [exerciseType, setExerciseType] = useState(exercise?.exercise_type ?? "");
  const [notes, setNotes] = useState(exercise?.notes ?? "");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleItem(arr: string[], item: string, setter: (v: string[]) => void) {
    setter(arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let videoPath = exercise?.video_path ?? null;

      // Subir vídeo si hay uno nuevo
      if (videoFile) {
        const ext = videoFile.name.split(".").pop();
        const fileName = `${Date.now()}.${ext}`;
        const filePath = `videos/${fileName}`;

        const { error: uploadErr } = await supabase.storage
          .from("exercise-videos")
          .upload(filePath, videoFile, { upsert: true });

        if (uploadErr) throw uploadErr;
        videoPath = filePath;
      }

      const data = {
        name,
        primary_zone: primaryZone,
        secondary_zones: secondaryZones.length > 0 ? secondaryZones : null,
        material: material.length > 0 ? material : null,
        level: level || null,
        exercise_type: exerciseType || null,
        notes: notes || null,
        video_path: videoPath,
      };

      if (isEdit) {
        const { error: err } = await supabase
          .from("exercises")
          .update(data)
          .eq("id", exercise.id);
        if (err) throw err;
      } else {
        const { error: err } = await supabase.from("exercises").insert(data);
        if (err) throw err;
      }

      router.push("/exercises");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!exercise || !confirm("¿Eliminar este ejercicio?")) return;
    setLoading(true);

    // Borrar vídeo si existe
    if (exercise.video_path) {
      await supabase.storage.from("exercise-videos").remove([exercise.video_path]);
    }

    const { error } = await supabase.from("exercises").delete().eq("id", exercise.id);
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/exercises");
    router.refresh();
  }

  const selectCls =
    "w-full rounded-lg border px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800";
  const labelCls = "block text-sm font-medium mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <p className="rounded bg-red-100 p-3 text-sm text-red-700">{error}</p>
      )}

      {/* Nombre */}
      <div>
        <label className={labelCls}>Nombre *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={selectCls}
        />
      </div>

      {/* Zona principal */}
      <div>
        <label className={labelCls}>Zona principal *</label>
        <select
          value={primaryZone}
          onChange={(e) => setPrimaryZone(e.target.value)}
          required
          className={selectCls}
        >
          <option value="">Seleccionar...</option>
          {ZONES.map((z) => (
            <option key={z} value={z}>{z}</option>
          ))}
        </select>
      </div>

      {/* Zonas secundarias */}
      <div>
        <label className={labelCls}>Zonas secundarias</label>
        <div className="flex flex-wrap gap-2">
          {ZONES.filter((z) => z !== primaryZone).map((z) => (
            <button
              key={z}
              type="button"
              onClick={() => toggleItem(secondaryZones, z, setSecondaryZones)}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                secondaryZones.includes(z)
                  ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                  : "border-zinc-300 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400"
              }`}
            >
              {z}
            </button>
          ))}
        </div>
      </div>

      {/* Material */}
      <div>
        <label className={labelCls}>Material</label>
        <div className="flex flex-wrap gap-2">
          {MATERIALS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => toggleItem(material, m, setMaterial)}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                material.includes(m)
                  ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                  : "border-zinc-300 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Nivel + Tipo (en fila) */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Nivel</label>
          <select value={level} onChange={(e) => setLevel(e.target.value)} className={selectCls}>
            <option value="">—</option>
            {LEVELS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Tipo de ejercicio</label>
          <select value={exerciseType} onChange={(e) => setExerciseType(e.target.value)} className={selectCls}>
            <option value="">—</option>
            {TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Notas */}
      <div>
        <label className={labelCls}>Notas</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className={selectCls}
        />
      </div>

      {/* Vídeo */}
      <div>
        <label className={labelCls}>Vídeo</label>
        {exercise?.video_path && !videoFile && (
          <p className="mb-2 text-sm text-zinc-500">
            🎬 Vídeo actual: <code className="text-xs">{exercise.video_path}</code>
          </p>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
          className="hidden"
        />
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-lg border px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Elegir archivo
          </button>
          <span className="text-sm text-zinc-500">
            {videoFile ? videoFile.name : "Sin archivo seleccionado"}
          </span>
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-zinc-900 px-6 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          {loading ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear ejercicio"}
        </button>

        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="rounded-lg border border-red-300 px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            Eliminar
          </button>
        )}

        <button
          type="button"
          onClick={() => router.push("/exercises")}
          className="rounded-lg border px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

