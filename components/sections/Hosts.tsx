"use client";

import Image from "next/image";
import { Check } from "@phosphor-icons/react";
import { SectionWrapper, Badge, Button, RevealOnScroll } from "@/components/ui";
import type { Translations } from "@/lib/types";

interface HostsProps {
  t: Translations;
}

export function Hosts({ t }: HostsProps) {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <SectionWrapper id="hosts" className="py-24">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <RevealOnScroll>
          <div className="relative rounded-xl overflow-hidden border border-white/10">
            <Image
              src="/03.jpg"
              alt="CalmPod host location"
              width={600}
              height={400}
              className="w-full h-[280px] md:h-[340px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.15}>
          <div>
            <Badge className="mb-4">{t.hosts.tag}</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-5">
              {t.hosts.headline}
            </h2>
            <p className="text-slate-300 text-base leading-relaxed mb-6">
              {t.hosts.text}
            </p>

            <ul className="space-y-3 mb-8">
              {t.hosts.perks.map((perk, i) => (
                <li key={i} className="flex items-center gap-2.5 text-slate-300 text-sm">
                  <div className="w-5 h-5 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                    <Check size={10} weight="bold" className="text-violet-300" />
                  </div>
                  {perk}
                </li>
              ))}
            </ul>

            <Button variant="primary" size="lg" onClick={() => scrollTo("waitlist")}>
              {t.hosts.cta}
            </Button>
          </div>
        </RevealOnScroll>
      </div>
    </SectionWrapper>
  );
}
