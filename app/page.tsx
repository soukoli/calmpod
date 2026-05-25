"use client";

import { useState } from "react";
import { translations } from "@/lib/translations";
import type { Lang } from "@/lib/types";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import {
  Navbar,
  Hero,
  Problem,
  Solution,
  Personas,
  Gallery,
  Hosts,
  FutureNetwork,
  Contribute,
  CommunityWaitlist,
  Footer,
} from "@/components/sections";

export default function Home() {
  const [lang, setLang] = useState<Lang>("cz");
  const [menuOpen, setMenuOpen] = useState(false);

  const t = translations[lang];

  return (
    <>
      <AnimatedBackground />
      <div className="relative z-10 min-h-screen flex flex-col">
        <Navbar
          lang={lang}
          t={t}
          setLang={setLang}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
        />
        <Hero t={t} />
        <Problem t={t} />
        <Solution t={t} />
        <Personas t={t} />
        <Gallery t={t} />
        <Contribute t={t} />
        <Hosts t={t} />
        <FutureNetwork t={t} />
        <CommunityWaitlist t={t} />
        <Footer t={t} />
      </div>
    </>
  );
}
