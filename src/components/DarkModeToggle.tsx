// src/components/DarkModeToggle.tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="dark-light-button uppercase px-4 py-2 font-mono text-sm border border-base-700 dark:border-base-100 hover:opacity-80"
    >
      {theme === "dark" ? "LIGHT" : "DARK"}
    </button>
  );
}