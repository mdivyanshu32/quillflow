// src/app/(auth)/register/page.tsx
"use client";

import Link          from "next/link";
import { useState }  from "react";
import { useRouter } from "next/navigation";
import { Input }     from "@/components/ui/Input";
import { Button }    from "@/components/ui/Button";
import { toast }     from "@/components/ui/Toaster";
import { signUp }    from "@/lib/actions/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [form,    setForm]    = useState({ full_name: "", email: "", password: "", confirm: "" });
  const [errors,  setErrors]  = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.full_name) errs.full_name = "Name is required";
    if (!form.email)     errs.email     = "Email is required";
    if (form.password.length < 8) errs.password = "At least 8 characters";
    if (form.password !== form.confirm) errs.confirm = "Passwords do not match";
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.set(k, v));
    const result = await signUp(fd);
    setLoading(false);

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success(result.success ?? "Account created! Check your email.");
      router.push("/login");
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
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">Create account</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Start ordering professional content today.</p>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input label="Full name" placeholder="Alice Johnson"
            value={form.full_name} onChange={e => set("full_name", e.target.value)}
            error={errors.full_name} required />
          <Input label="Email address" type="email" placeholder="you@company.com"
            value={form.email} onChange={e => set("email", e.target.value)}
            error={errors.email} required />
          <Input label="Password" type="password" placeholder="Min 8 characters"
            value={form.password} onChange={e => set("password", e.target.value)}
            error={errors.password} helperText="At least 8 characters" required />
          <Input label="Confirm password" type="password" placeholder="Repeat your password"
            value={form.confirm} onChange={e => set("confirm", e.target.value)}
            error={errors.confirm} required />
          <Button type="submit" variant="primary" size="md" className="w-full" isLoading={loading}>
            Create account
          </Button>
        </form>
      </div>
      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
        Already have an account?{" "}
        <Link href="/login" className="text-gray-900 dark:text-gray-100 font-medium hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
