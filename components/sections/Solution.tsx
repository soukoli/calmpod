"use client";

import Image from "next/image";
import { SectionWrapper, Badge, RevealOnScroll } from "@/components/ui";
import type { Translations } from "@/lib/types";

interface SolutionProps {
  t: Translations;
}

export function Solution({ t }: SolutionProps) {
  return (
    <SectionWrapper className="py-24">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <RevealOnScroll>
          <div>
            <Badge className="mb-4">{t.solution.tag}</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-5">
              {t.solution.headline}
            </h2>
            <p className="text-slate-300 text-base leading-relaxed">
              {t.solution.text}
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.15}>
          <div className="relative rounded-xl overflow-hidden border border-white/10">
            <Image
              src="/02.jpg"
              alt="CalmPod"
              width={600}
              height={400}
              className="w-full h-[280px] md:h-[340px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            {/* Badge overlay */}
            <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-4 py-2">
              <div className="font-bold text-white text-lg">{t.solution.badge}</div>
              <div className="text-slate-300 text-xs">{t.solution.badgeSub}</div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </SectionWrapper>
  );
}
