import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

export function Badge({ children, className = "" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-md border px-2.5 py-0.5 text-xs font-medium",
        "bg-violet-500/20 text-violet-300 border-violet-500/30 backdrop-blur-sm",
        className
      )}
    >
      {children}
    </span>
  );
}
