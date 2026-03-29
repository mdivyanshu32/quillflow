// src/app/layout.tsx
import type { Metadata } from "next";
import { Toaster }       from "@/components/ui/Toaster";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default:  "Quillflow — Professional Content Writing",
    template: "%s | Quillflow",
  },
  description:
    "Order professional blog posts, website copy, whitepapers, and more from expert writers.",
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="bg-[#030712] text-gray-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
