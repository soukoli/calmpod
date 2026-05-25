import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white/5 backdrop-blur-md border border-white/10 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-lg hover:shadow-violet-500/5",
        className
      )}
    >
      {children}
    </div>
  );
}
