import { cn } from "@/lib/utils";

interface MagicOrbsProps {
  className?: string;
  intensity?: "subtle" | "medium" | "strong";
}

export function MagicOrbs({ className, intensity = "medium" }: MagicOrbsProps) {
  const opacity = { subtle: 0.2, medium: 0.3, strong: 0.45 }[intensity];
  return (
    <div
      className={cn("absolute inset-0 overflow-hidden pointer-events-none select-none", className)}
      aria-hidden="true"
    >
      <div
        className="orb animate-orb-float"
        style={{
          width: 640,
          height: 640,
          background: "radial-gradient(circle at center, #7c3aed 0%, #4f46e5 60%, transparent 100%)",
          top: -220,
          left: -180,
          opacity,
          animationDelay: "0s",
        }}
      />
      <div
        className="orb animate-orb-float-slow"
        style={{
          width: 520,
          height: 520,
          background: "radial-gradient(circle at center, #06b6d4 0%, #4f46e5 60%, transparent 100%)",
          top: 80,
          right: -120,
          opacity: opacity * 0.85,
          animationDelay: "-5s",
        }}
      />
      <div
        className="orb animate-orb-float-slower"
        style={{
          width: 420,
          height: 420,
          background: "radial-gradient(circle at center, #7c3aed 0%, #06b6d4 60%, transparent 100%)",
          bottom: -80,
          left: "35%",
          opacity: opacity * 0.7,
          animationDelay: "-10s",
        }}
      />
    </div>
  );
}
