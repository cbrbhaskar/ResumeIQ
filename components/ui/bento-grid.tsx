import { cn } from "@/lib/utils";

interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
        "auto-rows-[160px]",
        className
      )}
    >
      {children}
    </div>
  );
}

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  colSpan?: 1 | 2 | 3 | 4;
  rowSpan?: 1 | 2;
}

export function BentoCard({
  children,
  className,
  colSpan = 1,
  rowSpan = 1,
}: BentoCardProps) {
  return (
    <div
      className={cn(
        "bento-card p-5 flex flex-col",
        colSpan === 2 && "lg:col-span-2",
        colSpan === 3 && "lg:col-span-3",
        colSpan === 4 && "lg:col-span-4",
        rowSpan === 2 && "row-span-2",
        className
      )}
    >
      {children}
    </div>
  );
}
