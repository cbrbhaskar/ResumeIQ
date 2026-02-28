"use client";
import { LineChart, Line, ResponsiveContainer, Tooltip, YAxis } from "recharts";
import { cn } from "@/lib/utils";

interface MiniSparklineProps {
  data: Array<{ score: number }>;
  className?: string;
}

export function MiniSparkline({ data, className }: MiniSparklineProps) {
  if (!data || data.length < 2) return null;

  const min = Math.max(0, Math.min(...data.map((d) => d.score)) - 10);
  const max = Math.min(100, Math.max(...data.map((d) => d.score)) + 10);

  return (
    <div className={cn("w-full", className)}>
      <ResponsiveContainer width="100%" height={80}>
        <LineChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 4 }}>
          <YAxis domain={[min, max]} hide />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#7c3aed"
            strokeWidth={2.5}
            dot={{ fill: "#7c3aed", r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: "#7c3aed", strokeWidth: 2, stroke: "#fff" }}
          />
          <Tooltip
            contentStyle={{
              fontSize: 12,
              borderRadius: 10,
              border: "1px solid #ede9fe",
              boxShadow: "0 4px 12px rgba(124,58,237,0.1)",
              padding: "6px 10px",
            }}
            formatter={(v: number) => [`${v}/100`, "Score"]}
            labelFormatter={() => ""}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
