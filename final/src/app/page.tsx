import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#030712] text-gray-50 overflow-hidden font-sans selection:bg-indigo-500/30">
      
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e512_1px,transparent_1px),linear-gradient(to_bottom,#4f46e512_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_10%,#000_60%,transparent_100%)] pointer-events-none" />
      
      {/* Background Neon Glowing Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />

      {/* Modern NavBar */}
      <nav className="relative z-50 border-b border-white/5 bg-black/40 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
              <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="square" strokeLinejoin="miter" d="M12 2L2 7l10 5 10-5-10-5zm0 20l-10-5m10 5l10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-widest text-indigo-100 uppercase">
              QuillFlow
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-mono text-gray-400 hover:text-white transition-colors">
              [ ACCESS_NODE ]
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-32 flex flex-col lg:flex-row items-center gap-16 lg:gap-8 min-h-[calc(100vh-4rem)]">
        
        {/* Left Content (Text) */}
        <div className="flex-1 text-center lg:text-left pt-12 lg:pt-0">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-white/5 border border-white/10 text-cyan-400 text-xs font-mono mb-8 uppercase tracking-widest shadow-[0_0_15px_rgba(34,211,238,0.1)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            System Online • v2.0
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-8 leading-[1.15] text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            Command Center <br/>
            for <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400">Content Ops.</span>
          </h1>

          <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
            QuillFlow is an autonomous execution environment for high-volume content agencies. Centralize client data, streamline editorial pipelines, and deploy content at unprecedented scale.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5">
            <Button asChild variant="primary" size="lg" className="w-full sm:w-auto h-14 px-8 bg-indigo-600 hover:bg-indigo-500 text-white font-mono uppercase tracking-wider text-sm shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all animate-pulse-glow border-none">
              <Link href="/register">Initialize Workspace {"->"}</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 bg-transparent text-gray-300 border-gray-700 hover:border-gray-500 hover:bg-white/5 font-mono uppercase tracking-wider text-sm">
              <Link href="/login">Authenticate Link</Link>
            </Button>
          </div>
        </div>

        {/* Right Content (Floating UI / Robotic Mockups) */}
        <div className="flex-1 w-full relative h-[500px] lg:h-[600px] pointer-events-none perspective-1000">
          
          {/* Main Console Panel */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[480px] h-[340px] bg-black/60 backdrop-blur-3xl border border-white/10 rounded-xl shadow-2xl shadow-indigo-500/10 animate-float-delayed flex flex-col overflow-hidden">
            {/* Window Header */}
            <div className="h-10 border-b border-white/10 flex items-center px-4 justify-between bg-white/[0.02]">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
              </div>
              <span className="text-[10px] text-gray-500 font-mono">QFLW_KERNEL_PROC</span>
            </div>
            {/* Terminal Body */}
            <div className="p-6 font-mono text-xs text-gray-400 flex flex-col gap-2">
              <div className="flex justify-between items-center text-indigo-400 border-b border-white/5 pb-2 mb-2">
                <span>[ACT_SYNC_NODE]</span>
                <span className="text-[10px]">ms: 12.04</span>
              </div>
              <div className="flex gap-4 items-center">
                <span className="text-cyan-400">#</span>
                <span className="w-full h-1 bg-white/5 rounded"><div className="h-full bg-indigo-500 w-3/4 rounded animate-pulse" /></span>
              </div>
              <div className="text-green-400 mt-2">{"> "} ESTABLISHING SECURE HANDSHAKE...</div>
              <div className="text-gray-500 mt-1">{"> "} REPLICATING DATA SHARDS [14/14]</div>
              <div className="text-gray-500 mt-1">{"> "} MOUNTING EDITORIAL VOLUME: OK</div>
              <div className="mt-4 flex items-end justify-between h-20 text-cyan-500 opacity-50">
                <div className="w-4 bg-cyan-500/20 h-full border-t border-cyan-400"></div>
                <div className="w-4 bg-cyan-500/20 h-[80%] border-t border-cyan-400"></div>
                <div className="w-4 bg-cyan-500/20 h-[60%] border-t border-cyan-400"></div>
                <div className="w-4 bg-cyan-500/20 h-[90%] border-t border-cyan-400"></div>
                <div className="w-4 bg-cyan-500/20 h-[40%] border-t border-cyan-400"></div>
                <div className="w-4 bg-cyan-500/20 h-[70%] border-t border-cyan-400 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Floating Widget 1 */}
          <div className="absolute top-[10%] -right-4 lg:-right-8 w-48 bg-[#0a0f1c]/80 backdrop-blur-xl border border-indigo-500/30 rounded-lg p-4 shadow-[0_0_30px_rgba(79,70,229,0.15)] animate-float z-20">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-mono text-indigo-300 uppercase">Throughput</span>
              <svg className="w-4 h-4 text-indigo-400 animate-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-white tracking-widest">94.2<span className="text-xs text-indigo-400 ml-1">GB/s</span></div>
            <div className="mt-2 w-full bg-white/5 h-0.5 rounded-full overflow-hidden">
              <div className="w-full bg-indigo-400 h-full" style={{ transform: "translateX(-20%)" }} />
            </div>
          </div>

          {/* Floating Widget 2 */}
          <div className="absolute bottom-[15%] -left-4 w-56 bg-black/80 backdrop-blur-xl border border-cyan-500/30 rounded-lg p-4 shadow-[0_0_30px_rgba(34,211,238,0.1)] animate-float z-20" style={{ animationDelay: '1.5s' }}>
             <div className="flex gap-3 items-center">
              <div className="relative flex h-10 w-10">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-20"></span>
                <div className="relative flex h-full w-full rounded-full bg-cyan-500/20 border border-cyan-400 items-center justify-center">
                  <span className="block w-2 h-2 bg-cyan-400 rounded-full"></span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-gray-500">NET_STATUS</span>
                <span className="text-sm font-bold text-cyan-400 tracking-wider">SECURE LINK</span>
              </div>
             </div>
          </div>

          {/* Background Crosshairs */}
          <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 border border-white/5 rounded-full pointer-events-none border-dashed animate-spin-slow" style={{ animationDuration: '40s' }} />
          <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2 border border-indigo-500/10 rounded-full pointer-events-none border-dashed animate-spin-slow" style={{ animationDuration: '30s', animationDirection: 'reverse' }} />
        </div>

      </main>

      {/* Cyber Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-black/40 py-6">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-between items-center flex-col sm:flex-row gap-4">
          <p className="font-mono text-[10px] text-gray-600 tracking-widest">
            UUID: 0x828fa-4af822f49dd1 // VER: 2.4.9
          </p>
          <div className="flex gap-4">
            <div className="h-1 w-1 bg-gray-700 rounded-full"></div>
            <div className="h-1 w-1 bg-gray-700 rounded-full"></div>
            <div className="h-1 w-1 bg-indigo-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </footer>
    </div>
  );
}