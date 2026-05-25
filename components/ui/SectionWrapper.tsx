import { type ReactNode } from "react";

interface SectionWrapperProps {
  children: ReactNode;
  id?: string;
  className?: string;
}

export function SectionWrapper({ children, id, className = "" }: SectionWrapperProps) {
  return (
    <section id={id} className={`relative px-6 overflow-hidden ${className}`}>
      <div className="max-w-6xl mx-auto">{children}</div>
    </section>
  );
}
