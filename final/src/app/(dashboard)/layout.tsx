// src/app/(dashboard)/layout.tsx
import { redirect }     from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfile }   from "@/lib/queries/profile";
import { Sidebar }      from "@/components/layout/Sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const profile = await getProfile();
  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-gray-950">
      <Sidebar profile={profile} />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">{children}</div>
    </div>
  );
}
