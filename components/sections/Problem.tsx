"use client";

import { Car, House, Question } from "@phosphor-icons/react";
import { SectionWrapper, Badge, Card, RevealOnScroll } from "@/components/ui";
import type { Translations } from "@/lib/types";

interface ProblemProps {
  t: Translations;
}

const icons = [Car, House, Question];

export function Problem({ t }: ProblemProps) {
  return (
    <SectionWrapper className="py-24">
      <RevealOnScroll>
        <div className="text-center mb-14">
          <Badge className="mb-4">{t.problem.tag}</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-white max-w-2xl mx-auto leading-tight">
            {t.problem.headline}
          </h2>
        </div>
      </RevealOnScroll>

      <div className="grid md:grid-cols-3 gap-4">
        {t.problem.items.map((item, i) => {
          const Icon = icons[i];
          return (
            <RevealOnScroll key={i} delay={i * 0.1}>
              <Card className="p-6 h-full">
                <div className="w-11 h-11 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4">
                  <Icon size={22} weight="light" className="text-violet-300" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {item.text}
                </p>
              </Card>
            </RevealOnScroll>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
