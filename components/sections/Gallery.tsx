"use client";

import Image from "next/image";
import { SectionWrapper, Badge, RevealOnScroll } from "@/components/ui";
import type { Translations } from "@/lib/types";

interface GalleryProps {
  t: Translations;
}

const images = [
  { src: "/01.jpg", alt: "CalmPod workspace in nature" },
  { src: "/02.jpg", alt: "CalmPod creative space" },
  { src: "/03.jpg", alt: "CalmPod pod exterior" },
  { src: "/04.jpg", alt: "CalmPod focus environment" },
];

export function Gallery({ t }: GalleryProps) {
  return (
    <SectionWrapper id="gallery" className="py-24">
      <RevealOnScroll>
        <div className="text-center mb-14">
          <Badge className="mb-4">{t.gallery.tag}</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            {t.gallery.headline}
          </h2>
          <p className="text-slate-400 max-w-md mx-auto text-sm leading-relaxed">
            {t.gallery.sub}
          </p>
        </div>
      </RevealOnScroll>

      <RevealOnScroll delay={0.1}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[180px]">
          {images.map((img, i) => (
            <div
              key={i}
              className={`relative rounded-xl overflow-hidden border border-white/10 group ${
                i === 0 ? "col-span-2 row-span-2" : ""
              } ${i === 0 ? "auto-rows-[370px]" : ""}`}
              style={i === 0 ? { height: "370px" } : undefined}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes={i === 0 ? "(max-width: 768px) 100vw, 58vw" : "(max-width: 768px) 50vw, 25vw"}
                className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </RevealOnScroll>
    </SectionWrapper>
  );
}
