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
    <div className="flex h-screen overflow-hidden bg-[#030712] text-gray-50 selection:bg-indigo-500/30">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#4f46e512_1px,transparent_1px),linear-gradient(to_bottom,#4f46e512_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      {/* Background Neon Glowing Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none z-0" />

      <div className="relative z-10 flex h-full w-full">
        <Sidebar profile={profile} />
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto w-full">
          {children}
        </div>
      </div>
    </div>
  );
}
