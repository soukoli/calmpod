"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react";

const cs = {
  title: "Zasady ochrany osobnich udaju",
  lastUpdated: "Posledni aktualizace: 29. 5. 2026",
  sections: [
    {
      heading: "1. Spravce udaju",
      content:
        "Spravcem vasich osobnich udaju je CalmPod. Kontakt pro veskere dotazy ohledne zpracovani osobnich udaju: support@calmpod.cz.",
    },
    {
      heading: "2. Jake udaje shromazdujeme",
      content:
        "Shromazdujeme pouze udaje, ktere nam sami poskytnete prostrednictvim formularu na nasem webu:",
      list: [
        "E-mailova adresa",
        "Jmeno (volitelne)",
        "Souradnice a adresa navrhovane lokace (pri oznaceni mista na mape)",
        "Text zpravy ci poznamky",
      ],
    },
    {
      heading: "3. Ucel zpracovani",
      content: "Vase udaje zpracovavame za ucelem:",
      list: [
        "Zpracovani vasich navrhu lokaci pro sit CalmPod",
        "Odpovedi na vase dotazy a zpravy",
        "Informovani o novinkach projektu (pouze s vasim souhlasem)",
      ],
    },
    {
      heading: "4. Pravni zaklad",
      content:
        "Vase osobni udaje zpracovavame na zaklade vaseho souhlasu dle cl. 6 odst. 1 pism. a) Narizeni (EU) 2016/679 (GDPR). Souhlas udelujete zaskrtnutim prislusneho pole pri odeslani formulare. Souhlas muzete kdykoli odvolat zaslanim e-mailu na support@calmpod.cz.",
    },
    {
      heading: "5. Prijemci udaju",
      content:
        "Vase udaje mohou byt predany nasledujicim zpracovatelum, kteri zajistuji technicky provoz sluzby:",
      list: [
        "Vercel Inc. (hosting webove aplikace) — USA, s odpovdajicimi zarukami",
        "Neon Tech Inc. (databaze) — USA/EU",
        "Resend Inc. (odesilani e-mailu) — USA, s odpovdajicimi zarukami",
      ],
    },
    {
      heading: "6. Doba uchovani",
      content:
        "Vase osobni udaje uchovavame po dobu trvani projektu CalmPod, maximalne vsak 3 roky od jejich poskytuti, pokud svuj souhlas drive neodvolate.",
    },
    {
      heading: "7. Vase prava",
      content: "Mate pravo:",
      list: [
        "Na pristup ke svym osobnim udajum",
        "Na opravu nepresnych udaju",
        "Na vymazani udaju (pravo byt zapomenut)",
        "Na omezeni zpracovani",
        "Na prenositelnost udaju",
        "Odvolat souhlas se zpracovanim",
        "Podat stiznost u dozoroveho uradu",
      ],
      footer:
        "Pro uplatneni svych prav nas kontaktujte na support@calmpod.cz. Na vas pozadavek odpovime nejpozdeji do 30 dnu.",
    },
    {
      heading: "8. Dozorovy urad",
      content:
        "Dozorovym uradem je Urad pro ochranu osobnich udaju (UOOU), Pplk. Sochora 27, 170 00 Praha 7, www.uoou.cz.",
    },
    {
      heading: "9. Soubory cookies",
      content:
        "Nas web nepouziva zadne sledovaci cookies ani nastroje tretich stran. Analytika (Vercel Analytics) je zcela anonymni a neukada zadne osobni udaje ani cookies na vasem zarizeni.",
    },
  ],
};

const en = {
  title: "Privacy Policy",
  lastUpdated: "Last updated: May 29, 2026",
  sections: [
    {
      heading: "1. Data Controller",
      content:
        "The controller of your personal data is CalmPod. Contact for all questions regarding personal data processing: support@calmpod.cz.",
    },
    {
      heading: "2. Data We Collect",
      content:
        "We only collect data that you voluntarily provide through forms on our website:",
      list: [
        "Email address",
        "Name (optional)",
        "Coordinates and address of suggested location (when marking a place on the map)",
        "Message or note text",
      ],
    },
    {
      heading: "3. Purpose of Processing",
      content: "We process your data for the following purposes:",
      list: [
        "Processing your location suggestions for the CalmPod network",
        "Responding to your questions and messages",
        "Informing you about project updates (only with your consent)",
      ],
    },
    {
      heading: "4. Legal Basis",
      content:
        "We process your personal data based on your consent pursuant to Art. 6(1)(a) of Regulation (EU) 2016/679 (GDPR). You give consent by checking the relevant checkbox when submitting a form. You may withdraw your consent at any time by sending an email to support@calmpod.cz.",
    },
    {
      heading: "5. Data Recipients",
      content:
        "Your data may be shared with the following processors that provide technical infrastructure:",
      list: [
        "Vercel Inc. (web application hosting) — USA, with appropriate safeguards",
        "Neon Tech Inc. (database) — USA/EU",
        "Resend Inc. (email delivery) — USA, with appropriate safeguards",
      ],
    },
    {
      heading: "6. Retention Period",
      content:
        "We retain your personal data for the duration of the CalmPod project, but no longer than 3 years from the date of submission, unless you withdraw your consent earlier.",
    },
    {
      heading: "7. Your Rights",
      content: "You have the right to:",
      list: [
        "Access your personal data",
        "Rectify inaccurate data",
        "Erase your data (right to be forgotten)",
        "Restrict processing",
        "Data portability",
        "Withdraw consent",
        "Lodge a complaint with the supervisory authority",
      ],
      footer:
        "To exercise your rights, contact us at support@calmpod.cz. We will respond to your request within 30 days.",
    },
    {
      heading: "8. Supervisory Authority",
      content:
        "The supervisory authority is the Office for Personal Data Protection (UOOU), Pplk. Sochora 27, 170 00 Prague 7, Czech Republic, www.uoou.cz.",
    },
    {
      heading: "9. Cookies",
      content:
        "Our website does not use any tracking cookies or third-party tools. Analytics (Vercel Analytics) is fully anonymous and does not store any personal data or cookies on your device.",
    },
  ],
};

export default function PrivacyPolicyPage() {
  const [lang, setLang] = useState<"cs" | "en">("cs");
  const t = lang === "cs" ? cs : en;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-violet-950 to-slate-900">
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-12">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft size={16} weight="light" />
            {lang === "cs" ? "Zpet" : "Back"}
          </Link>
          <button
            onClick={() => setLang(lang === "cs" ? "en" : "cs")}
            className="text-sm text-slate-400 hover:text-white transition-colors border border-white/10 rounded-md px-3 py-1"
          >
            {lang === "cs" ? "EN" : "CZ"}
          </button>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          {t.title}
        </h1>
        <p className="text-slate-500 text-sm mb-10">{t.lastUpdated}</p>

        {/* Sections */}
        <div className="space-y-8">
          {t.sections.map((section, i) => (
            <section key={i}>
              <h2 className="text-lg font-semibold text-white mb-2">
                {section.heading}
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                {section.content}
              </p>
              {section.list && (
                <ul className="mt-2 space-y-1">
                  {section.list.map((item, j) => (
                    <li
                      key={j}
                      className="text-slate-400 text-sm pl-4 before:content-['•'] before:absolute before:left-0 relative"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              {"footer" in section && section.footer && (
                <p className="text-slate-400 text-sm mt-3 italic">
                  {section.footer}
                </p>
              )}
            </section>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-16 pt-8 border-t border-white/5">
          <p className="text-slate-500 text-xs text-center">
            CalmPod — support@calmpod.cz
          </p>
        </div>
      </div>
    </main>
  );
}
