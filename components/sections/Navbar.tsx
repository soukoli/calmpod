"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { List, X, DiscordLogo } from "@phosphor-icons/react";
import { Button } from "@/components/ui";
import type { Lang, Translations } from "@/lib/types";

interface NavbarProps {
  lang: Lang;
  t: Translations;
  setLang: (lang: Lang) => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

export function Navbar({ lang, t, setLang, menuOpen, setMenuOpen }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/60 backdrop-blur-xl border-b border-white/10"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2.5"
        >
          <Image src="/CP_logo_small.png" alt="CalmPod" width={28} height={28} className="rounded-full" />
          <span className="text-lg font-bold text-white tracking-tight">CalmPod</span>
        </motion.div>

        {/* Desktop nav */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden md:flex items-center gap-6 text-sm"
        >
          <button onClick={() => scrollTo("personas")} className="text-slate-300 hover:text-white transition-colors">
            {t.nav.personas}
          </button>
          <button onClick={() => scrollTo("gallery")} className="text-slate-300 hover:text-white transition-colors">
            {t.nav.spaces}
          </button>
          <button onClick={() => scrollTo("contribute")} className="text-slate-300 hover:text-white transition-colors">
            {t.nav.contribute}
          </button>
          <button
            onClick={() => setLang(lang === "en" ? "cz" : "en")}
            className="text-slate-400 hover:text-white text-xs font-semibold tracking-wider transition-colors"
          >
            {t.langToggle}
          </button>
          <a
            href="https://discord.gg/SF4DPkf4Q"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-[#5865F2] transition-colors"
            aria-label="Discord"
          >
            <DiscordLogo size={20} weight="fill" />
          </a>
          <Button variant="primary" size="sm" onClick={() => scrollTo("waitlist")}>
            {t.nav.join}
          </Button>
        </motion.div>

        {/* Mobile */}
        <button
          className="md:hidden text-slate-300 hover:text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={22} /> : <List size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-black/80 backdrop-blur-xl border-t border-white/10 px-6 py-5 flex flex-col gap-4 text-sm">
          <button onClick={() => scrollTo("personas")} className="text-left text-slate-300 hover:text-white">{t.nav.personas}</button>
          <button onClick={() => scrollTo("gallery")} className="text-left text-slate-300 hover:text-white">{t.nav.spaces}</button>
          <button onClick={() => scrollTo("contribute")} className="text-left text-slate-300 hover:text-white">{t.nav.contribute}</button>
          <button onClick={() => { setLang(lang === "en" ? "cz" : "en"); setMenuOpen(false); }} className="text-left text-slate-300">{lang === "en" ? "Česky" : "English"}</button>
          <Button variant="primary" size="sm" onClick={() => scrollTo("waitlist")} className="w-fit">{t.nav.join}</Button>
        </div>
      )}
    </nav>
  );
}
