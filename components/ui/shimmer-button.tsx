"use client";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ShimmerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  variant?: "primary" | "outline";
}

export const ShimmerButton = forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  ({ children, className, variant = "primary", disabled, ...props }, ref) => {
    if (variant === "outline") {
      return (
        <button
          ref={ref}
          disabled={disabled}
          className={cn(
            "relative inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3",
            "border-2 border-violet-600 text-violet-700 font-semibold text-sm",
            "hover:bg-violet-50 active:scale-[0.98] transition-all duration-200",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            className
          )}
          {...props}
        >
          {children}
        </button>
      );
    }

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 overflow-hidden",
          "rounded-xl px-6 py-3 font-semibold text-white text-sm",
          "bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-600",
          "shadow-lg shadow-violet-200/60",
          "hover:shadow-xl hover:shadow-violet-300/60 hover:scale-[1.02]",
          "active:scale-[0.98] transition-all duration-200",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
          className
        )}
        {...props}
      >
        <span
          className="shimmer-shine absolute inset-0 rounded-xl"
          aria-hidden="true"
        />
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </button>
    );
  }
);
ShimmerButton.displayName = "ShimmerButton";
