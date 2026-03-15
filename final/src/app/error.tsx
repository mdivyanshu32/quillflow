// ─── app/error.tsx ────────────────────────────────────────────────────────────
// Global error boundary — catches unhandled runtime errors in the React tree.
// "use client" is required by Next.js for error.tsx.
'use client'

import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="max-w-md w-full text-center space-y-4">
        <p className="text-6xl font-semibold text-gray-800 dark:text-gray-200">
          404
        </p>

        <h1 className="text-xl font-medium text-gray-700 dark:text-gray-300">
          Page not found
        </h1>

        <Link
          href="/"
          className="inline-block px-4 py-2 bg-black text-white rounded-md"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}