"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Read current theme from html class or cookie
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = async () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);

    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Persist to document.cookie directly for instant next page render
    document.cookie = `theme_preference=${nextTheme}; path=/; max-age=31536000; SameSite=Lax`;

    // Persist via server API route
    try {
      await fetch("/api/preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: nextTheme }),
      });
    } catch (e) {
      console.error("Failed to persist theme preference:", e);
    }
  };

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-xl border border-[#E8D1C5] dark:border-[#57595B] bg-[#F3E8DF] dark:bg-[#3b2324]" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      title={`Switch to ${theme === "dark" ? "Light" : "Dark"} mode`}
      aria-label="Toggle theme"
      className="relative flex items-center justify-center w-9 h-9 rounded-xl border border-[#E8D1C5] dark:border-[#57595B] bg-white dark:bg-[#3b2324] text-[#452829] dark:text-[#F3E8DF] hover:bg-[#E8D1C5]/30 dark:hover:bg-[#57595B]/40 transition-all shadow-sm"
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-[#E8D1C5] transition-transform hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-[#452829] transition-transform hover:-rotate-12" />
      )}
    </button>
  );
}
