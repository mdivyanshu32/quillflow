import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-gray-950 text-slate-900 dark:text-gray-50 overflow-hidden font-sans selection:bg-indigo-500/30">
      {/* Abstract Animated Background Gradients */}
      <div className="absolute top-0 -left-1/4 w-3/4 h-3/4 bg-indigo-500/20 dark:bg-indigo-600/20 blur-[140px] rounded-full mix-blend-multiply dark:mix-blend-screen pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-0 -right-1/4 w-2/3 h-2/3 bg-purple-500/20 dark:bg-purple-600/20 blur-[140px] rounded-full mix-blend-multiply dark:mix-blend-screen pointer-events-none" />

      {/* Modern NavBar */}
      <nav className="relative z-10 border-b border-slate-200/50 dark:border-gray-800/50 backdrop-blur-xl bg-white/70 dark:bg-gray-950/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              className="h-8 w-8 text-indigo-600 dark:text-indigo-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
            <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              QuillFlow
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
            >
              Log in
            </Link>
            <Button asChild variant="primary" size="sm" className="shadow-lg shadow-indigo-500/20 px-5">
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-32">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 text-sm font-medium mb-8 border border-indigo-100 dark:border-indigo-500/20">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-ping absolute opacity-75"></span>
            <span className="relative flex h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
            <span className="ml-2">Now in Public Beta</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-[1.1]">
            Scale your content agency <br className="hidden md:block" />
            with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-500">beautiful precision.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            QuillFlow is the complete operating system for content teams. Manage client orders, collaborate on drafts in real-time, and track your revenue—all in one elegant, lightning-fast dashboard.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild variant="primary" size="lg" className="w-full sm:w-auto text-base h-12 px-8 shadow-xl shadow-indigo-500/20 group">
              <Link href="/register">
                Start for free
                <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto text-base h-12 px-8 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md">
              <Link href="/login">Sign in to workspace</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Order Management",
              desc: "Track client submissions from ideation to delivery with intuitive kanban boards and progress indicators.",
              icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
            },
            {
              title: "Real-time Collaboration",
              desc: "Exchange live feedback and edit threads directly on orders with instant WebSocket-powered syncing.",
              icon: "M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z",
            },
            {
              title: "Client Transparency",
              desc: "Provide your external clients with beautiful, read-only tracking links to watch their content get crafted.",
              icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-8 rounded-3xl bg-white/60 dark:bg-gray-900/40 backdrop-blur-xl border border-slate-200/50 dark:border-gray-800/50 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mb-6 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d={feature.icon} />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-slate-600 dark:text-gray-400 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200/50 dark:border-gray-800/50 mt-12 py-12 text-center text-slate-500 dark:text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} QuillFlow. Crafted for premium content agencies.</p>
      </footer>
    </div>
  );
}