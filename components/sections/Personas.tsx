"use client";

import type { Icon as PhosphorIcon } from "@phosphor-icons/react";
import {
  PaintBrush,
  Code,
  BookOpen,
  Heart,
  UsersThree,
  Chalkboard,
  Compass,
  Laptop,
} from "@phosphor-icons/react";
import { SectionWrapper, Badge, Card, RevealOnScroll } from "@/components/ui";
import type { Translations } from "@/lib/types";

interface PersonasProps {
  t: Translations;
}

const iconMap: Record<string, PhosphorIcon> = {
  PaintBrush,
  Code,
  BookOpen,
  Heart,
  UsersThree,
  Chalkboard,
  Compass,
  Laptop,
};

export function Personas({ t }: PersonasProps) {
  return (
    <SectionWrapper id="personas" className="py-24">
      <RevealOnScroll>
        <div className="text-center mb-14">
          <Badge className="mb-4">{t.personas.tag}</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-white max-w-2xl mx-auto leading-tight">
            {t.personas.headline}
          </h2>
          <p className="text-slate-400 mt-4 max-w-xl mx-auto text-base">
            {t.personas.sub}
          </p>
        </div>
      </RevealOnScroll>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {t.personas.personas.map((persona, i) => {
          const Icon = iconMap[persona.icon] || Laptop;
          return (
            <RevealOnScroll key={i} delay={i * 0.05}>
              <Card className="p-5 h-full">
                <div className="w-11 h-11 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4">
                  <Icon size={22} weight="light" className="text-violet-300" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">
                  {persona.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {persona.description}
                </p>
              </Card>
            </RevealOnScroll>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
