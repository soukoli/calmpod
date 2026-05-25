"use client";

import { CurrencyCircleDollar, MapPin, Lightning } from "@phosphor-icons/react";
import { SectionWrapper, Badge, Card, RevealOnScroll } from "@/components/ui";
import type { Translations } from "@/lib/types";

interface HowItWorksProps {
  t: Translations;
}

const stepIcons = [CurrencyCircleDollar, MapPin, Lightning];

export function HowItWorks({ t }: HowItWorksProps) {
  return (
    <SectionWrapper id="how-it-works" className="py-24">
      <RevealOnScroll>
        <div className="text-center mb-14">
          <Badge className="mb-4">{t.howItWorks.tag}</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            {t.howItWorks.headline}
          </h2>
        </div>
      </RevealOnScroll>

      <div className="grid md:grid-cols-3 gap-4">
        {t.howItWorks.steps.map((step, i) => {
          const Icon = stepIcons[i];
          return (
            <RevealOnScroll key={i} delay={i * 0.1}>
              <Card className="p-6 h-full">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-black text-white/10">
                    {step.num}
                  </span>
                  <div className="w-11 h-11 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                    <Icon size={22} weight="light" className="text-violet-300" />
                  </div>
                </div>
                <h3 className="text-base font-semibold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {step.text}
                </p>
              </Card>
            </RevealOnScroll>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
