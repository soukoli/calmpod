"use client";

import { useRef, useEffect, useMemo } from "react";
import { useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { SectionWrapper, Badge, Card, RevealOnScroll, Counter } from "@/components/ui";
import type { Translations } from "@/lib/types";

interface FutureNetworkProps {
  t: Translations;
}

interface StarNode {
  x: number;
  y: number;
  size: number;
  brightness: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

function generateStars(count: number): StarNode[] {
  const stars: StarNode[] = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: 0.05 + Math.random() * 0.9,
      y: 0.05 + Math.random() * 0.9,
      size: 1.5 + Math.random() * 3, // 1.5px to 4.5px — random sizes
      brightness: 0.5 + Math.random() * 0.5,
      twinkleSpeed: 0.5 + Math.random() * 2,
      twinkleOffset: Math.random() * Math.PI * 2,
    });
  }
  return stars;
}

function MapVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const revealedRef = useRef(1);
  const animationRef = useRef<number>(0);

  const stars = useMemo(() => generateStars(50), []);

  // Scroll-driven reveal: as user scrolls through the section, more stars appear
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Map scroll progress [0.15, 0.6] to [1, 50] stars revealed
  const revealedCount = useTransform(scrollYProgress, [0.15, 0.65], [1, stars.length]);

  useMotionValueEvent(revealedCount, "change", (latest) => {
    revealedRef.current = Math.round(latest);
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let startTime = Date.now();

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
    };
    resize();

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const elapsed = (Date.now() - startTime) / 1000;
      const count = Math.max(1, Math.min(revealedRef.current, stars.length));

      ctx.clearRect(0, 0, w, h);

      // Draw connections between nearby revealed stars
      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          const dx = (stars[i].x - stars[j].x) * w;
          const dy = (stars[i].y - stars[j].y) * h;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < w * 0.15) {
            const alpha = 0.1 * (1 - dist / (w * 0.15));
            ctx.beginPath();
            ctx.moveTo(stars[i].x * w, stars[i].y * h);
            ctx.lineTo(stars[j].x * w, stars[j].y * h);
            ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw stars
      for (let i = 0; i < count; i++) {
        const star = stars[i];
        const x = star.x * w;
        const y = star.y * h;

        // Twinkle effect — subtle brightness oscillation
        const twinkle = 0.7 + 0.3 * Math.sin(elapsed * star.twinkleSpeed + star.twinkleOffset);
        const alpha = star.brightness * twinkle;

        // Outer glow
        ctx.beginPath();
        ctx.arc(x, y, star.size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 92, 246, ${alpha * 0.08})`;
        ctx.fill();

        // Inner glow
        ctx.beginPath();
        ctx.arc(x, y, star.size * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 92, 246, ${alpha * 0.2})`;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(x, y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 92, 246, ${alpha * 0.9})`;
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      resize();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [stars]);

  return (
    <div ref={sectionRef} className="relative w-full h-64 md:h-80">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}

export function FutureNetwork({ t }: FutureNetworkProps) {
  return (
    <SectionWrapper className="py-24">
      <RevealOnScroll>
        <div className="text-center mb-10">
          <Badge className="mb-4">{t.futureNetwork.tag}</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-white max-w-2xl mx-auto leading-tight">
            {t.futureNetwork.headline}
          </h2>
        </div>
      </RevealOnScroll>

      {/* Star map visualization in a Card */}
      <Card className="overflow-hidden mb-10">
        <MapVisualization />
      </Card>

      {/* Counter + text */}
      <RevealOnScroll delay={0.2}>
        <div className="text-center space-y-4">
          <div className="flex items-baseline justify-center gap-2">
            <Counter
              target={10}
              suffix="+"
              className="text-5xl md:text-6xl font-bold text-violet-400"
            />
            <span className="text-xl text-slate-400">{t.futureNetwork.counter}</span>
          </div>
          <p className="text-sm text-slate-500">{t.futureNetwork.counterSub}</p>
          <p className="text-base text-slate-300 max-w-2xl mx-auto leading-relaxed mt-6">
            {t.futureNetwork.text}
          </p>
        </div>
      </RevealOnScroll>
    </SectionWrapper>
  );
}
