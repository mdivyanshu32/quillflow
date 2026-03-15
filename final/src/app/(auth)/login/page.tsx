// src/app/(auth)/login/page.tsx
"use client";

import Link          from "next/link";
import { useState }  from "react";
import { useRouter } from "next/navigation";
import { Input }     from "@/components/ui/Input";
import { Button }    from "@/components/ui/Button";
import { toast }     from "@/components/ui/Toaster";
import { signIn }    from "@/lib/actions/auth";
import type { Metadata } from "next";

export default function LoginPage() {
  const router = useRouter();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [errors,   setErrors]   = useState<Record<string, string>>({});
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!email)    errs.email    = "Email is required";
    if (!password) errs.password = "Password is required";
    if (email && !/\S+@\S+\.\S+/.test(email)) errs.email = "Enter a valid email";
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    const fd = new FormData();
    fd.set("email", email); fd.set("password", password);
    const result = await signIn(fd);
    setLoading(false);

    if (result?.error) {
      toast.error(result.error);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="flex items-center justify-center gap-2 mb-8">
        <div className="h-8 w-8 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center">
          <svg className="h-4 w-4 text-white dark:text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
          </svg>
        </div>
        <span className="font-semibold text-gray-900 dark:text-gray-100">Quillflow</span>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">Sign in</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Welcome back — enter your credentials to continue.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input label="Email address" type="email" placeholder="you@company.com"
            value={email} onChange={e => setEmail(e.target.value)}
            error={errors.email} autoComplete="email" required />
          <div>
            <Input label="Password" type="password" placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)}
              error={errors.password} autoComplete="current-password" required />
            <div className="mt-1.5 text-right">
              <Link href="/forgot-password" className="text-xs text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                Forgot password?
              </Link>
            </div>
          </div>
          <Button type="submit" variant="primary" size="md" className="w-full" isLoading={loading}>
            Sign in
          </Button>
        </form>
      </div>
      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
        Don't have an account?{" "}
        <Link href="/register" className="text-gray-900 dark:text-gray-100 font-medium hover:underline">
          Create one free
        </Link>
      </p>
    </div>
  );
}
