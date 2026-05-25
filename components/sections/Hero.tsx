"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button, Badge, Card } from "@/components/ui";
import type { Translations } from "@/lib/types";

interface HeroProps {
  t: Translations;
}

export function Hero({ t }: HeroProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || sending) return;

    setSending(true);
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSubmitted(true);
    } catch {
      // Show success anyway — we don't want to block UX
      setSubmitted(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 pt-24 pb-16">
      <div className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
        {/* Left column — text + email */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-8"
        >
          <div className="space-y-5">
            <Badge>{t.hero.tag}</Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              {t.hero.headline}
            </h1>

            <p className="text-lg text-slate-300 leading-relaxed">
              {t.hero.sub}
            </p>
          </div>

          {/* Email card */}
          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">
              {t.hero.cta}
            </h3>
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  placeholder={t.waitlist.placeholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-11 md:h-9 px-3 rounded-md bg-white/10 border border-white/20 text-white placeholder:text-slate-400 focus:border-violet-400 focus:outline-none transition-colors text-sm"
                />
                <Button type="submit" className="w-full" disabled={sending}>
                  {sending ? "..." : t.waitlist.cta}
                </Button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 text-violet-300"
              >
                <span className="text-lg">✓</span>
                <span className="text-base">{t.waitlist.success}</span>
              </motion.div>
            )}
          </Card>

          {/* Feature dots */}
          <div className="flex flex-wrap gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-violet-400" />
              <span>Ticho a klid</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Rychlý internet</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-violet-300" />
              <span>Flexibilní využití</span>
            </div>
          </div>
        </motion.div>

        {/* Right column — image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-2xl">
            <Image
              src="/01.jpg"
              alt="CalmPod workspace"
              width={700}
              height={500}
              className="w-full h-[300px] md:h-[450px] object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        </motion.div>
      </div>

      {/* Bottom tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="text-center text-slate-500 text-sm mt-12"
      >
        {t.hero.ctaSub}
      </motion.p>
    </section>
  );
}
