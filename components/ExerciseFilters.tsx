"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const ZONES = [
  "Pecho", "Espalda", "Hombros", "Bíceps", "Tríceps",
  "Core", "Cuádriceps", "Isquiotibiales", "Glúteos", "Gemelos",
  "Cuerpo completo",
];

const LEVELS = ["Principiante", "Intermedio", "Avanzado"];

const MATERIALS = [
  "Sin material", "Mancuernas", "Barra", "Kettlebell",
  "Banda elástica", "Polea", "Máquina", "TRX", "Banco",
];

export default function ExerciseFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [zone, setZone] = useState(searchParams.get("zone") ?? "");
  const [level, setLevel] = useState(searchParams.get("level") ?? "");
  const [material, setMaterial] = useState(searchParams.get("material") ?? "");

  function apply() {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (zone) params.set("zone", zone);
    if (level) params.set("level", level);
    if (material) params.set("material", material);
    router.push(`/exercises?${params.toString()}`);
  }

  function clear() {
    setSearch("");
    setZone("");
    setLevel("");
    setMaterial("");
    router.push("/exercises");
  }

  return (
    <div className="mb-6 space-y-3">
      <div className="flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && apply()}
          className="flex-1 min-w-[200px] rounded-lg border px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
        />
        <select
          value={zone}
          onChange={(e) => setZone(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
        >
          <option value="">Zona</option>
          {ZONES.map((z) => (
            <option key={z} value={z}>{z}</option>
          ))}
        </select>
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
        >
          <option value="">Nivel</option>
          {LEVELS.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
        <select
          value={material}
          onChange={(e) => setMaterial(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
        >
          <option value="">Material</option>
          {MATERIALS.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>
      <div className="flex gap-2">
        <button
          onClick={apply}
          className="rounded-lg bg-zinc-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Filtrar
        </button>
        <button
          onClick={clear}
          className="rounded-lg border px-4 py-1.5 text-sm text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-900"
        >
          Limpiar
        </button>
      </div>
    </div>
  );
}

