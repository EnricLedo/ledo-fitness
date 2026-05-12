"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase";
import { useState } from "react";

const links = [
  { href: "/exercises", label: "Ejercicios", icon: "🏋️" },
  { href: "/workouts", label: "Entrenos", icon: "📋" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createBrowserClient();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-3 left-3 z-50 flex h-10 w-10 items-center justify-center rounded-lg border bg-white text-lg shadow-sm md:hidden dark:border-zinc-700 dark:bg-zinc-900"
      >
        {open ? "✕" : "☰"}
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-56 flex-col border-r bg-white p-4 transition-transform dark:border-zinc-800 dark:bg-zinc-950 md:static md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <h2 className="mb-6 text-lg font-bold">Ledo Fitness</h2>

        <nav className="flex flex-1 flex-col gap-1">
          {links.map((l) => {
            const active = pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                    : "text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-900"
                }`}
              >
                <span>{l.icon}</span>
                {l.label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900"
        >
          🚪 Cerrar sesión
        </button>
      </aside>
    </>
  );
}

