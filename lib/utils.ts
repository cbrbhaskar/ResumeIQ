import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Plan } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-500";
  if (score >= 60) return "text-yellow-500";
  if (score >= 40) return "text-orange-500";
  return "text-red-500";
}

export function getScoreBg(score: number): string {
  if (score >= 80) return "bg-green-500";
  if (score >= 60) return "bg-yellow-500";
  if (score >= 40) return "bg-orange-500";
  return "bg-red-500";
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Poor";
}

export function isPaidPlan(plan: Plan): boolean {
  return plan !== "free";
}

export function isTeamsPlan(plan: Plan): boolean {
  return plan === "teams_monthly" || plan === "teams_yearly";
}

export function getPlanDisplayName(plan: Plan): string {
  const names: Record<Plan, string> = {
    free: "Free",
    pro_monthly: "Pro",
    pro_yearly: "Pro",
    teams_monthly: "Teams",
    teams_yearly: "Teams",
  };
  return names[plan];
}

export function getScanLimit(plan: Plan): number {
  if (plan === "free") return 3;
  return Infinity;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function validateFile(file: File): { valid: boolean; error?: string } {
  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Invalid file type. Please upload a PDF or DOCX file.",
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: "File too large. Maximum size is 5MB.",
    };
  }

  return { valid: true };
}
