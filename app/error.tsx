"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-6">
        <AlertTriangle className="w-8 h-8 text-red-500" />
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-3">
        Something went wrong
      </h1>
      <p className="text-gray-500 max-w-sm mb-8">
        An unexpected error occurred. Please try again.
      </p>

      <div className="flex items-center gap-3">
        <Button onClick={reset}>
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">
            <ArrowLeft className="w-4 h-4" />
            Go Home
          </Link>
        </Button>
      </div>

      {error.digest && (
        <p className="mt-6 text-xs text-gray-300">Error ID: {error.digest}</p>
      )}
    </div>
  );
}
