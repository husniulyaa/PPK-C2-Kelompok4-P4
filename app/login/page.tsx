"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed. Please check your credentials.");
      }

      // Success -> Redirect to dashboard
      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = () => {
    setEmail("student@university.ac.id");
    setPassword("password123");
  };

  return (
    <div className="min-h-screen bg-[#F3E8DF] dark:bg-[#2b191a] text-[#452829] dark:text-[#F3E8DF] flex flex-col justify-between p-4 sm:p-6 transition-colors">
      {/* Top Bar */}
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#452829] dark:bg-[#E8D1C5] flex items-center justify-center text-[#F3E8DF] dark:text-[#452829] shadow-md shadow-[#452829]/20">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="font-bold text-base text-[#452829] dark:text-[#F3E8DF]">
            Expense Tracker
          </span>
        </Link>
        <ThemeToggle />
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md mx-auto my-8">
        <div className="bg-white dark:bg-[#3b2324] rounded-3xl border border-[#E8D1C5] dark:border-[#57595B]/60 p-6 sm:p-8 shadow-fintech">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-[#452829] dark:text-[#F3E8DF]">
              Welcome Back
            </h1>
            <p className="text-xs text-[#57595B] dark:text-[#E8D1C5]/80 mt-1">
              Sign in to manage your student budget and expenses (US-02)
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-[#9c3c3a]/15 border border-[#9c3c3a]/30 flex items-start gap-2 text-[#9c3c3a] dark:text-[#c46461] text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#452829] dark:text-[#F3E8DF] mb-1.5">
                University Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#57595B]" />
                <input
                  type="email"
                  placeholder="student@university.ac.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-[#F3E8DF]/40 dark:bg-[#2b191a] border border-[#E8D1C5] dark:border-[#57595B] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#452829] dark:focus:ring-[#E8D1C5] text-[#452829] dark:text-[#F3E8DF] placeholder-[#57595B]/60 font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-[#452829] dark:text-[#F3E8DF]">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#57595B]" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-[#F3E8DF]/40 dark:bg-[#2b191a] border border-[#E8D1C5] dark:border-[#57595B] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#452829] dark:focus:ring-[#E8D1C5] text-[#452829] dark:text-[#F3E8DF]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-[#452829] hover:bg-[#5c3638] text-[#F3E8DF] dark:bg-[#E8D1C5] dark:hover:bg-[#dfc1b3] dark:text-[#452829] text-xs font-bold shadow-md shadow-[#452829]/20 transition-all flex items-center justify-center gap-1.5 active:scale-98"
            >
              <span>{loading ? "Authenticating..." : "Sign In to Dashboard"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Demo Helper Button */}
          <div className="mt-5 p-3.5 rounded-2xl bg-[#E8D1C5]/30 dark:bg-[#2b191a] border border-[#E8D1C5] dark:border-[#57595B]/50 text-center">
            <div className="text-[11px] text-[#57595B] dark:text-[#E8D1C5]/80">
              Testing for university assignment evaluation?
            </div>
            <button
              type="button"
              onClick={fillDemoAccount}
              className="mt-1 text-xs font-bold text-[#452829] dark:text-[#E8D1C5] hover:underline"
            >
              Auto-fill sample student account
            </button>
          </div>

          <div className="mt-6 text-center text-xs text-[#57595B] dark:text-[#E8D1C5]/80">
            Don&apos;t have an account yet?{" "}
            <Link
              href="/register"
              className="font-bold text-[#452829] dark:text-[#E8D1C5] hover:underline"
            >
              Create Account (US-01)
            </Link>
          </div>
        </div>
      </div>

      {/* Footer credits */}
      <div className="text-center text-[11px] text-[#57595B] dark:text-[#E8D1C5]/70 py-2">
        Software Engineering Practical Assignment • Team: Lintang, Hana, Nabkay, Sela
      </div>
    </div>
  );
}
