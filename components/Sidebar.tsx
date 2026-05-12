"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const links = [
  { href: "/exercises", label: "Ejercicios", icon: "🏋️" },
  { href: "/workouts", label: "Entrenos", icon: "📋" },
];

const SIDEBAR_W = 224; // w-56 = 14rem = 224px

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createBrowserClient();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  const navContent = (
    <>
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
    </>
  );

  return (
    <>
      {/* Desktop sidebar — always visible */}
      <aside className="hidden md:flex w-56 flex-col border-r bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
        {navContent}
      </aside>

      {/* Mobile hamburger */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed top-3 left-3 z-50 flex h-10 w-10 items-center justify-center rounded-lg border bg-white text-lg shadow-sm md:hidden dark:border-zinc-700 dark:bg-zinc-900"
        >
          ☰
        </button>
      )}

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/30 md:hidden"
              onClick={() => setOpen(false)}
            />

            {/* Drawer */}
            <motion.aside
              key="drawer"
              initial={{ x: -SIDEBAR_W }}
              animate={{ x: 0 }}
              exit={{ x: -SIDEBAR_W }}
              transition={{ type: "spring", damping: 26, stiffness: 300 }}
              drag="x"
              dragConstraints={{ left: -SIDEBAR_W, right: 0 }}
              dragElastic={0.05}
              onDragEnd={(_e, info) => {
                if (info.offset.x < -60 || info.velocity.x < -300) {
                  setOpen(false);
                }
              }}
              className="fixed inset-y-0 left-0 z-50 flex w-56 flex-col border-r bg-white p-4 shadow-xl md:hidden dark:border-zinc-800 dark:bg-zinc-950"
              style={{ touchAction: "pan-y" }}
            >
              {navContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
