"use client";

import { getScoreColor, getScoreLabel } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ScoreGaugeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
}

export function ScoreGauge({ score, size = "lg", label, className }: ScoreGaugeProps) {
  const radius = size === "lg" ? 70 : size === "md" ? 50 : 35;
  const stroke = size === "lg" ? 10 : size === "md" ? 8 : 6;
  const circumference = 2 * Math.PI * radius;
  const halfCirc = circumference / 2;
  const offset = halfCirc - (score / 100) * halfCirc;

  const svgSize = (radius + stroke) * 2;
  const cx = svgSize / 2;
  const cy = svgSize / 2;

  const color =
    score >= 80 ? "#22c55e" : score >= 60 ? "#eab308" : score >= 40 ? "#f97316" : "#ef4444";

  const textSize = size === "lg" ? "text-4xl" : size === "md" ? "text-2xl" : "text-xl";
  const labelSize = size === "lg" ? "text-sm" : "text-xs";

  // Extra bottom clearance so arc stroke doesn't overlap the score text
  const extraBottom = size === "lg" ? 28 : size === "md" ? 22 : 18;

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="relative" style={{ width: svgSize, height: svgSize / 2 + stroke + extraBottom }}>
        <svg
          width={svgSize}
          height={svgSize / 2 + stroke}
          viewBox={`0 0 ${svgSize} ${svgSize / 2 + stroke}`}
          className="overflow-visible"
          style={{ display: "block" }}
        >
          {/* Background arc */}
          <path
            d={`M ${stroke / 2 + stroke} ${cy} A ${radius} ${radius} 0 0 1 ${svgSize - stroke / 2 - stroke} ${cy}`}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          {/* Score arc */}
          <path
            d={`M ${stroke / 2 + stroke} ${cy} A ${radius} ${radius} 0 0 1 ${svgSize - stroke / 2 - stroke} ${cy}`}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${halfCirc} ${halfCirc}`}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
            style={{ filter: `drop-shadow(0 2px 8px ${color}60)` }}
          />
        </svg>
        {/* Score text — positioned below the arc with room to breathe */}
        <div
          className="absolute left-0 right-0 flex flex-col items-center"
          style={{ bottom: 0 }}
        >
          <span className={cn("font-bold leading-none", textSize)} style={{ color }}>
            {score}
          </span>
          <span className={cn("text-gray-400 font-medium mt-0.5", labelSize)}>/ 100</span>
        </div>
      </div>
      <div className="text-center mt-1">
        <p className={cn("font-semibold", getScoreColor(score))}>{getScoreLabel(score)}</p>
        {label && <p className="text-xs text-gray-500 mt-0.5">{label}</p>}
      </div>
    </div>
  );
}
