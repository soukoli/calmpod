"use client";

import { useState, useEffect } from "react";
import { DiscordLogo, PaperPlaneTilt } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { SectionWrapper, Badge, Button, Card, RevealOnScroll } from "@/components/ui";
import type { Translations } from "@/lib/types";

interface CommunityWaitlistProps {
  t: Translations;
  prefillMessage?: string;
}

export function CommunityWaitlist({ t, prefillMessage }: CommunityWaitlistProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(prefillMessage || "");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    if (prefillMessage) {
      setMessage(prefillMessage);
    }
  }, [prefillMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setSending(true);
    setError(false);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <SectionWrapper id="waitlist" className="py-24">
      <RevealOnScroll>
        <div className="text-center mb-10">
          <Badge className="mb-4">{t.waitlist.tag}</Badge>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {t.waitlist.headline}
          </h2>
          <p className="text-slate-400 text-sm">
            {t.waitlist.sub}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Left card — Contact form */}
          <Card className="p-6">
            <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <PaperPlaneTilt size={18} weight="light" className="text-violet-300" />
              {t.waitlist.formTitle}
            </h3>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 text-violet-300 p-4 rounded-lg bg-violet-500/10 border border-violet-500/20"
              >
                <span className="text-lg">✓</span>
                <span className="text-sm font-medium">{t.waitlist.success}</span>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.waitlist.namePlaceholder}
                  required
                  className="w-full h-11 md:h-9 px-3 rounded-md bg-white/10 border border-white/20 text-white placeholder:text-slate-400 focus:border-violet-400 focus:outline-none transition-colors text-sm"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.waitlist.placeholder}
                  required
                  className="w-full h-11 md:h-9 px-3 rounded-md bg-white/10 border border-white/20 text-white placeholder:text-slate-400 focus:border-violet-400 focus:outline-none transition-colors text-sm"
                />
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t.waitlist.messagePlaceholder}
                  required
                  rows={4}
                  className="w-full px-3 py-2 rounded-md bg-white/10 border border-white/20 text-white placeholder:text-slate-400 focus:border-violet-400 focus:outline-none transition-colors text-sm resize-none"
                />
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/10 text-violet-500 focus:ring-violet-400 focus:ring-offset-0 shrink-0"
                  />
                  <span className="text-xs text-slate-400 leading-relaxed">
                    {t.privacy.consent}{" "}
                    <Link
                      href="/zasady-ochrany-osobnich-udaju"
                      className="text-violet-400 hover:text-violet-300 underline"
                    >
                      {t.privacy.link}
                    </Link>
                  </span>
                </label>
                <Button type="submit" variant="primary" size="md" className="w-full" disabled={!consent || sending}>
                  {sending ? "..." : t.waitlist.cta}
                </Button>
                {error && (
                  <p className="text-red-400 text-sm text-center">
                    Něco se pokazilo. Zkus to znovu.
                  </p>
                )}
              </form>
            )}
          </Card>

          {/* Right card — Discord */}
          <Card className="p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                <DiscordLogo size={18} weight="fill" className="text-[#5865F2]" />
                {t.waitlist.discordTitle}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                {t.waitlist.discordText}
              </p>
            </div>

            <a
              href="https://discord.gg/SF4DPkf4Q"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="secondary" size="md" className="w-full">
                <DiscordLogo size={18} weight="fill" />
                {t.discord.cta}
              </Button>
            </a>
          </Card>
        </div>
      </RevealOnScroll>
    </SectionWrapper>
  );
}
