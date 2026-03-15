// hooks/useSession.ts
"use client";

import { useEffect, useState } from "react";
import { useRouter }           from "next/navigation";
import { createClient }        from "@/lib/supabase/client";
import type { User }           from "@supabase/supabase-js";

export function useSession() {
  const router   = useRouter();
  const supabase = createClient();
  const [user, setUser]       = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // Live auth state changes (sign-in, sign-out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        router.refresh(); // re-run all Server Component fetches
      }
    );

    return () => subscription.unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { user, loading };
}
