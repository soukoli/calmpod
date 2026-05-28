"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { SectionWrapper, Badge, Card, RevealOnScroll, Counter } from "@/components/ui";
import type { Translations } from "@/lib/types";

interface FutureNetworkProps {
  t: Translations;
}

// --- Constellation data (star/hub topology) ---

interface Node {
  id: string;
  x: number;
  y: number;
  size: number;
  type: "hub" | "satellite";
  delay: number;
}

interface Edge {
  from: string;
  to: string;
  type: "hub" | "spoke" | "cross";
  delay: number;
}

function generateConstellation(): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Hub A — larger city (left)
  const hubA = { id: "hubA", x: 200, y: 220, size: 6, type: "hub" as const, delay: 0 };

  // Hub B — medium city (right)
  const hubB = { id: "hubB", x: 580, y: 240, size: 5.5, type: "hub" as const, delay: 0.9 };

  // Hub C — smaller town (center-bottom)
  const hubC = { id: "hubC", x: 400, y: 330, size: 4.5, type: "hub" as const, delay: 1.6 };

  nodes.push(hubA, hubB, hubC);

  // Hub connections
  edges.push({ from: "hubA", to: "hubB", type: "hub", delay: 1.8 });
  edges.push({ from: "hubA", to: "hubC", type: "hub", delay: 2.0 });
  edges.push({ from: "hubB", to: "hubC", type: "hub", delay: 2.2 });

  // Generate satellites around a hub
  const addSatellites = (
    hubId: string,
    cx: number,
    cy: number,
    count: number,
    radius: number,
    baseDelay: number
  ) => {
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      const r = radius * (0.5 + Math.random() * 0.6);
      const id = `${hubId}_s${i}`;
      nodes.push({
        id,
        x: cx + Math.cos(angle) * r,
        y: cy + Math.sin(angle) * r,
        size: 1.5 + Math.random() * 2,
        type: "satellite",
        delay: baseDelay + i * 0.04,
      });
      edges.push({ from: hubId, to: id, type: "spoke", delay: baseDelay + 0.05 + i * 0.04 });
    }
  };

  // Satellites: Hub A = 18, Hub B = 16, Hub C = 12 (total: 46 satellites + 3 hubs = 49+ nodes)
  addSatellites("hubA", 200, 220, 18, 140, 0.15);
  addSatellites("hubB", 580, 240, 16, 130, 1.0);
  addSatellites("hubC", 400, 330, 14, 110, 1.7);

  // Cross connections (links between satellite groups — showing network effect)
  edges.push({ from: "hubA_s2", to: "hubC_s0", type: "cross", delay: 2.3 });
  edges.push({ from: "hubA_s5", to: "hubC_s4", type: "cross", delay: 2.4 });
  edges.push({ from: "hubB_s1", to: "hubC_s8", type: "cross", delay: 2.5 });
  edges.push({ from: "hubB_s10", to: "hubA_s12", type: "cross", delay: 2.6 });
  edges.push({ from: "hubA_s8", to: "hubB_s5", type: "cross", delay: 2.7 });

  return { nodes, edges };
}

// Pre-generate is done inside component to avoid hydration mismatch

function getNodePos(nodes: Node[], id: string) {
  const node = nodes.find((n) => n.id === id);
  return node ? { x: node.x, y: node.y } : { x: 0, y: 0 };
}

// --- Constellation SVG Component ---

function ConstellationSVG() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  // Generate only on client after mount (avoids hydration mismatch from Math.random)
  const [constellation, setConstellation] = useState<{
    nodes: Node[];
    edges: Edge[];
  } | null>(null);

  useEffect(() => {
    setConstellation(generateConstellation());
  }, []);

  if (!constellation) {
    return <div ref={ref} className="relative w-full h-64 md:h-80" />;
  }

  const { nodes, edges } = constellation;

  return (
    <div ref={ref} className="relative w-full h-64 md:h-80">
      <svg
        viewBox="0 0 800 440"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Glow filter */}
        <defs>
          <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="hubGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Edges */}
        {edges.map((edge, i) => {
          const from = getNodePos(nodes, edge.from);
          const to = getNodePos(nodes, edge.to);
          const opacity = edge.type === "hub" ? 0.5 : edge.type === "spoke" ? 0.35 : 0.2;
          const width = edge.type === "hub" ? 1.8 : edge.type === "spoke" ? 1.2 : 0.8;

          return (
            <motion.line
              key={`edge-${i}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="rgb(139, 92, 246)"
              strokeOpacity={opacity}
              strokeWidth={width}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
              transition={{
                duration: 0.8,
                delay: edge.delay,
                ease: "easeOut",
              }}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => (
          <motion.g key={node.id}>
            {/* Outer glow */}
            <motion.circle
              cx={node.x}
              cy={node.y}
              r={node.size * 2.5}
              fill="rgb(139, 92, 246)"
              opacity={0}
              filter={node.type === "hub" ? "url(#hubGlow)" : "url(#nodeGlow)"}
              initial={{ scale: 0, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: node.type === "hub" ? 0.15 : 0.08 } : {}}
              transition={{
                type: "spring",
                stiffness: 150,
                damping: 12,
                delay: node.delay,
              }}
            />
            {/* Core */}
            <motion.circle
              cx={node.x}
              cy={node.y}
              r={node.size}
              fill="rgb(139, 92, 246)"
              initial={{ scale: 0, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: node.type === "hub" ? 0.95 : 0.75 } : {}}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: node.delay,
              }}
            />
          </motion.g>
        ))}

        {/* Hub pulse rings (infinite, after initial reveal) */}
        {nodes
          .filter((n) => n.type === "hub")
          .map((node) => (
            <motion.circle
              key={`pulse-${node.id}`}
              cx={node.x}
              cy={node.y}
              r={node.size}
              fill="none"
              stroke="rgb(139, 92, 246)"
              strokeWidth={1}
              initial={{ scale: 1, opacity: 0 }}
              animate={
                isInView
                  ? {
                      scale: [1, 3],
                      opacity: [0.5, 0],
                    }
                  : {}
              }
              transition={{
                duration: 2.5,
                delay: node.delay + 1,
                repeat: Infinity,
                repeatDelay: 2,
                ease: "easeOut",
              }}
            />
          ))}
      </svg>
    </div>
  );
}

// --- Section Component ---

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

      {/* Constellation visualization */}
      <Card className="overflow-hidden mb-10">
        <ConstellationSVG />
      </Card>

      {/* Counter + text */}
      <RevealOnScroll delay={0.2}>
        <div className="text-center space-y-4">
          <div className="flex items-baseline justify-center gap-2">
            <Counter
              target={50}
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
