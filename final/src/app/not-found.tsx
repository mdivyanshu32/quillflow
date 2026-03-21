"use client";
import Link         from "next/link";
import { Button }  from "@/components/ui/Button";


export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="max-w-md w-full text-center space-y-4">
        <p className="text-8xl font-semibold text-gray-100 dark:text-gray-900 select-none">
          404
        </p>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Page not found
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="pt-2">
          <Button variant="primary" size="md" asChild>
            <Link href="/dashboard">Back to dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
