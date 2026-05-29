"use client";

import { DiscordLogo, InstagramLogo, EnvelopeSimple } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import Link from "next/link";
import type { Translations } from "@/lib/types";

interface FooterProps {
  t: Translations;
}

export function Footer({ t }: FooterProps) {
  return (
    <footer className="w-full px-6 py-8 border-t border-white/5">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left — copy + tagline */}
          <div className="text-slate-500 text-sm">
            {t.footer.copy} — {t.footer.tagline}
          </div>

          {/* Center — links */}
          <div className="flex items-center gap-4">
            <a
              href={`mailto:${t.footer.contact}`}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
            >
              <EnvelopeSimple size={16} weight="light" />
              {t.footer.contact}
            </a>
            <span className="text-slate-700">|</span>
            <Link
              href="/zasady-ochrany-osobnich-udaju"
              className="text-slate-500 hover:text-white transition-colors text-sm"
            >
              {t.footer.privacy}
            </Link>
          </div>

          {/* Right — social links */}
          <div className="flex items-center gap-4">
            <a
              href="https://discord.gg/SF4DPkf4Q"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-[#5865F2] transition-colors"
              aria-label="Discord"
            >
              <DiscordLogo size={20} weight="fill" />
            </a>
            <a
              href="#"
              className="text-slate-500 hover:text-pink-400 transition-colors"
              aria-label="Instagram"
            >
              <InstagramLogo size={20} weight="light" />
            </a>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
