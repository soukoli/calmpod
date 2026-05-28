"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, RocketLaunch, MapPin } from "@phosphor-icons/react";
import { SectionWrapper, Badge, Card, Button, RevealOnScroll } from "@/components/ui";
import { LocationPicker } from "@/components/ui/LocationPicker";
import type { Translations } from "@/lib/types";

interface ContributeProps {
  t: Translations;
}

export function Contribute({ t }: ContributeProps) {
  const [location, setLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [mapExpanded, setMapExpanded] = useState(false);

  const handleLocationSelect = useCallback((lat: number, lng: number, address: string) => {
    setLocation({ lat, lng, address });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !location) return;

    setSending(true);
    const message = [
      `📍 Navrhovaná lokace: ${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}`,
      `📍 Adresa: ${location.address}`,
      note ? `\nPoznámka: ${note}` : "",
    ].join("\n");

    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Návrh místa", email, message }),
      });
    } catch { /* silent */ }

    setSubmitted(true);
    setSending(false);
  };

  const scrollToContact = () => {
    document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <SectionWrapper id="contribute" className="py-24">
      <RevealOnScroll>
        <div className="text-center mb-14">
          <Badge className="mb-4">{t.contribute.tag}</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-white max-w-2xl mx-auto leading-tight">
            {t.contribute.headline}
          </h2>
        </div>
      </RevealOnScroll>

      {/* Top 2 cards */}
      <div className="grid md:grid-cols-2 gap-4 mb-12">
        <RevealOnScroll delay={0}>
          <Card className="p-6 h-full flex flex-col">
            <div className="w-11 h-11 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4">
              <Lightbulb size={22} weight="light" className="text-violet-300" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">
              {t.contribute.cards[0].title}
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4 flex-1">
              {t.contribute.cards[0].description}
            </p>
            <Button variant="outline" size="sm" onClick={scrollToContact}>
              {t.contribute.cards[0].cta}
            </Button>
          </Card>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1}>
          <Card className="p-6 h-full flex flex-col">
            <div className="w-11 h-11 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4">
              <RocketLaunch size={22} weight="light" className="text-violet-300" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">
              {t.contribute.cards.length > 2 ? t.contribute.cards[2].title : "Early Access"}
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4 flex-1">
              {t.contribute.cards.length > 2 ? t.contribute.cards[2].description : "Buď mezi prvními, kdo zažije CalmPod."}
            </p>
            <Button variant="outline" size="sm" onClick={scrollToContact}>
              {t.contribute.cards.length > 2 ? t.contribute.cards[2].cta : "Získat přístup"}
            </Button>
          </Card>
        </RevealOnScroll>
      </div>

      {/* Map section — expandable */}
      <div className="space-y-5">
        <AnimatePresence mode="wait">
          {!mapExpanded ? (
            <motion.div
              key="map-trigger"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                className="p-6 cursor-pointer hover:border-violet-500/30 transition-colors"
              >
                <button
                  onClick={() => setMapExpanded(true)}
                  className="w-full flex items-center gap-4 text-left"
                >
                  <div className="w-11 h-11 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                    <MapPin size={22} weight="light" className="text-violet-300" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-white">
                      Označ místo na mapě
                    </h3>
                    <p className="text-sm text-slate-400">
                      Znáš perfektní lokalitu? Klikni a ukaž nám ji.
                    </p>
                  </div>
                  <div className="text-violet-400 text-sm font-medium shrink-0">
                    Otevřít mapu →
                  </div>
                </button>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="map-content"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="space-y-5"
            >
              {/* Map header */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                  <MapPin size={20} weight="light" className="text-violet-300" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">
                    Označ místo na mapě
                  </h3>
                  <p className="text-sm text-slate-400">
                    Klikni na mapu pro umístění pinu.
                  </p>
                </div>
              </div>

              {/* Map */}
              <LocationPicker
                onLocationSelect={handleLocationSelect}
                hint="Klepni na mapu pro umístění pinu"
              />

              {/* Form — appears after pin placement */}
              <AnimatePresence>
                {location && !submitted && (
                  <motion.form
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    onSubmit={handleSubmit}
                    className="space-y-3 max-w-md"
                  >
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tvuj@email.cz"
                      required
                      className="w-full h-11 md:h-9 px-3 rounded-md bg-white/10 border border-white/20 text-white placeholder:text-slate-400 focus:border-violet-400 focus:outline-none transition-colors text-sm"
                    />
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Proč zrovna tohle místo? (volitelné)"
                      rows={2}
                      className="w-full px-3 py-2 rounded-md bg-white/10 border border-white/20 text-white placeholder:text-slate-400 focus:border-violet-400 focus:outline-none transition-colors text-sm resize-none"
                    />
                    <Button type="submit" variant="primary" size="md">
                      {sending ? "Odesílám..." : "Odeslat návrh"}
                    </Button>
                  </motion.form>
                )}

                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 text-violet-300 p-4 rounded-lg bg-violet-500/10 border border-violet-500/20"
                  >
                    <span className="text-lg">✓</span>
                    <span className="text-sm font-medium">
                      Díky! Tvůj návrh místa jsme přijali. Ozveme se.
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SectionWrapper>
  );
}
