import Link from "next/link";
import { BarChart2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 text-center">
      <Link href="/" className="flex items-center gap-2 mb-12 group">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
          <BarChart2 className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-gray-900">ResumeOps</span>
      </Link>

      <div className="mb-6">
        <p className="text-8xl font-bold text-gray-100">404</p>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-3">Page not found</h1>
      <p className="text-gray-500 max-w-sm mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      <Button asChild>
        <Link href="/">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </Button>
    </div>
  );
}
