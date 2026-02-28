import { cn } from "@/lib/utils";

interface MarqueeRowProps {
  children: React.ReactNode;
  reverse?: boolean;
  className?: string;
  speed?: "slow" | "normal" | "fast";
  pauseOnHover?: boolean;
}

export function MarqueeRow({
  children,
  reverse = false,
  className,
  speed = "normal",
  pauseOnHover = true,
}: MarqueeRowProps) {
  const durations: Record<string, string> = {
    slow: "50s",
    normal: "35s",
    fast: "18s",
  };

  return (
    <div
      className={cn(
        "flex overflow-hidden",
        "[mask-image:linear-gradient(to_right,transparent_0%,white_8%,white_92%,transparent_100%)]",
        className
      )}
    >
      <div
        className={cn(
          "flex min-w-full shrink-0 gap-4",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
        style={{
          animation: `${reverse ? "marquee-right" : "marquee-left"} ${durations[speed]} linear infinite`,
        }}
      >
        <div className="flex shrink-0 gap-4">{children}</div>
        <div className="flex shrink-0 gap-4" aria-hidden="true">{children}</div>
      </div>
    </div>
  );
}
